import { BarChart3, BookOpen, Flame, Heart, Home, Shield, Sword, User } from 'lucide-react';

type Props = {
  userData: {
    alias: string;
    level: number;
    rank: string;
    xp: number;
    xpToNext: number;
    streak: number;
    weeklyGoal: number;
    weeklyCompleted: number;
    totalQuests: number;
    dayOfArc: number;
  };
  onNavigate: (screen: 'home' | 'status') => void;
  onOpenQuestModal: () => void;
};

const quests = [
  { id: 1, title: 'Morning strength session', type: 'Strength', icon: Sword, xp: 50 },
  { id: 2, title: '30-min cardio run', type: 'Cardio', icon: Heart, xp: 40 },
  { id: 3, title: 'Read 20 pages', type: 'Study', icon: BookOpen, xp: 25 },
];

const upcomingDays = [
  { day: 'Tomorrow', sessions: ['Strength', 'Cardio'] },
  { day: 'Friday', sessions: ['Flexibility'] },
];

export function HeroHQ({ userData, onNavigate, onOpenQuestModal }: Props) {
  return (
    <div className="h-full flex flex-col bg-gray-50 relative">
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="space-y-3">
          <div>
            <h1 className="text-2xl text-gray-900">Welcome back, {userData.alias}</h1>
            <p className="text-gray-600">Day {userData.dayOfArc} of your arc</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-xl">
              <Shield className="w-5 h-5" />
              <span className="text-sm uppercase tracking-wide">
                LV {userData.level} · Rank {userData.rank}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        <section className="bg-white border-b border-gray-200 px-6 py-6 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">XP Progress</span>
              <span className="text-sm text-gray-900">
                {userData.xp} / {userData.xpToNext}
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
                style={{ width: `${(userData.xp / userData.xpToNext) * 100}%` }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500" />
              <div>
                <div className="text-gray-900">{userData.streak} day streak</div>
                <div className="text-sm text-gray-600">Keep it up!</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-gray-900">
                {userData.weeklyCompleted} / {userData.weeklyGoal}
              </div>
              <div className="text-sm text-gray-600">this week</div>
            </div>
          </div>
        </section>

        <section className="p-6 space-y-4">
          <h2 className="text-gray-900">Today&apos;s quests</h2>
          <div className="space-y-3">
            {quests.map((quest) => (
              <div key={quest.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <quest.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-gray-900">{quest.title}</div>
                      <div className="flex items-center gap-2 mt-1 text-xs">
                        <span className="text-gray-600">{quest.type}</span>
                        <span className="text-amber-600">+{quest.xp} XP</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={onOpenQuestModal}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Log
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 pb-6 space-y-4">
          <h2 className="text-gray-900">Upcoming training</h2>
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            {upcomingDays.map((day) => (
              <div key={day.day} className="p-4">
                <div className="text-sm text-gray-600 mb-2">{day.day}</div>
                <div className="flex gap-2 flex-wrap">
                  {day.sessions.map((session) => (
                    <span key={session} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg">
                      {session}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 pb-24">
          <div className="bg-gradient-to-br from-blue-50 to-amber-50 rounded-xl border border-blue-100 p-6">
            <div className="flex items-start gap-3">
              <Sword className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm text-gray-900 mb-1">Hero tip</div>
                <p className="text-sm text-gray-600">Consistency beats intensity. Even a short session counts.</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 rounded-t-3xl">
        <div className="flex items-center justify-around">
          <button className="flex flex-col items-center gap-1.5 text-blue-600">
            <Home className="w-6 h-6" />
            <span className="text-xs">Hero HQ</span>
          </button>
          <button onClick={onOpenQuestModal} className="flex flex-col items-center gap-1.5 text-gray-400">
            <Sword className="w-6 h-6" />
            <span className="text-xs">Quests</span>
          </button>
          <button onClick={() => onNavigate('status')} className="flex flex-col items-center gap-1.5 text-gray-400">
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

