import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { dbTripToTrip, dbPlannedItemToPlannedItem, DbTrip, DbPlannedItem } from '@/lib/types/trip';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/trips/[id] - Get trip details
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch trip
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (tripError) {
      if (tripError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Trip not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: tripError.message },
        { status: 500 }
      );
    }

    // Fetch planned items
    const { data: plannedItems, error: itemsError } = await supabase
      .from('planned_items')
      .select('*')
      .eq('trip_id', id);

    if (itemsError) {
      return NextResponse.json(
        { error: itemsError.message },
        { status: 500 }
      );
    }

    // Convert to client format
    const tripItems = (plannedItems || []).map((item: DbPlannedItem) => dbPlannedItemToPlannedItem(item));
    const clientTrip = dbTripToTrip(trip as DbTrip, tripItems);

    return NextResponse.json({ trip: clientTrip });
  } catch {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// PATCH /api/trips/[id] - Update trip
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Build update object (only include fields that are provided)
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

    // Update trip
    const { data: updatedTrip, error: updateError } = await supabase
      .from('trips')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      if (updateError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Trip not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    // Fetch planned items
    const { data: plannedItems } = await supabase
      .from('planned_items')
      .select('*')
      .eq('trip_id', id);

    // Convert to client format
    const tripItems = (plannedItems || []).map((item: DbPlannedItem) => dbPlannedItemToPlannedItem(item));
    const clientTrip = dbTripToTrip(updatedTrip as DbTrip, tripItems);

    return NextResponse.json({ trip: clientTrip });
  } catch {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// DELETE /api/trips/[id] - Delete trip
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Delete trip (cascades to planned_items and chat_messages)
    const { error: deleteError } = await supabase
      .from('trips')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (deleteError) {
      return NextResponse.json(
        { error: deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
