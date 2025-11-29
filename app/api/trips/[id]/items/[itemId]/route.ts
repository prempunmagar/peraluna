import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { dbPlannedItemToPlannedItem, DbPlannedItem } from '@/lib/types/trip';

interface RouteParams {
  params: Promise<{ id: string; itemId: string }>;
}

// PATCH /api/trips/[id]/items/[itemId]
export async function PATCH(request: Request, { params }: RouteParams) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  try {
    const { id: tripId, itemId } = await params;
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
    const updateData: Record<string, unknown> = {};

    if (body.isConfirmed !== undefined) updateData.is_confirmed = body.isConfirmed;
    if (body.bookingReference !== undefined) updateData.booking_reference = body.bookingReference;
    if (body.price !== undefined) updateData.price = body.price;
    if (body.nights !== undefined) updateData.nights = body.nights;

    const { data: updatedItem, error } = await supabase
      .from('planned_items')
      .update(updateData)
      .eq('id', itemId)
      .eq('trip_id', tripId)
      .select()
      .single();

    if (error || !updatedItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    const clientItem = dbPlannedItemToPlannedItem(updatedItem as DbPlannedItem);
    return NextResponse.json({ item: clientItem });
  } catch {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

// DELETE /api/trips/[id]/items/[itemId]
export async function DELETE(request: Request, { params }: RouteParams) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  try {
    const { id: tripId, itemId } = await params;
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

    await supabase.from('planned_items').delete().eq('id', itemId).eq('trip_id', tripId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
