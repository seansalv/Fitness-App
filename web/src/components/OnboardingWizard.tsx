import { ChevronLeft, Dumbbell, Heart, Target, Zap } from 'lucide-react';
import { useState } from 'react';

type Props = {
  onComplete: () => void;
};

const TOTAL_STEPS = 7;

export function OnboardingWizard({ onComplete }: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    age: 25,
    weight: 150,
    height: 68,
    unit: 'lbs' as 'lbs' | 'kg',
    motivations: [] as string[],
    focus: [] as string[],
    frequency: 3,
    equipment: [] as string[],
    schedule: [] as string[],
  });

  const progress = (currentStep / TOTAL_STEPS) * 100;

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((step) => step + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((step) => step - 1);
    }
  };

  const toggleSelection = (field: 'motivations' | 'focus' | 'equipment' | 'schedule', value: string) => {
    setFormData((prev) => {
      const current = prev[field];
      const updated = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
      return { ...prev, [field]: updated };
    });
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <button onClick={handleBack} className="text-gray-600">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <span className="text-sm text-gray-600">
            Step {currentStep} of {TOTAL_STEPS}
          </span>
          <div className="w-6" />
        </div>
        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl text-gray-900 mb-2">How old are you?</h2>
              <p className="text-gray-600">This helps us personalize your training.</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value || '0', 10) })}
                className="w-full text-center text-3xl p-4 focus:outline-none"
              />
              <div className="text-center text-gray-500 mt-2">years old</div>
            </div>
            <div className="flex items-center gap-2 text-amber-600 text-sm">
              <Zap className="w-4 h-4" />
              <span>XP +5</span>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl text-gray-900 mb-2">What's your current weight?</h2>
              <p className="text-gray-600">No judgment—just data for your arc.</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex justify-center gap-2 mb-4">
                {(['lbs', 'kg'] as const).map((unit) => (
                  <button
                    key={unit}
                    onClick={() => setFormData((prev) => ({ ...prev, unit }))}
                    className={`px-4 py-2 rounded-lg ${
                      formData.unit === unit ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
                    }`}
                  >
                    {unit}
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: parseInt(e.target.value || '0', 10) })}
                className="w-full text-center text-3xl p-4 focus:outline-none"
              />
              <div className="text-center text-gray-500 mt-2">{formData.unit}</div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl text-gray-900 mb-2">What drives you?</h2>
              <p className="text-gray-600">Select all that resonate.</p>
            </div>
            <div className="space-y-3">
              {['Prove myself', 'Body recomposition', 'Build discipline', 'Feel stronger', 'Mental clarity'].map(
                (motivation) => (
                  <button
                    key={motivation}
                    onClick={() => toggleSelection('motivations', motivation)}
                    className={`w-full px-6 py-4 rounded-xl border transition-all text-left ${
                      formData.motivations.includes(motivation)
                        ? 'bg-blue-50 border-blue-500 text-blue-900'
                        : 'bg-white border-gray-200 text-gray-900'
                    }`}
                  >
                    {motivation}
                  </button>
                ),
              )}
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl text-gray-900 mb-2">Choose your focus</h2>
              <p className="text-gray-600">Pick your primary training goals.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Strength', icon: Dumbbell },
                { name: 'Cardio', icon: Heart },
                { name: 'Flexibility', icon: Target },
                { name: 'Stamina', icon: Zap },
              ].map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  onClick={() => toggleSelection('focus', name)}
                  className={`p-6 rounded-xl border transition-all ${
                    formData.focus.includes(name) ? 'bg-blue-50 border-blue-500' : 'bg-white border-gray-200'
                  }`}
                >
                  <Icon
                    className={`w-8 h-8 mb-3 ${
                      formData.focus.includes(name) ? 'text-blue-600' : 'text-gray-400'
                    }`}
                  />
                  <div className={formData.focus.includes(name) ? 'text-blue-900' : 'text-gray-900'}>{name}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl text-gray-900 mb-2">Weekly training frequency</h2>
              <p className="text-gray-600">How many sessions can you commit to?</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="text-center text-5xl mb-6">{formData.frequency}</div>
              <input
                type="range"
                min={1}
                max={7}
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: parseInt(e.target.value || '1', 10) })}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-4">
                <span>Casual</span>
                <span>Disciplined</span>
                <span>Relentless</span>
              </div>
            </div>
          </div>
        )}

        {currentStep === 6 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl text-gray-900 mb-2">What gear do you have?</h2>
              <p className="text-gray-600">We&apos;ll match quests to your equipment.</p>
            </div>
            <div className="space-y-3">
              {['Bodyweight only', 'Home equipment', 'Gym access', 'Outdoor space'].map((equipment) => (
                <button
                  key={equipment}
                  onClick={() => toggleSelection('equipment', equipment)}
                  className={`w-full px-6 py-4 rounded-xl border transition-all text-left ${
                    formData.equipment.includes(equipment)
                      ? 'bg-blue-50 border-blue-500 text-blue-900'
                      : 'bg-white border-gray-200 text-gray-900'
                  }`}
                >
                  {equipment}
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 7 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl text-gray-900 mb-2">Pick your training days</h2>
              <p className="text-gray-600">When will you show up?</p>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <button
                  key={`${day}-${index}`}
                  onClick={() => toggleSelection('schedule', day)}
                  className={`aspect-square rounded-xl border transition-all ${
                    formData.schedule.includes(day)
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-gray-200 text-gray-900'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
              <span className="text-gray-900">Daily reminder</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border-t border-gray-200 p-6 flex items-center justify-between">
        <button onClick={handleBack} className="text-gray-600">
          Back
        </button>
        <button
          onClick={handleNext}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors"
        >
          {currentStep === TOTAL_STEPS ? 'Complete' : 'Next'}
        </button>
      </div>
    </div>
  );
}

