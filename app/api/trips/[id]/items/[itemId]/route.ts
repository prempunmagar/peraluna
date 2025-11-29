import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { dbPlannedItemToPlannedItem, DbPlannedItem } from '@/lib/types/trip';

interface RouteParams {
  params: Promise<{ id: string; itemId: string }>;
}

// PATCH /api/trips/[id]/items/[itemId] - Update planned item (e.g., confirm booking)
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id: tripId, itemId } = await params;
    const supabase = await createServerSupabaseClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify trip ownership
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('id')
      .eq('id', tripId)
      .eq('user_id', user.id)
      .single();

    if (tripError || !trip) {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Build update object
    const updateData: Record<string, unknown> = {};
    if (body.isConfirmed !== undefined) updateData.is_confirmed = body.isConfirmed;
    if (body.bookingReference !== undefined) updateData.booking_reference = body.bookingReference;
    if (body.price !== undefined) updateData.price = body.price;
    if (body.nights !== undefined) updateData.nights = body.nights;

    // Update planned item
    const { data: updatedItem, error: updateError } = await supabase
      .from('planned_items')
      .update(updateData)
      .eq('id', itemId)
      .eq('trip_id', tripId)
      .select()
      .single();

    if (updateError) {
      if (updateError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Item not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    // Convert to client format
    const clientItem = dbPlannedItemToPlannedItem(updatedItem as DbPlannedItem);

    return NextResponse.json({ item: clientItem });
  } catch {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// DELETE /api/trips/[id]/items/[itemId] - Remove planned item
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id: tripId, itemId } = await params;
    const supabase = await createServerSupabaseClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify trip ownership
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('id')
      .eq('id', tripId)
      .eq('user_id', user.id)
      .single();

    if (tripError || !trip) {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      );
    }

    // Delete planned item
    const { error: deleteError } = await supabase
      .from('planned_items')
      .delete()
      .eq('id', itemId)
      .eq('trip_id', tripId);

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
