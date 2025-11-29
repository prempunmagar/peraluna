import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { dbTripToTrip, dbPlannedItemToPlannedItem, DbTrip, DbPlannedItem } from '@/lib/types/trip';

// GET /api/trips - List all user trips
export async function GET() {
  // Check if Supabase is configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ trips: [] });
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ trips: [] });
    }

    const { data: trips, error: tripsError } = await supabase
      .from('trips')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (tripsError) {
      return NextResponse.json({ trips: [] });
    }

    const tripIds = trips.map((t: DbTrip) => t.id);
    const { data: plannedItems } = await supabase
      .from('planned_items')
      .select('*')
      .in('trip_id', tripIds);

    const itemsByTrip: Record<string, DbPlannedItem[]> = {};
    plannedItems?.forEach((item: DbPlannedItem) => {
      if (!itemsByTrip[item.trip_id]) {
        itemsByTrip[item.trip_id] = [];
      }
      itemsByTrip[item.trip_id].push(item);
    });

    const clientTrips = trips.map((dbTrip: DbTrip) => {
      const tripItems = (itemsByTrip[dbTrip.id] || []).map(dbPlannedItemToPlannedItem);
      return dbTripToTrip(dbTrip, tripItems);
    });

    return NextResponse.json({ trips: clientTrips });
  } catch {
    return NextResponse.json({ trips: [] });
  }
}

// POST /api/trips - Create a new trip
export async function POST(request: Request) {
  // Check if Supabase is configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json(
      { error: 'Supabase not configured' },
      { status: 503 }
    );
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { destination, country, startDate, endDate, adults, children, budget, budgetType, flexibility, interests } = body;

    if (!destination || !country || !startDate || !endDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data: newTrip, error: insertError } = await supabase
      .from('trips')
      .insert({
        user_id: user.id,
        destination,
        country,
        start_date: startDate,
        end_date: endDate,
        adults: adults || 1,
        children: children || 0,
        budget: budget || 3000,
        budget_type: budgetType || 'total',
        flexibility: flexibility || 'moderately-flexible',
        interests: interests || [],
        status: 'planning',
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    const clientTrip = dbTripToTrip(newTrip as DbTrip, []);
    return NextResponse.json({ trip: clientTrip }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
