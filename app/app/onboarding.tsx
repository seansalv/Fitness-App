import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ChevronLeft, Dumbbell, Heart, Target, Zap } from 'lucide-react-native';

import { ResponsiveSlider } from '@/components/ResponsiveSlider';
import { palette } from '@/src/theme/palette';
import { saveOnboardingAnswers } from '@/src/services/storage';

const TOTAL_STEPS = 7;

type FormData = {
  age: number;
  weight: number;
  unit: 'lbs' | 'kg';
  motivations: string[];
  focus: string[];
  frequency: number;
  equipment: string[];
  schedule: string[];
  reminder: boolean;
};

const MOTIVATIONS = ['Prove myself', 'Body recomposition', 'Build discipline', 'Feel stronger', 'Mental clarity'];
const FOCUS_OPTIONS = [
  { name: 'Strength', icon: Dumbbell },
  { name: 'Cardio', icon: Heart },
  { name: 'Flexibility', icon: Target },
  { name: 'Stamina', icon: Zap },
];
const EQUIPMENT_OPTIONS = ['Bodyweight only', 'Home equipment', 'Gym access', 'Outdoor space'];
const SCHEDULE_DAYS = [
  { label: 'S', id: 'sun' },
  { label: 'M', id: 'mon' },
  { label: 'T', id: 'tue' },
  { label: 'W', id: 'wed' },
  { label: 'T', id: 'thu' },
  { label: 'F', id: 'fri' },
  { label: 'S', id: 'sat' },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    age: 25,
    weight: 150,
    unit: 'lbs',
    motivations: [],
    focus: [],
    frequency: 3,
    equipment: [],
    schedule: [],
    reminder: true,
  });

  const progress = (currentStep / TOTAL_STEPS) * 100;

  const handleNext = async () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((step) => step + 1);
    } else {
      // Convert form data to the expected format and save
      const answers: Record<string, any> = {
        age: formData.age.toString(),
        weight: { unit: formData.unit, value: formData.weight.toString() },
        motivation: formData.motivations,
        focus: formData.focus,
        frequency: { value: formData.frequency },
        equipment: formData.equipment,
        schedule: { days: formData.schedule, reminder: formData.reminder },
      };
      await saveOnboardingAnswers(answers);
      router.push('/(auth)/auth');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((step) => step - 1);
    } else {
      router.back();
    }
  };

  const toggleSelection = (field: 'motivations' | 'focus' | 'equipment' | 'schedule', value: string) => {
    setFormData((prev) => {
      const current = prev[field];
      const updated = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
      return { ...prev, [field]: updated };
    });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.age > 0;
      case 2:
        return formData.weight > 0;
      case 3:
        return formData.motivations.length > 0;
      case 4:
        return formData.focus.length > 0;
      case 5:
        return formData.frequency > 0;
      case 6:
        return formData.equipment.length > 0;
      case 7:
        return formData.schedule.length > 0;
      default:
        return false;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Pressable onPress={handleBack} style={styles.backButton}>
            <ChevronLeft size={24} color={palette.textSecondary} />
          </Pressable>
          <Text style={styles.stepText}>
            Step {currentStep} of {TOTAL_STEPS}
          </Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {currentStep === 1 && (
          <View style={styles.stepContent}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepTitle}>How old are you?</Text>
              <Text style={styles.stepSubtitle}>This helps us personalize your training.</Text>
            </View>
            <View style={styles.ageCard}>
              <TextInput
                style={styles.ageInput}
                value={formData.age.toString()}
                onChangeText={(text) => {
                  const num = parseInt(text, 10) || 0;
                  setFormData((prev) => ({ ...prev, age: num }));
                }}
                keyboardType="numeric"
                textAlign="center"
                placeholder="25"
                placeholderTextColor={palette.textSecondary}
              />
              <Text style={styles.ageLabel}>years old</Text>
            </View>
            <View style={styles.xpBadge}>
              <Zap size={16} color="#f59e0b" />
              <Text style={styles.xpText}>XP +5</Text>
            </View>
          </View>
        )}

        {currentStep === 2 && (
          <View style={styles.stepContent}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepTitle}>What's your current weight?</Text>
              <Text style={styles.stepSubtitle}>No judgment—just data for your arc.</Text>
            </View>
            <View style={styles.weightCard}>
              <View style={styles.unitToggle}>
                {(['lbs', 'kg'] as const).map((unit) => (
                  <Pressable
                    key={unit}
                    onPress={() => setFormData((prev) => ({ ...prev, unit }))}
                    style={[styles.unitButton, formData.unit === unit && styles.unitButtonActive]}
                  >
                    <Text style={[styles.unitButtonText, formData.unit === unit && styles.unitButtonTextActive]}>
                      {unit}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <TextInput
                style={styles.weightInput}
                value={formData.weight.toString()}
                onChangeText={(text) => {
                  const num = parseInt(text, 10) || 0;
                  setFormData((prev) => ({ ...prev, weight: num }));
                }}
                keyboardType="numeric"
                textAlign="center"
                placeholder="150"
                placeholderTextColor={palette.textSecondary}
              />
              <Text style={styles.weightLabel}>{formData.unit}</Text>
            </View>
          </View>
        )}

        {currentStep === 3 && (
          <View style={styles.stepContent}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepTitle}>What drives you?</Text>
              <Text style={styles.stepSubtitle}>Select all that resonate.</Text>
            </View>
            <View style={styles.optionsList}>
              {MOTIVATIONS.map((motivation) => {
                const isSelected = formData.motivations.includes(motivation);
                return (
                  <Pressable
                    key={motivation}
                    onPress={() => toggleSelection('motivations', motivation)}
                    style={[styles.optionButton, isSelected && styles.optionButtonActive]}
                  >
                    <Text style={[styles.optionButtonText, isSelected && styles.optionButtonTextActive]}>
                      {motivation}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {currentStep === 4 && (
          <View style={styles.stepContent}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepTitle}>Choose your focus</Text>
              <Text style={styles.stepSubtitle}>Pick your primary training goals.</Text>
            </View>
            <View style={styles.focusGrid}>
              {FOCUS_OPTIONS.map(({ name, icon: Icon }) => {
                const isSelected = formData.focus.includes(name);
                return (
                  <Pressable
                    key={name}
                    onPress={() => toggleSelection('focus', name)}
                    style={[styles.focusCard, isSelected && styles.focusCardActive]}
                  >
                    <Icon size={32} color={isSelected ? palette.neon : palette.textSecondary} />
                    <Text style={[styles.focusLabel, isSelected && styles.focusLabelActive]}>{name}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {currentStep === 5 && (
          <View style={styles.stepContent}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepTitle}>Weekly training frequency</Text>
              <Text style={styles.stepSubtitle}>How many sessions can you commit to?</Text>
            </View>
            <View style={styles.frequencyCard}>
              <Text style={styles.frequencyValue}>{formData.frequency}</Text>
              <ResponsiveSlider
                minimumValue={1}
                maximumValue={7}
                step={1}
                value={formData.frequency}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, frequency: Math.round(value) }))}
                minimumTrackTintColor={palette.neon}
                maximumTrackTintColor={palette.border}
                thumbTintColor={palette.neon}
              />
              <View style={styles.frequencyLabels}>
                <Text style={styles.frequencyLabel}>Casual</Text>
                <Text style={styles.frequencyLabel}>Disciplined</Text>
                <Text style={styles.frequencyLabel}>Relentless</Text>
              </View>
            </View>
          </View>
        )}

        {currentStep === 6 && (
          <View style={styles.stepContent}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepTitle}>What gear do you have?</Text>
              <Text style={styles.stepSubtitle}>We'll match quests to your equipment.</Text>
            </View>
            <View style={styles.optionsList}>
              {EQUIPMENT_OPTIONS.map((equipment) => {
                const isSelected = formData.equipment.includes(equipment);
                return (
                  <Pressable
                    key={equipment}
                    onPress={() => toggleSelection('equipment', equipment)}
                    style={[styles.optionButton, isSelected && styles.optionButtonActive]}
                  >
                    <Text style={[styles.optionButtonText, isSelected && styles.optionButtonTextActive]}>
                      {equipment}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {currentStep === 7 && (
          <View style={styles.stepContent}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepTitle}>Pick your training days</Text>
              <Text style={styles.stepSubtitle}>When will you show up?</Text>
            </View>
            <View style={styles.scheduleGrid}>
              {SCHEDULE_DAYS.map((day) => {
                const isSelected = formData.schedule.includes(day.id);
                return (
                  <Pressable
                    key={day.id}
                    onPress={() => toggleSelection('schedule', day.id)}
                    style={[styles.scheduleDay, isSelected && styles.scheduleDayActive]}
                  >
                    <Text style={[styles.scheduleDayText, isSelected && styles.scheduleDayTextActive]}>
                      {day.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <View style={styles.reminderCard}>
              <Text style={styles.reminderLabel}>Daily reminder</Text>
              <Switch
                value={formData.reminder}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, reminder: value }))}
                trackColor={{ true: palette.neon, false: palette.border }}
                thumbColor="#ffffff"
              />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable onPress={handleBack} style={styles.footerButton}>
          <Text style={styles.footerButtonText}>Back</Text>
        </Pressable>
        <Pressable
          onPress={handleNext}
          style={[styles.footerButtonPrimary, !canProceed() && styles.footerButtonDisabled]}
          disabled={!canProceed()}
        >
          <Text style={styles.footerButtonPrimaryText}>{currentStep === TOTAL_STEPS ? 'Complete' : 'Next'}</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  backButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    fontSize: 14,
    color: palette.textSecondary,
    fontWeight: '500',
  },
  placeholder: {
    width: 24,
  },
  progressTrack: {
    height: 4,
    borderRadius: 999,
    backgroundColor: palette.muted,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: palette.neon,
    borderRadius: 999,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  stepContent: {
    gap: 24,
  },
  stepHeader: {
    gap: 8,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: palette.textPrimary,
  },
  stepSubtitle: {
    fontSize: 16,
    color: palette.textSecondary,
  },
  ageCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 24,
    alignItems: 'center',
  },
  ageInput: {
    fontSize: 48,
    fontWeight: '700',
    color: palette.textPrimary,
    width: '100%',
    textAlign: 'center',
  },
  ageLabel: {
    fontSize: 16,
    color: palette.textSecondary,
    marginTop: 8,
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  xpText: {
    fontSize: 14,
    color: '#f59e0b',
    fontWeight: '600',
  },
  weightCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 24,
    alignItems: 'center',
    gap: 16,
  },
  unitToggle: {
    flexDirection: 'row',
    gap: 8,
  },
  unitButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  unitButtonActive: {
    backgroundColor: '#e0e7ff',
  },
  unitButtonText: {
    fontSize: 16,
    color: palette.textSecondary,
    fontWeight: '600',
  },
  unitButtonTextActive: {
    color: palette.neon,
  },
  weightInput: {
    fontSize: 48,
    fontWeight: '700',
    color: palette.textPrimary,
    width: '100%',
    textAlign: 'center',
  },
  weightLabel: {
    fontSize: 16,
    color: palette.textSecondary,
  },
  optionsList: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  optionButtonActive: {
    backgroundColor: '#e0e7ff',
    borderColor: palette.neon,
  },
  optionButtonText: {
    fontSize: 16,
    color: palette.textPrimary,
    fontWeight: '500',
  },
  optionButtonTextActive: {
    color: palette.neon,
    fontWeight: '600',
  },
  focusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  focusCard: {
    width: '47%',
    aspectRatio: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  focusCardActive: {
    backgroundColor: '#e0e7ff',
    borderColor: palette.neon,
  },
  focusLabel: {
    fontSize: 16,
    color: palette.textPrimary,
    fontWeight: '500',
  },
  focusLabelActive: {
    color: palette.neon,
    fontWeight: '600',
  },
  frequencyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 24,
    gap: 24,
  },
  frequencyValue: {
    fontSize: 72,
    fontWeight: '800',
    color: palette.textPrimary,
    textAlign: 'center',
  },
  frequencyLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -8,
  },
  frequencyLabel: {
    fontSize: 12,
    color: palette.textSecondary,
  },
  scheduleGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  scheduleDay: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleDayActive: {
    backgroundColor: palette.neon,
    borderColor: palette.neon,
  },
  scheduleDayText: {
    fontSize: 16,
    color: palette.textPrimary,
    fontWeight: '600',
  },
  scheduleDayTextActive: {
    color: '#ffffff',
  },
  reminderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reminderLabel: {
    fontSize: 16,
    color: palette.textPrimary,
    fontWeight: '500',
  },
  footer: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: palette.border,
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  footerButtonText: {
    fontSize: 16,
    color: palette.textSecondary,
    fontWeight: '500',
  },
  footerButtonPrimary: {
    backgroundColor: palette.neon,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 16,
  },
  footerButtonDisabled: {
    opacity: 0.5,
  },
  footerButtonPrimaryText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
});
