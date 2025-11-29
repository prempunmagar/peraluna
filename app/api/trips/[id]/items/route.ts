import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { dbPlannedItemToPlannedItem, DbPlannedItem } from '@/lib/types/trip';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/trips/[id]/items
export async function POST(request: Request, { params }: RouteParams) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  try {
    const { id: tripId } = await params;
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: trip } = await supabase
      .from('trips')
      .select('id')
      .eq('id', tripId)
      .eq('user_id', user.id)
      .single();

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    const body = await request.json();
    const { type, provider, title, subtitle, details, price, nights, tag } = body;

    if (!type || !title) {
      return NextResponse.json({ error: 'Type and title are required' }, { status: 400 });
    }

    const { data: newItem, error } = await supabase
      .from('planned_items')
      .insert({
        trip_id: tripId,
        type,
        provider: provider || '',
        title,
        subtitle,
        details: details || {},
        price: price || 0,
        nights: nights || null,
        tag,
        is_confirmed: false,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const clientItem = dbPlannedItemToPlannedItem(newItem as DbPlannedItem);
    return NextResponse.json({ item: clientItem }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

// DELETE /api/trips/[id]/items?itemId=xxx
export async function DELETE(request: Request, { params }: RouteParams) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  try {
    const { id: tripId } = await params;
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const itemId = url.searchParams.get('itemId');

    if (!itemId) {
      return NextResponse.json({ error: 'itemId is required' }, { status: 400 });
    }

    const { data: trip } = await supabase
      .from('trips')
      .select('id')
      .eq('id', tripId)
      .eq('user_id', user.id)
      .single();

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    await supabase.from('planned_items').delete().eq('id', itemId).eq('trip_id', tripId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
