import { NextResponse } from 'next/server';

import { supabase } from '@/lib/supabase';
import type { OnboardingAnswers } from '@hero-arc/shared';

type OnboardingBody = {
  userId?: string;
  answers?: OnboardingAnswers;
};

export async function POST(req: Request) {
  const body = (await req.json()) as OnboardingBody;
  if (!body.userId || !body.answers) {
    return NextResponse.json({ error: 'userId and answers are required' }, { status: 400 });
  }

  const payload = {
    user_id: body.userId,
    answers: body.answers,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from('hero_profiles').upsert(payload, { onConflict: 'user_id' });
  if (error) {
    console.error('Failed to sync onboarding', error);
    return NextResponse.json({ error: 'Failed to sync onboarding' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

