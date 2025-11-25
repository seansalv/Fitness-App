import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, LinearGradient as SvgGradient, Path, Stop } from 'react-native-svg';
import Slider from '@react-native-community/slider';

import { ONBOARDING_QUESTIONS } from '@/src/config/onboarding';
import { palette } from '@/src/theme/palette';
import { saveOnboardingAnswers } from '@/src/services/storage';
import type { OnboardingAnswerValue } from '@hero-arc/shared';

type AnswerValue = OnboardingAnswerValue;

const isObjectValue = (value: AnswerValue | undefined): value is Record<string, any> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const ensureArray = (value: AnswerValue | undefined) => (Array.isArray(value) ? value : []);

const questionHasValue = (question: (typeof ONBOARDING_QUESTIONS)[number], value: AnswerValue | undefined) => {
  switch (question.type) {
    case 'input':
    case 'wheel':
      return typeof value === 'string' && value.length > 0;
    case 'weight':
      return isObjectValue(value) && typeof value.value === 'string' && value.value.length > 0;
    case 'height':
      return (
        isObjectValue(value) &&
        ((value.unit === 'ft' && value.feet && value.inches !== undefined) ||
          (value.unit === 'cm' && value.cm))
      );
    case 'slider':
      return isObjectValue(value) && typeof value.value === 'number';
    case 'schedule':
      return isObjectValue(value) && Array.isArray(value.days) && value.days.length > 0;
    case 'summary':
      return true;
    default:
      return value ? !Array.isArray(value) || value.length > 0 : false;
  }
};

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});

  const questions = ONBOARDING_QUESTIONS;
  const ageOptions = useMemo(() => Array.from({ length: 87 }, (_, idx) => (idx + 13).toString()), []);
  const weightLbOptions = useMemo(
    () => Array.from({ length: 321 }, (_, idx) => (80 + idx).toString()),
    [],
  );
  const weightKgOptions = useMemo(
    () => Array.from({ length: 171 }, (_, idx) => (35 + idx).toString()),
    [],
  );
  const heightCmOptions = useMemo(
    () => Array.from({ length: 121 }, (_, idx) => (140 + idx).toString()),
    [],
  );

  const current = questions[step];
  const total = questions.length;
  const selected = current ? answers[current.id] : undefined;
  const progress = total > 0 ? (step + 1) / total : 0;

  useEffect(() => {
    if (current?.type === 'wheel' && !selected) {
      setAnswers((prev) => ({ ...prev, [current.id]: ageOptions[0] }));
    }
  }, [current, selected, ageOptions]);

  const handleSelect = (value: string) => {
    setAnswers((prev) => {
      if (current.multi) {
        const existing = ensureArray(prev[current.id]);
        if (value === 'full' && current.id === 'focus') {
          return { ...prev, [current.id]: current.options.map((o) => o.value) };
        }
        const filteredFull = existing.filter((v) => v !== 'full');
        const next = filteredFull.includes(value)
          ? filteredFull.filter((v) => v !== value)
          : [...filteredFull, value];
        return { ...prev, [current.id]: next };
      }
      return { ...prev, [current.id]: value };
    });
  };

  const handleContinue = async () => {
    if (!current) return;
    if (!questionHasValue(current, selected)) return;
    if (step === total - 1) {
      await saveOnboardingAnswers(answers);
      router.push('/(auth)/auth');
    } else {
      setStep((prev) => prev + 1);
    }
  };

  if (!current) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.prompt}>{current.prompt}</Text>
        {renderQuestionBody()}
      </ScrollView>
      <Pressable
        style={[
          styles.cta,
          !questionHasValue(current, selected) && styles.ctaDisabled,
        ]}
        onPress={handleContinue}
        disabled={!questionHasValue(current, selected)}
      >
        <Text style={styles.ctaLabel}>{step === total - 1 ? 'Finish' : 'Continue'}</Text>
      </Pressable>
      <View style={styles.gesture} />
    </View>
  );

  function renderQuestionBody() {
    if (!current) return null;
    if (current.type === 'input') {
      return (
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder={current.placeholder ?? ''}
            placeholderTextColor="#5f678a"
            keyboardType="numeric"
            value={(selected as string) ?? ''}
            onChangeText={(text) => setAnswers((prev) => ({ ...prev, [current.id]: text }))}
          />
        </View>
      );
    }
    if (current.type === 'wheel') {
      return (
        <WheelPicker
          values={ageOptions}
          selectedValue={(selected as string) ?? ageOptions[0]}
          onChange={(value) => setAnswers((prev) => ({ ...prev, [current.id]: value }))}
        />
      );
    }
    if (current.type === 'weight') {
      return renderWeightQuestion();
    }
    if (current.type === 'height') {
      return renderHeightQuestion();
    }
    if (current.type === 'slider') {
      return renderFrequencyQuestion();
    }
    if (current.type === 'chips') {
      return renderChipOptions();
    }
    if (current.type === 'schedule') {
      return renderScheduleQuestion();
    }
    if (current.type === 'summary') {
      return renderSummaryScreen();
    }
    return renderSelectOptions();
  }

  function renderSelectOptions() {
    return (
      <View style={styles.options}>
        {current.options.map((option) => {
          const isActive = Array.isArray(selected)
            ? selected.includes(option.value)
            : selected === option.value;
          return (
            <Pressable
              key={option.value}
              style={[styles.option, isActive && styles.optionActive]}
              onPress={() => handleSelect(option.value)}
            >
              <View style={styles.optionRow}>
                <View style={styles.optionTextWrap}>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                  {option.helper && <Text style={styles.optionHelper}>{option.helper}</Text>}
                </View>
                {option.icon && <Text style={styles.optionIcon}>{option.icon}</Text>}
              </View>
            </Pressable>
          );
        })}
      </View>
    );
  }

  function renderChipOptions() {
    const values = ensureArray(selected);
    return (
      <View style={styles.chipGrid}>
        {current.options.map((option) => {
          const isActive = values.includes(option.value);
          return (
            <Pressable
              key={option.value}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => handleSelect(option.value)}
            >
              <Text style={isActive ? styles.chipLabelActive : styles.chipLabel}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>
    );
  }

  function renderWeightQuestion() {
    const obj = isObjectValue(selected) && 'unit' in selected ? selected : { unit: 'lbs', value: '165' };
    const unit = obj.unit === 'kg' ? 'kg' : 'lbs';
    const value = obj.value ?? (unit === 'lbs' ? '165' : '75');
    const values = unit === 'lbs' ? weightLbOptions : weightKgOptions;

    const update = (next: { unit: 'lbs' | 'kg'; value: string }) =>
      setAnswers((prev) => ({ ...prev, [current.id]: next }));

    const handleUnitChange = (nextUnit: 'lbs' | 'kg') => {
      if (nextUnit === unit) return;
      const numeric = parseInt(value, 10) || 0;
      const converted = nextUnit === 'kg' ? lbsToKg(numeric) : kgToLbs(numeric);
      update({ unit: nextUnit, value: converted.toString() });
    };

    return (
      <View style={styles.weightWrapper}>
        <WheelPicker values={values} selectedValue={value} onChange={(val) => update({ unit, value: val })} />
        <View style={styles.unitSwitch}>
          <Pressable
            style={[styles.unitPill, unit === 'kg' && styles.unitPillActive]}
            onPress={() => handleUnitChange('kg')}
          >
            <Text style={unit === 'kg' ? styles.unitLabelActive : styles.unitLabel}>kg</Text>
          </Pressable>
          <Pressable
            style={[styles.unitPill, unit === 'lbs' && styles.unitPillActive]}
            onPress={() => handleUnitChange('lbs')}
          >
            <Text style={unit === 'lbs' ? styles.unitLabelActive : styles.unitLabel}>lbs</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  function renderHeightQuestion() {
    const obj = isObjectValue(selected) ? selected : { unit: 'ft', feet: '5', inches: '7' };
    const unit = obj.unit === 'cm' ? 'cm' : 'ft';

    const update = (next: Record<string, any>) =>
      setAnswers((prev) => ({ ...prev, [current.id]: next }));

    const handleUnitChange = (nextUnit: 'ft' | 'cm') => {
      if (nextUnit === unit) return;
      if (nextUnit === 'cm') {
        const feet = parseInt(obj.feet ?? '5', 10) || 5;
        const inches = parseInt(obj.inches ?? '7', 10) || 0;
        const cm = feetAndInchesToCm(feet, inches);
        update({ unit: 'cm', cm: cm.toString() });
      } else {
        const cm = parseInt(obj.cm ?? '170', 10) || 170;
        const { feet, inches } = cmToFeetAndInches(cm);
        update({ unit: 'ft', feet: feet.toString(), inches: inches.toString() });
      }
    };

    if (unit === 'cm') {
      return (
        <View style={styles.heightWrapper}>
          <WheelPicker
            values={heightCmOptions}
            selectedValue={obj.cm ?? '170'}
            onChange={(val) => update({ unit: 'cm', cm: val })}
          />
          <View style={styles.unitSwitch}>
            <Pressable
              style={[styles.unitPill, unit === 'cm' && styles.unitPillActive]}
              onPress={() => handleUnitChange('cm')}
            >
              <Text style={unit === 'cm' ? styles.unitLabelActive : styles.unitLabel}>cm</Text>
            </Pressable>
            <Pressable
              style={[styles.unitPill, unit === 'ft' && styles.unitPillActive]}
              onPress={() => handleUnitChange('ft')}
            >
              <Text style={unit === 'ft' ? styles.unitLabelActive : styles.unitLabel}>ft</Text>
            </Pressable>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.heightWrapper}>
        <View style={styles.heightRow}>
          <WheelPicker
            values={HEIGHT_FEET}
            selectedValue={obj.feet ?? '5'}
            onChange={(val) => update({ unit: 'ft', feet: val, inches: obj.inches ?? '7' })}
          />
          <WheelPicker
            values={HEIGHT_INCHES}
            selectedValue={obj.inches ?? '7'}
            onChange={(val) => update({ unit: 'ft', feet: obj.feet ?? '5', inches: val })}
          />
        </View>
        <View style={styles.unitSwitch}>
          <Pressable
            style={[styles.unitPill, unit === 'cm' && styles.unitPillActive]}
            onPress={() => handleUnitChange('cm')}
          >
            <Text style={unit === 'cm' ? styles.unitLabelActive : styles.unitLabel}>cm</Text>
          </Pressable>
          <Pressable
            style={[styles.unitPill, unit === 'ft' && styles.unitPillActive]}
            onPress={() => handleUnitChange('ft')}
          >
            <Text style={unit === 'ft' ? styles.unitLabelActive : styles.unitLabel}>ft</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  function renderFrequencyQuestion() {
    const value =
      isObjectValue(selected) && typeof selected.value === 'number' ? selected.value : DEFAULT_FREQUENCY;
    return (
      <View style={styles.sliderWrapper}>
        <Text style={styles.frequencyValue}>{value}x</Text>
        <Text style={styles.frequencyCaption}>{value} workouts a week</Text>
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={1}
          maximumValue={7}
          step={1}
          minimumTrackTintColor="#65cfff"
          maximumTrackTintColor="#1f2742"
          thumbTintColor="#65cfff"
          value={value}
          onValueChange={(val) => setAnswers((prev) => ({ ...prev, [current.id]: { value: Math.round(val) }}))}
        />
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderLabel}>Less</Text>
          <Text style={styles.sliderLabel}>More</Text>
        </View>
      </View>
    );
  }

  function renderScheduleQuestion() {
    const obj = isObjectValue(selected) ? selected : { days: [], reminder: true };
    const days = Array.isArray(obj.days) ? obj.days : [];
    const reminder = typeof obj.reminder === 'boolean' ? obj.reminder : true;

    const toggleDay = (day: string) => {
      const next = days.includes(day) ? days.filter((d) => d !== day) : [...days, day];
      setAnswers((prev) => ({ ...prev, [current.id]: { days: next, reminder } }));
    };

    return (
      <View style={styles.scheduleWrapper}>
        <View style={styles.dayGrid}>
          {SCHEDULE_DAYS.map((day) => {
            const isActive = days.includes(day);
            return (
              <Pressable
                key={day}
                style={[styles.dayChip, isActive && styles.dayChipActive]}
                onPress={() => toggleDay(day)}
              >
                <Text style={isActive ? styles.dayChipLabelActive : styles.dayChipLabel}>{day}</Text>
              </Pressable>
            );
          })}
        </View>
        <View style={styles.reminderRow}>
          <View>
            <Text style={styles.reminderTitle}>Reminder</Text>
            <Text style={styles.reminderSubtitle}>Helps to keep your arc alive</Text>
          </View>
          <Switch
            value={reminder}
            onValueChange={(val) => setAnswers((prev) => ({ ...prev, [current.id]: { days, reminder: val } }))}
            trackColor={{ true: '#65cfff', false: '#1f2640' }}
            thumbColor="#ffffff"
          />
        </View>
      </View>
    );
  }

  function renderSummaryScreen() {
    const currentWeight = getWeightDisplay(answers.weight);
    const targetWeight = getWeightDisplay(answers.target_weight);
    const bmi = computeBmi(answers.weight, answers.height);
    const bmiLabel = bmi ? describeBmi(bmi) : 'Unknown';
    const fitnessLevel = (answers.experience as string) ?? 'Unknown';
    const activityLevel = (answers.activity as string) ?? 'Unknown';
    const focusAreas = Array.isArray(answers.focus) ? answers.focus.join(', ') : (answers.focus as string) ?? '—';
    const frequency =
      isObjectValue(answers.frequency) && typeof answers.frequency.value === 'number'
        ? answers.frequency.value
        : DEFAULT_FREQUENCY;
    const equipment = Array.isArray(answers.equipment) ? answers.equipment : [];
    const schedule = isObjectValue(answers.schedule) ? answers.schedule : { days: [], reminder: true };

    return (
      <View style={styles.summaryWrapper}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryHeading}>Weight mission</Text>
          <WeightTrendChart
            currentLabel={currentWeight}
            targetLabel={targetWeight}
            diffLabel={describeDelta(answers.weight, answers.target_weight)}
          />
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryHeading}>BMI Index</Text>
          <Text style={styles.bmiValue}>{bmi ?? '—'}</Text>
          <Text style={[styles.bmiLabel, { color: bmiColor(bmi) }]}>{bmiLabel}</Text>
          <View style={styles.bmiSegmentBar}>
            {BMI_SEGMENTS.map((segment) => (
              <View key={segment.label} style={[styles.bmiSegment, { backgroundColor: segment.color }]} />
            ))}
            {bmi && <View style={[styles.bmiPointer, { left: bmiPointerPosition(bmi) }]} />}
          </View>
          <View style={styles.bmiLegend}>
            {BMI_SEGMENTS.map((segment) => (
              <Text key={segment.label} style={styles.bmiLegendLabel}>
                {segment.label}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryHeading}>Profile</Text>
          <SummaryItem title="Fitness level" value={humanizeExperience(fitnessLevel)} />
          <SummaryItem title="Activity level" value={humanize(activityLevel)} />
          <SummaryItem title="Target areas" value={humanizeList(focusAreas)} />
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryHeading}>Weekly Plan</Text>
          <Text style={styles.frequencyValue}>{frequency}x</Text>
          <Text style={styles.frequencyCaption}>{frequency} workouts per week</Text>
          <Text style={styles.summarySubtext}>Equipment: {equipment.length ? humanizeList(equipment.join(', ')) : 'Bodyweight'}</Text>
          <Text style={styles.summarySubtext}>
            Days: {Array.isArray(schedule.days) && schedule.days.length ? schedule.days.join(', ') : 'Flexible'}
          </Text>
          <Text style={styles.summarySubtext}>
            Smart reminders: {schedule.reminder ? 'Enabled' : 'Disabled'}
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryHeading}>System Advice</Text>
          <Text style={styles.summaryAdvice}>
            Focus on a sustainable progression. Prioritize balanced meals, hydration, & consistent training. Keep your
            Hero Arc alive by tracking quests daily.
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
    padding: 24,
    paddingBottom: 40,
  },
  progressTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: '#1c2238',
    marginTop: 16,
    marginBottom: 32,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#65cfff',
  },
  content: {
    flexGrow: 1,
    gap: 16,
  },
  prompt: {
    fontSize: 26,
    fontWeight: '700',
    color: palette.textPrimary,
    textAlign: 'center',
  },
  options: {
    gap: 12,
  },
  option: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1f2640',
    padding: 18,
    backgroundColor: '#0a0f20',
  },
  optionActive: {
    borderColor: '#3dd598',
    backgroundColor: '#0f2b24',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionTextWrap: {
    flex: 1,
    gap: 4,
  },
  optionLabel: {
    color: palette.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  optionHelper: {
    color: palette.textSecondary,
    fontSize: 13,
  },
  optionIcon: {
    fontSize: 20,
    color: '#9fb4ff',
  },
  inputWrapper: {
    marginTop: 12,
  },
  input: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1f2640',
    paddingVertical: 14,
    paddingHorizontal: 18,
    color: palette.textPrimary,
    backgroundColor: '#0a0f20',
    fontSize: 20,
    textAlign: 'center',
  },
  wheelWrapper: {
    borderWidth: 1,
    borderColor: '#1f2640',
    borderRadius: 20,
    backgroundColor: '#0a0f20',
    height: 240,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  weightWrapper: {
    gap: 16,
  },
  heightWrapper: {
    gap: 16,
  },
  heightRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  unitSwitch: {
    flexDirection: 'row',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#1f2640',
    borderRadius: 999,
    overflow: 'hidden',
  },
  unitPill: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    backgroundColor: 'transparent',
  },
  unitPillActive: {
    backgroundColor: '#1a233c',
  },
  unitLabel: {
    color: palette.textSecondary,
    fontWeight: '600',
  },
  unitLabelActive: {
    color: palette.textPrimary,
    fontWeight: '700',
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#1f2640',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  chipActive: {
    borderColor: '#3dd598',
    backgroundColor: '#0f2b24',
  },
  chipLabel: {
    color: palette.textSecondary,
    fontWeight: '500',
  },
  chipLabelActive: {
    color: palette.textPrimary,
    fontWeight: '700',
  },
  sliderWrapper: {
    gap: 12,
    marginTop: 24,
  },
  frequencyValue: {
    color: '#65cfff',
    fontSize: 56,
    fontWeight: '800',
    textAlign: 'center',
  },
  frequencyCaption: {
    textAlign: 'center',
    color: palette.textSecondary,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -8,
  },
  sliderLabel: {
    color: palette.textSecondary,
    fontSize: 13,
  },
  scheduleWrapper: {
    gap: 20,
  },
  dayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  dayChip: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2640',
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  dayChipActive: {
    borderColor: '#65cfff',
    backgroundColor: '#132035',
  },
  dayChipLabel: {
    color: palette.textSecondary,
  },
  dayChipLabelActive: {
    color: '#65cfff',
    fontWeight: '700',
  },
  reminderRow: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1f2640',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reminderTitle: {
    color: palette.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  reminderSubtitle: {
    color: palette.textSecondary,
    fontSize: 12,
  },
  summaryWrapper: {
    gap: 18,
  },
  summaryCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1f2640',
    padding: 20,
    backgroundColor: '#0b1222',
    gap: 8,
  },
  summaryHeading: {
    color: palette.textSecondary,
    fontSize: 13,
    textTransform: 'uppercase',
  },
  summaryWeight: {
    color: palette.textPrimary,
    fontSize: 28,
    fontWeight: '800',
  },
  summarySubtext: {
    color: palette.textSecondary,
    fontSize: 13,
  },
  bmiValue: {
    color: palette.textPrimary,
    fontSize: 36,
    fontWeight: '800',
  },
  bmiLabel: {
    color: '#ffa25f',
    fontWeight: '700',
  },
  bmiScale: {
    height: 12,
    borderRadius: 999,
    backgroundColor: '#24304c',
    position: 'relative',
  },
  bmiIndicator: {
    position: 'absolute',
    top: -4,
    width: 2,
    height: 20,
    backgroundColor: '#fff',
  },
  bmiLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bmiLegendLabel: {
    color: palette.textSecondary,
    fontSize: 10,
  },
  bmiSegmentBar: {
    flexDirection: 'row',
    height: 12,
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 4,
    marginBottom: 4,
  },
  bmiSegment: {
    flex: 1,
  },
  bmiPointer: {
    position: 'absolute',
    top: -4,
    width: 2,
    height: 20,
    backgroundColor: '#fff',
  },
  summaryAdvice: {
    color: palette.textSecondary,
    lineHeight: 20,
  },
  weightChartContainer: {
    borderRadius: 18,
    padding: 16,
    overflow: 'hidden',
  },
  weightChartLabel: {
    position: 'absolute',
    top: 10,
    left: 16,
    color: '#ffb199',
    fontWeight: '700',
  },
  weightChartDiff: {
    color: palette.textSecondary,
  },
  cta: {
    marginTop: 24,
    borderRadius: 999,
    backgroundColor: palette.neon,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaDisabled: {
    opacity: 0.5,
  },
  ctaLabel: {
    color: '#050505',
    fontSize: 18,
    fontWeight: '700',
  },
  gesture: {
    width: '40%',
    height: 4,
    borderRadius: 999,
    backgroundColor: '#ffffff20',
    alignSelf: 'center',
    marginTop: 12,
  },
  wheelItem: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheelItemActive: {
    backgroundColor: '#1a233c',
  },
  wheelItemText: {
    color: palette.textSecondary,
    fontSize: 20,
  },
  wheelItemTextActive: {
    color: palette.textPrimary,
    fontSize: 26,
    fontWeight: '700',
  },
  wheelHighlight: {
    position: 'absolute',
    left: 16,
    right: 16,
    height: 48,
    borderWidth: 1,
    borderColor: '#3d7bff',
    borderRadius: 12,
    alignSelf: 'center',
  },
});

const WHEEL_ITEM_HEIGHT = 48;
const WHEEL_VISIBLE_ROWS = 5;

type WheelPickerProps = {
  values: string[];
  selectedValue: string;
  onChange: (value: string) => void;
};

const WheelPicker = ({ values, selectedValue, onChange }: WheelPickerProps) => {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const index = values.indexOf(selectedValue);
    if (index > -1) {
      scrollRef.current?.scrollTo({ y: index * WHEEL_ITEM_HEIGHT, animated: false });
    }
  }, [selectedValue, values]);

  const handleMomentum = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(event.nativeEvent.contentOffset.y / WHEEL_ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(values.length - 1, idx));
    const value = values[clamped];
    if (value) {
      onChange(value);
    }
  };

  return (
    <View style={styles.wheelWrapper}>
      <ScrollView
        ref={scrollRef}
        snapToInterval={WHEEL_ITEM_HEIGHT}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingVertical: ((WHEEL_VISIBLE_ROWS - 1) / 2) * WHEEL_ITEM_HEIGHT,
        }}
        onMomentumScrollEnd={handleMomentum}
      >
        {values.map((value) => {
          const active = value === selectedValue;
          return (
            <View key={value} style={[styles.wheelItem, active && styles.wheelItemActive]}>
              <Text style={active ? styles.wheelItemTextActive : styles.wheelItemText}>{value}</Text>
            </View>
          );
        })}
      </ScrollView>
      <View style={styles.wheelHighlight} pointerEvents="none" />
    </View>
  );
};

const HEIGHT_FEET = ['4', '5', '6', '7'];
const HEIGHT_INCHES = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
const SCHEDULE_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DEFAULT_FREQUENCY = 4;
const BMI_SEGMENTS = [
  { label: 'Underweight', color: '#3f9dff', min: 0, max: 18.5 },
  { label: 'Normal', color: '#49dd75', min: 18.5, max: 25 },
  { label: 'Overweight', color: '#f2c94c', min: 25, max: 30 },
  { label: 'Obese', color: '#ff8a65', min: 30, max: 40 },
];

const lbsToKg = (value: number) => Math.max(30, Math.round(value / 2.20462));
const kgToLbs = (value: number) => Math.max(60, Math.round(value * 2.20462));

const feetAndInchesToCm = (feet: number, inches: number) =>
  Math.round((feet * 12 + inches) * 2.54);

const cmToFeetAndInches = (cm: number) => {
  const totalInches = Math.round(cm / 2.54);
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return { feet, inches };
};

const SummaryItem = ({ title, value }: { title: string; value: string }) => (
  <View style={{ gap: 4 }}>
    <Text style={{ color: palette.textSecondary, fontSize: 12 }}>{title}</Text>
    <Text style={{ color: palette.textPrimary, fontSize: 16, fontWeight: '600' }}>{value}</Text>
  </View>
);

const WeightTrendChart = ({
  currentLabel,
  targetLabel,
  diffLabel,
}: {
  currentLabel: string;
  targetLabel: string;
  diffLabel: string;
}) => {
  const width = 280;
  const height = 140;
  const startX = 0;
  const startY = 30;
  const endX = width;
  const endY = height - 20;
  const controlX1 = width * 0.35;
  const controlY1 = Math.max(10, startY + 10);
  const controlX2 = width * 0.65;
  const controlY2 = endY - 40;
  const path = `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`;

  return (
    <View style={{ gap: 12 }}>
      <LinearGradient colors={['#1c2234', '#0d1424']} style={styles.weightChartContainer}>
        <Svg width={width} height={height}>
          <Defs>
            <SvgGradient id="weightGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#ff6b45" />
              <Stop offset="45%" stopColor="#fcb045" />
              <Stop offset="70%" stopColor="#f2c94c" />
              <Stop offset="100%" stopColor="#3dd598" />
            </SvgGradient>
          </Defs>
          <Path d={path} stroke="url(#weightGradient)" strokeWidth={6} fill="none" strokeLinecap="round" />
          <Path d={`M ${startX} ${startY} L ${startX} ${startY}`} stroke="#ff6b45" strokeWidth={9} strokeLinecap="round" />
          <Path d={`M ${endX} ${endY} L ${endX} ${endY}`} stroke="#3dd598" strokeWidth={9} strokeLinecap="round" />
        </Svg>
        <Text style={styles.weightChartLabel}>{currentLabel}</Text>
        <Text style={[styles.weightChartLabel, { right: 16, left: undefined, bottom: 10 }]}>{targetLabel}</Text>
      </LinearGradient>
      <Text style={styles.weightChartDiff}>{diffLabel}</Text>
    </View>
  );
};

const getWeightDisplay = (answer: AnswerValue | undefined) => {
  if (!isObjectValue(answer)) return '—';
  if (answer.unit === 'kg') return `${answer.value ?? answer.cm ?? '—'} kg`;
  return `${answer.value ?? '—'} lbs`;
};

const getWeightInKg = (answer: AnswerValue | undefined) => {
  if (!isObjectValue(answer) || !answer.value) return null;
  const numeric = parseInt(String(answer.value), 10);
  if (Number.isNaN(numeric)) return null;
  return answer.unit === 'kg' ? numeric : lbsToKg(numeric);
};

const getHeightInMeters = (answer: AnswerValue | undefined) => {
  if (!isObjectValue(answer)) return null;
  if (answer.unit === 'cm' && answer.cm) {
    const cm = parseInt(String(answer.cm), 10);
    return Number.isNaN(cm) ? null : cm / 100;
  }
  const feet = parseInt(String(answer.feet ?? '0'), 10);
  const inches = parseInt(String(answer.inches ?? '0'), 10);
  if (Number.isNaN(feet) || Number.isNaN(inches)) return null;
  return (feet * 12 + inches) * 0.0254;
};

const computeBmi = (weightAnswer: AnswerValue | undefined, heightAnswer: AnswerValue | undefined) => {
  const weight = getWeightInKg(weightAnswer);
  const height = getHeightInMeters(heightAnswer);
  if (!weight || !height) return null;
  return Math.round((weight / (height * height)) * 10) / 10;
};

const describeBmi = (bmi: number) => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return "You're Obese";
};

const bmiColor = (bmi: number | null) => {
  if (bmi == null) return '#fff';
  const segment = BMI_SEGMENTS.find((seg) => bmi >= seg.min && bmi < seg.max);
  return segment ? segment.color : '#fff';
};

const bmiPointerPosition = (bmi: number) => {
  const min = 15;
  const max = 40;
  const clamped = Math.max(min, Math.min(max, bmi));
  const percent = ((clamped - min) / (max - min)) * 100;
  return `${percent}%`;
};

const describeDelta = (current: AnswerValue | undefined, target: AnswerValue | undefined) => {
  const currentKg = getWeightInKg(current);
  const targetKg = getWeightInKg(target);
  if (currentKg == null || targetKg == null) return '—';
  const diff = Math.round(currentKg - targetKg);
  if (diff === 0) return 'Maintain course';
  return diff > 0 ? `Lose ${diff} kg` : `Gain ${Math.abs(diff)} kg`;
};

const humanize = (value: string) => (value ? value.replace(/_/g, ' ') : 'Unknown');
const humanizeExperience = (value: string) => {
  switch (value) {
    case 'beginner':
      return 'Rookie';
    case 'intermediate':
      return 'Provisional';
    case 'advanced':
      return 'Veteran';
    default:
      return humanize(value);
  }
};
const humanizeList = (value: string) =>
  value
    .split(',')
    .map((part) => humanize(part.trim()))
    .join(', ');

