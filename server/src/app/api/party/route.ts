import { NextResponse } from 'next/server';

import { supabase } from '@/lib/supabase';

type PartyBody =
  | {
      action: 'create';
      ownerId?: string;
      name?: string;
    }
  | {
      action: 'join';
      userId?: string;
      partyId?: string;
    }
  | {
      action: 'leave';
      userId?: string;
      partyId?: string;
    };

export async function POST(req: Request) {
  const body = (await req.json()) as PartyBody;

  switch (body.action) {
    case 'create':
      if (!body.ownerId || !body.name) {
        return NextResponse.json({ error: 'ownerId and name required' }, { status: 400 });
      }
      return handleCreate(body.ownerId, body.name);
    case 'join':
      if (!body.userId || !body.partyId) {
        return NextResponse.json({ error: 'userId and partyId required' }, { status: 400 });
      }
      return handleJoin(body.userId, body.partyId);
    case 'leave':
      if (!body.userId || !body.partyId) {
        return NextResponse.json({ error: 'userId and partyId required' }, { status: 400 });
      }
      return handleLeave(body.userId, body.partyId);
    default:
      return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
  }
}

async function handleCreate(ownerId: string, name: string) {
  const { data, error } = await supabase
    .from('parties')
    .insert({ owner_id: ownerId, name })
    .select('id')
    .single();

  if (error || !data) {
    console.error('Failed to create party', error);
    return NextResponse.json({ error: 'Failed to create party' }, { status: 500 });
  }

  const { error: membershipError } = await supabase
    .from('party_members')
    .insert({ party_id: data.id, user_id: ownerId, role: 'owner' });

  if (membershipError) {
    console.error('Failed to add owner to party', membershipError);
    return NextResponse.json({ error: 'Failed to add owner to party' }, { status: 500 });
  }

  return NextResponse.json({ partyId: data.id });
}

async function handleJoin(userId: string, partyId: string) {
  const { error } = await supabase
    .from('party_members')
    .insert({ party_id: partyId, user_id: userId, role: 'member' });

  if (error) {
    console.error('Failed to join party', error);
    return NextResponse.json({ error: 'Unable to join party' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

async function handleLeave(userId: string, partyId: string) {
  const { error } = await supabase
    .from('party_members')
    .delete()
    .match({ party_id: partyId, user_id: userId });

  if (error) {
    console.error('Failed to leave party', error);
    return NextResponse.json({ error: 'Unable to leave party' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

