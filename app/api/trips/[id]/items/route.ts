import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { dbPlannedItemToPlannedItem, DbPlannedItem } from '@/lib/types/trip';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/trips/[id]/items - Add planned item to trip
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id: tripId } = await params;
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
    const {
      type,
      provider,
      title,
      subtitle,
      details,
      price,
      nights,
      tag,
    } = body;

    // Validate required fields
    if (!type || !title) {
      return NextResponse.json(
        { error: 'Type and title are required' },
        { status: 400 }
      );
    }

    // Insert planned item
    const { data: newItem, error: insertError } = await supabase
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

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    // Convert to client format
    const clientItem = dbPlannedItemToPlannedItem(newItem as DbPlannedItem);

    return NextResponse.json({ item: clientItem }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// DELETE /api/trips/[id]/items?itemId=xxx - Remove planned item
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id: tripId } = await params;
    const supabase = await createServerSupabaseClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get itemId from query params
    const url = new URL(request.url);
    const itemId = url.searchParams.get('itemId');

    if (!itemId) {
      return NextResponse.json(
        { error: 'itemId is required' },
        { status: 400 }
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
