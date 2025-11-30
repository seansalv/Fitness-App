import { BarChart3, Flame, Home, Sword, Target, Trophy, User } from 'lucide-react';

type Props = {
  userData: {
    streak: number;
    totalQuests: number;
  };
  onNavigate: (screen: 'home' | 'status') => void;
};

const weeklyData = [
  { day: 'M', quests: 2 },
  { day: 'T', quests: 1 },
  { day: 'W', quests: 3 },
  { day: 'T', quests: 0 },
  { day: 'F', quests: 1 },
  { day: 'S', quests: 2 },
  { day: 'S', quests: 1 },
];

const missions = [
  { id: 1, title: 'Complete 30 quests', progress: 28, total: 30 },
  { id: 2, title: 'Maintain 14-day streak', progress: 7, total: 14 },
  { id: 3, title: 'Reach Level 10', progress: 5, total: 10 },
];

export function StatusTab({ userData, onNavigate }: Props) {
  const maxQuests = Math.max(...weeklyData.map((d) => d.quests));

  return (
    <div className="h-full flex flex-col bg-gray-50 relative">
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <h1 className="text-2xl text-gray-900">Status</h1>
        <p className="text-gray-600 mt-1">Track your progress</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-24">
        <section className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">This week</h3>
          <div className="flex items-end justify-between gap-2 h-32">
            {weeklyData.map((data) => (
              <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="flex-1 w-full flex items-end">
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg"
                    style={{ height: data.quests > 0 ? `${(data.quests / maxQuests) * 100}%` : '4px' }}
                  />
                </div>
                <span className="text-xs text-gray-600">{data.day}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h3 className="text-gray-900">Streak stats</h3>
          <div className="grid grid-cols-3 gap-4">
            <StatCard label="Current" value={`${userData.streak}`} icon={<Flame className="w-6 h-6 text-amber-500" />} />
            <StatCard label="Best" value="12" icon={<Trophy className="w-6 h-6 text-blue-600" />} />
            <StatCard label="Total" value={`${userData.totalQuests}`} icon={<Target className="w-6 h-6 text-gray-600" />} />
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">Reminders</h3>
          <div className="space-y-3">
            {['Morning training (8:00 AM)', 'Midday check-in (12:00 PM)', 'Evening log (8:00 PM)'].map((reminder, index) => (
              <div key={reminder} className="flex items-center justify-between py-2">
                <span className="text-gray-900">{reminder}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={index < 2} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                </label>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">Hero missions</h3>
          <div className="space-y-4">
            {missions.map((mission) => (
              <div key={mission.id}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-900">{mission.title}</span>
                  <span className="text-sm text-gray-600">
                    {mission.progress}/{mission.total}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                    style={{ width: `${(mission.progress / mission.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 rounded-t-3xl">
        <div className="flex items-center justify-around">
          <button onClick={() => onNavigate('home')} className="flex flex-col items-center gap-1.5 text-gray-400">
            <Home className="w-6 h-6" />
            <span className="text-xs">Hero HQ</span>
          </button>
          <button className="flex flex-col items-center gap-1.5 text-gray-400">
            <Sword className="w-6 h-6" />
            <span className="text-xs">Quests</span>
          </button>
          <button className="flex flex-col items-center gap-1.5 text-blue-600">
            <BarChart3 className="w-6 h-6" />
            <span className="text-xs">Status</span>
          </button>
          <button onClick={() => onNavigate('profile')} className="flex flex-col items-center gap-1.5 text-gray-400">
            <User className="w-6 h-6" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) => (
  <div className="text-center">
    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-2">{icon}</div>
    <div className="text-2xl text-gray-900">{value}</div>
    <div className="text-xs text-gray-600">{label}</div>
  </div>
);

