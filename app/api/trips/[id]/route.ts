import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { dbTripToTrip, dbPlannedItemToPlannedItem, DbTrip, DbPlannedItem } from '@/lib/types/trip';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/trips/[id]
export async function GET(request: Request, { params }: RouteParams) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: trip, error } = await supabase
      .from('trips')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error || !trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    const { data: plannedItems } = await supabase
      .from('planned_items')
      .select('*')
      .eq('trip_id', id);

    const tripItems = (plannedItems || []).map((item: DbPlannedItem) => dbPlannedItemToPlannedItem(item));
    const clientTrip = dbTripToTrip(trip as DbTrip, tripItems);

    return NextResponse.json({ trip: clientTrip });
  } catch {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

// PATCH /api/trips/[id]
export async function PATCH(request: Request, { params }: RouteParams) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const updateData: Record<string, unknown> = {};

    if (body.destination !== undefined) updateData.destination = body.destination;
    if (body.country !== undefined) updateData.country = body.country;
    if (body.startDate !== undefined) updateData.start_date = body.startDate;
    if (body.endDate !== undefined) updateData.end_date = body.endDate;
    if (body.adults !== undefined) updateData.adults = body.adults;
    if (body.children !== undefined) updateData.children = body.children;
    if (body.budget !== undefined) updateData.budget = body.budget;
    if (body.budgetType !== undefined) updateData.budget_type = body.budgetType;
    if (body.flexibility !== undefined) updateData.flexibility = body.flexibility;
    if (body.interests !== undefined) updateData.interests = body.interests;
    if (body.status !== undefined) updateData.status = body.status;

    const { data: updatedTrip, error } = await supabase
      .from('trips')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error || !updatedTrip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    const { data: plannedItems } = await supabase
      .from('planned_items')
      .select('*')
      .eq('trip_id', id);

    const tripItems = (plannedItems || []).map((item: DbPlannedItem) => dbPlannedItemToPlannedItem(item));
    const clientTrip = dbTripToTrip(updatedTrip as DbTrip, tripItems);

    return NextResponse.json({ trip: clientTrip });
  } catch {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

// DELETE /api/trips/[id]
export async function DELETE(request: Request, { params }: RouteParams) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await supabase.from('trips').delete().eq('id', id).eq('user_id', user.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
