import { useState } from 'react';

import { Auth } from './components/Auth';
import { GetStarted } from './components/GetStarted';
import { HeroHQ } from './components/HeroHQ';
import { OnboardingSummary } from './components/OnboardingSummary';
import { OnboardingWizard } from './components/OnboardingWizard';
import { ProfileTab } from './components/ProfileTab';
import { QuestModal } from './components/QuestModal';
import { StatusTab } from './components/StatusTab';

type Screen = 'getStarted' | 'auth' | 'onboarding' | 'summary' | 'home' | 'status' | 'profile';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('getStarted');
  const [showQuestModal, setShowQuestModal] = useState(false);
  const [userData] = useState({
    alias: 'Hero',
    level: 5,
    rank: 'C',
    xp: 450,
    xpToNext: 600,
    streak: 7,
    weeklyGoal: 5,
    weeklyCompleted: 3,
    totalQuests: 42,
    dayOfArc: 14,
  });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden relative" style={{ height: 844 }}>
        {currentScreen === 'getStarted' && <GetStarted onGetStarted={() => setCurrentScreen('auth')} />}
        {currentScreen === 'auth' && <Auth onComplete={() => setCurrentScreen('onboarding')} />}
        {currentScreen === 'onboarding' && <OnboardingWizard onComplete={() => setCurrentScreen('summary')} />}
        {currentScreen === 'summary' && <OnboardingSummary onSync={() => setCurrentScreen('home')} />}
        {currentScreen === 'home' && (
          <HeroHQ userData={userData} onNavigate={setCurrentScreen} onOpenQuestModal={() => setShowQuestModal(true)} />
        )}
        {currentScreen === 'status' && <StatusTab userData={userData} onNavigate={setCurrentScreen} />}
        {currentScreen === 'profile' && <ProfileTab userData={userData} onNavigate={setCurrentScreen} />}

        {showQuestModal && <QuestModal onClose={() => setShowQuestModal(false)} />}
      </div>
    </div>
  );
}

