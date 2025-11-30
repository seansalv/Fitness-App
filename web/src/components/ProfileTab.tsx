import React, { useState } from 'react';
import { Home, Sword, BarChart3, User, Shield, Settings, Bell, HelpCircle, LogOut, ChevronRight, Trophy, Zap, Target, Calendar } from 'lucide-react';

interface ProfileTabProps {
  userData: any;
  onNavigate: (screen: any) => void;
}

export function ProfileTab({ userData, onNavigate }: ProfileTabProps) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const achievements = [
    { id: 1, name: 'First Quest', icon: Sword, unlocked: true, color: 'bg-blue-50 text-blue-600' },
    { id: 2, name: 'Week Warrior', icon: Zap, unlocked: true, color: 'bg-amber-50 text-amber-600' },
    { id: 3, name: 'Consistency King', icon: Trophy, unlocked: false, color: 'bg-gray-50 text-gray-400' },
    { id: 4, name: 'Century Club', icon: Target, unlocked: false, color: 'bg-gray-50 text-gray-400' }
  ];

  const stats = [
    { label: 'Total XP', value: '2,450', icon: Zap, color: 'text-amber-600' },
    { label: 'Best Streak', value: '12 days', icon: Calendar, color: 'text-blue-600' },
    { label: 'Quests Done', value: userData.totalQuests, icon: Target, color: 'text-green-600' }
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-b from-blue-600 to-blue-700 px-6 pt-8 pb-12">
        <div className="text-center space-y-4">
          {/* Avatar */}
          <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full mx-auto flex items-center justify-center border-4 border-white/30">
            <User className="w-12 h-12 text-white" />
          </div>
          
          {/* Name & Level */}
          <div>
            <h1 className="text-2xl text-white mb-2">{userData.alias}</h1>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
              <Shield className="w-4 h-4 text-white" />
              <span className="text-sm text-white uppercase tracking-wide">Level {userData.level} · Rank {userData.rank}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto -mt-6 pb-24">
        {/* Stats Cards */}
        <div className="px-6 mb-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className={`w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mx-auto mb-2 ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div className="text-lg text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-600 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="px-6 mb-6">
          <h2 className="text-gray-900 mb-3">Achievements</h2>
          <div className="grid grid-cols-4 gap-3">
            {achievements.map(achievement => (
              <div key={achievement.id} className="text-center">
                <div className={`w-16 h-16 rounded-2xl ${achievement.color} flex items-center justify-center mx-auto mb-2 ${!achievement.unlocked && 'opacity-50'}`}>
                  <achievement.icon className="w-7 h-7" />
                </div>
                <div className={`text-xs ${achievement.unlocked ? 'text-gray-900' : 'text-gray-400'}`}>
                  {achievement.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Account Section */}
        <div className="px-6 mb-6">
          <h2 className="text-gray-900 mb-3">Account</h2>
          <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
            <button className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <span className="text-gray-900">Edit profile</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            
            <button className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Settings className="w-5 h-5 text-gray-600" />
                </div>
                <span className="text-gray-900">Preferences</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            
            <button className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Bell className="w-5 h-5 text-gray-600" />
                </div>
                <span className="text-gray-900">Notifications</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Support Section */}
        <div className="px-6 mb-6">
          <h2 className="text-gray-900 mb-3">Support</h2>
          <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
            <button className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-gray-600" />
                </div>
                <span className="text-gray-900">Help Center</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            
            <button className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-gray-600" />
                </div>
                <div className="text-left">
                  <div className="text-gray-900">About Hero Arc</div>
                  <div className="text-xs text-gray-500">Version 1.0.0</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Logout */}
        <div className="px-6 mb-6">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full px-4 py-4 bg-white rounded-2xl border border-gray-200 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Log out</span>
          </button>
        </div>
      </div>

      {/* Bottom Tab Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 rounded-t-3xl">
        <div className="flex items-center justify-around">
          <button 
            onClick={() => onNavigate('home')}
            className="flex flex-col items-center gap-1.5 text-gray-400"
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">Hero HQ</span>
          </button>
          <button className="flex flex-col items-center gap-1.5 text-gray-400">
            <Sword className="w-6 h-6" />
            <span className="text-xs">Quests</span>
          </button>
          <button 
            onClick={() => onNavigate('status')}
            className="flex flex-col items-center gap-1.5 text-gray-400"
          >
            <BarChart3 className="w-6 h-6" />
            <span className="text-xs">Status</span>
          </button>
          <button className="flex flex-col items-center gap-1.5 text-blue-600">
            <User className="w-6 h-6" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full">
            <h3 className="text-xl text-gray-900 mb-2">End your session?</h3>
            <p className="text-gray-600 mb-6">
              You can always return to Hero HQ and continue your training arc.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  // Handle logout logic here
                }}
                className="w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition-colors"
              >
                Log out
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full text-gray-600 py-3"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

