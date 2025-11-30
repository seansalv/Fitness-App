import { Award, TrendingUp } from 'lucide-react';

type Props = {
  onSync: () => void;
};

export function OnboardingSummary({ onSync }: Props) {
  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <h1 className="text-2xl text-gray-900">Your training plan</h1>
        <p className="text-gray-600 mt-1">Review your personalized setup</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-900">Hero Profile</h3>
            <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm">Disciplined Striker</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <SummaryStat label="Age" value="25 years" />
            <SummaryStat label="Focus" value="Strength, Cardio" />
            <SummaryStat label="Weekly Goal" value="3 sessions" />
            <SummaryStat label="Equipment" value="Gym access" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="text-gray-900">Weight Goal</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <div className="text-sm text-gray-600">Current</div>
                <div className="text-2xl text-gray-900">150 lbs</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Target</div>
                <div className="text-2xl text-blue-600">140 lbs</div>
              </div>
            </div>
            <div className="h-32 flex items-end justify-between gap-1">
              {[85, 82, 80, 78, 75, 73, 70, 68, 65, 62, 60].map((height, index) => (
                <div key={index} className="flex-1 relative">
                  <div
                    className="absolute bottom-0 w-full bg-gradient-to-t from-blue-400 to-blue-200 rounded-t"
                    style={{ height: `${height}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Now</span>
              <span>12 weeks</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-blue-600" />
            <h3 className="text-gray-900">Body Mass Index</h3>
          </div>
          <div className="space-y-3">
            <div className="text-3xl text-gray-900">22.8</div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden relative">
              <div className="absolute inset-0 flex">
                <div className="w-[18.5%] bg-blue-300" />
                <div className="w-[31.5%] bg-green-400" />
                <div className="w-[20%] bg-amber-400" />
                <div className="flex-1 bg-red-400" />
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 w-1 h-4 bg-gray-900 rounded" style={{ left: '48%' }} />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Underweight</span>
              <span>Normal</span>
              <span>Overweight</span>
              <span>Obese</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 p-6 space-y-3">
        <button
          onClick={onSync}
          className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition-colors"
        >
          Sync with HQ
        </button>
        <button className="w-full text-blue-600 py-2">Adjust answers</button>
      </div>
    </div>
  );
}

const SummaryStat = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div className="text-sm text-gray-600">{label}</div>
    <div className="text-gray-900 mt-1">{value}</div>
  </div>
);

