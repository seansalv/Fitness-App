import { NextResponse } from 'next/server';

import { supabase } from '@/lib/supabase';
import type { QuestPayload } from '@hero-arc/shared';

type QuestBody = {
  userId?: string;
  quest?: QuestPayload;
};

export async function POST(req: Request) {
  const body = (await req.json()) as QuestBody;
  if (!body.userId || !body.quest) {
    return NextResponse.json({ error: 'userId and quest payload required' }, { status: 400 });
  }

  const statsResponse = await supabase.from('user_stats').select('*').eq('user_id', body.userId).single();
  if (statsResponse.error) {
    console.error('Unable to fetch stats', statsResponse.error);
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 });
  }

  const stats = statsResponse.data ?? {
    user_id: body.userId,
    level: 1,
    rank: 'E',
    total_xp: 0,
    streak_days: 0,
    last_activity_date: null,
  };

  const xpAwarded = calculateQuestXp(body.quest);
  const totalXp = stats.total_xp + xpAwarded;
  const level = deriveLevelFromXp(totalXp);
  const rank = deriveRankFromXp(totalXp);
  const questTimestamp = new Date().toISOString();
  const streak = calculateStreak(stats.last_activity_date, questTimestamp, stats.streak_days);

  const insertWorkout = await supabase.from('workouts').insert({
    user_id: body.userId,
    type: body.quest.type,
    intensity: body.quest.intensity,
    duration_minutes: body.quest.durationMinutes,
    xp_awarded: xpAwarded,
    timestamp: questTimestamp,
  });

  if (insertWorkout.error) {
    console.error('Failed to insert workout', insertWorkout.error);
    return NextResponse.json({ error: 'Failed to log quest' }, { status: 500 });
  }

  const updateStats = await supabase
    .from('user_stats')
    .upsert({
      user_id: body.userId,
      total_xp: totalXp,
      level,
      rank,
      streak_days: streak,
      last_activity_date: questTimestamp,
    })
    .select('*')
    .single();

  if (updateStats.error) {
    console.error('Failed to update stats', updateStats.error);
    return NextResponse.json({ error: 'Failed to update stats' }, { status: 500 });
  }

  return NextResponse.json({
    xpAwarded,
    stats: {
      totalXp,
      level,
      rank,
      streak,
      lastActivityDate: questTimestamp,
    },
  });
}

const BASE_XP_PER_MINUTE = 12;
const COMPLETION_BONUS = 20;
const INTENSITY_MULTIPLIER = {
  light: 0.85,
  medium: 1,
  intense: 1.35,
};
const TYPE_MULTIPLIER = {
  gym: 1.1,
  cardio: 1.05,
  at_home: 0.95,
  custom: 1,
};

function calculateQuestXp(quest: NonNullable<QuestBody['quest']>) {
  const duration = Math.max(quest.durationMinutes, 5);
  const raw =
    duration * BASE_XP_PER_MINUTE * INTENSITY_MULTIPLIER[quest.intensity] * TYPE_MULTIPLIER[quest.type] +
    COMPLETION_BONUS;
  return Math.round(raw);
}

function deriveLevelFromXp(totalXp: number) {
  let level = 1;
  let remaining = totalXp;
  let requirement = 180;
  const growth = 1.12;

  while (remaining >= requirement) {
    remaining -= requirement;
    level += 1;
    requirement = Math.round(requirement * growth);
  }

  return level;
}

const RANK_THRESHOLDS = [
  { rank: 'E', min: 0 },
  { rank: 'D', min: 500 },
  { rank: 'C', min: 1500 },
  { rank: 'B', min: 3200 },
  { rank: 'A', min: 5200 },
  { rank: 'S', min: 8200 },
  { rank: 'SS', min: 12000 },
  { rank: 'SSS', min: 17000 },
] as const;

function deriveRankFromXp(totalXp: number) {
  let currentRank: (typeof RANK_THRESHOLDS)[number]['rank'] = 'E';
  for (const entry of RANK_THRESHOLDS) {
    if (totalXp >= entry.min) {
      currentRank = entry.rank;
    }
  }
  return currentRank;
}

function calculateStreak(previousDate: string | null, questDateIso: string, previousStreak: number) {
  if (!previousDate) return 1;
  const prev = new Date(previousDate);
  const current = new Date(questDateIso);
  const diffMs = current.setHours(0, 0, 0, 0) - prev.setHours(0, 0, 0, 0);
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return previousStreak;
  if (diffDays === 1) return previousStreak + 1;
  return 1;
}

