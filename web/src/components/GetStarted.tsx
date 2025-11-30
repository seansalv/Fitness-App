import { Sparkles, Sword } from 'lucide-react';

type Props = {
  onGetStarted: () => void;
};

export function GetStarted({ onGetStarted }: Props) {
  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="flex-1 flex items-center justify-center">
        <div className="relative">
          <div className="w-64 h-64 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-48 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl rotate-45 opacity-10" />
            </div>
            <div className="absolute top-12 left-8">
              <Sparkles className="w-8 h-8 text-blue-500 opacity-30" />
            </div>
            <div className="absolute bottom-16 right-12">
              <Sparkles className="w-6 h-6 text-amber-500 opacity-40" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sword className="w-24 h-24 text-blue-600 opacity-20" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 pb-8">
        <div className="text-center space-y-3">
          <h1 className="text-4xl text-gray-900">This is your training arc.</h1>
          <p className="text-gray-600">
            Build habits, complete quests, and level up your real-world stats—one session at a time.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onGetStarted}
            className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Begin training
          </button>
          <button className="w-full text-blue-600 py-2">Log in to Hero HQ</button>
        </div>
      </div>
    </div>
  );
}

