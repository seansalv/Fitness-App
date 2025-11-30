import { BookOpen, Dumbbell, Heart, Sparkles, X, Zap } from 'lucide-react';
import { useState } from 'react';

type Props = {
  onClose: () => void;
};

export function QuestModal({ onClose }: Props) {
  const [questType, setQuestType] = useState('Strength');
  const [intensity, setIntensity] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [duration, setDuration] = useState(30);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [levelUp, setLevelUp] = useState(false);

  const questTypes = [
    { name: 'Strength', icon: Dumbbell },
    { name: 'Cardio', icon: Heart },
    { name: 'Study', icon: BookOpen },
    { name: 'Mindfulness', icon: Sparkles },
  ];

  const xpReward = intensity === 'Low' ? 25 : intensity === 'Medium' ? 40 : 60;

  const handleSubmit = () => {
    setSubmitted(true);
    if (Math.random() > 0.7) {
      setLevelUp(true);
    }
    setTimeout(() => onClose(), 2500);
  };

  if (submitted) {
    return (
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Zap className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl text-gray-900 mb-2">Quest completed!</h3>
            <p className="text-amber-600">+{xpReward} XP</p>
          </div>
          {levelUp && (
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-center gap-2 text-blue-600 mb-2">
                <Sparkles className="w-5 h-5" />
                <span>Level up!</span>
              </div>
              <p className="text-gray-600">Rank C → B</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-end z-50">
      <div className="bg-white rounded-t-3xl w-full max-h-[90%] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl text-gray-900">Log quest</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-3">
            <label className="text-sm text-gray-600">Quest type</label>
            <div className="grid grid-cols-4 gap-2">
              {questTypes.map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  onClick={() => setQuestType(name)}
                  className={`p-3 rounded-xl border transition-all ${
                    questType === name ? 'bg-blue-50 border-blue-500' : 'bg-white border-gray-200'
                  }`}
                >
                  <Icon className={`w-6 h-6 mx-auto mb-1 ${questType === name ? 'text-blue-600' : 'text-gray-400'}`} />
                  <div className={`text-xs ${questType === name ? 'text-blue-900' : 'text-gray-600'}`}>{name}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm text-gray-600">Intensity</label>
            <div className="flex gap-2">
              {['Low', 'Medium', 'High'].map((level) => (
                <button
                  key={level}
                  onClick={() => setIntensity(level as 'Low' | 'Medium' | 'High')}
                  className={`flex-1 py-3 rounded-xl border transition-all ${
                    intensity === level ? 'bg-blue-50 border-blue-500 text-blue-900' : 'bg-white border-gray-200 text-gray-900'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm text-gray-600">Duration (minutes)</label>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="text-center text-3xl text-gray-900 mb-4">{duration}</div>
              <input
                type="range"
                min={5}
                max={120}
                step={5}
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value || '5', 10))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>5 min</span>
                <span>120 min</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm text-gray-600">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did it go?"
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-center justify-between">
            <span className="text-gray-900">You&apos;ll earn</span>
            <span className="text-amber-600">+{xpReward} XP</span>
          </div>
        </div>

        <div className="border-t border-gray-200 p-6">
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Log quest
          </button>
        </div>
      </div>
    </div>
  );
}

