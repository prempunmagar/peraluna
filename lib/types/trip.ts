export type TripStatus = 'planning' | 'booked' | 'completed';
export type FlexibilityType = 'very-flexible' | 'moderately-flexible' | 'not-flexible';
export type PlannedItemType = 'flight' | 'hotel' | 'activity';
export type BudgetTier = 'budget' | 'standard' | 'luxury';
export type BudgetType = 'total' | 'per-person';

// Planned item details structure (flexible for different types)
export interface FlightDetails {
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  stopLocations?: string[];
  class: string;
  airline: string;
  flightNumber: string;
}

export interface HotelDetails {
  checkIn: string;
  checkOut: string;
  nights: number;
  roomType: string;
  amenities: string[];
  rating: number;
  address: string;
}

export interface ActivityDetails {
  duration: string;
  location: string;
  includes: string[];
  groupSize?: string;
}

// Planned item (tentative selection before final booking)
export interface PlannedItem {
  id: string;
  tripId: string;
  type: PlannedItemType;
  provider: string; // airline name, hotel name, activity provider
  title: string;
  subtitle?: string;
  details: FlightDetails | HotelDetails | ActivityDetails | Record<string, unknown>;
  price: number;
  nights?: number; // For hotels: number of nights (defaults to trip length if not specified)
  tag?: string; // 'Best Value', 'Premium', 'Budget', etc.
  isConfirmed: boolean;
  bookingReference?: string; // generated on confirmation
  createdAt: Date;
}

// Main Trip interface
export interface Trip {
  id: string;
  userId?: string; // optional for migration, required with Supabase auth
  destination: string;
  country: string;
  startDate: Date;
  endDate: Date;
  adults: number;      // Min 1
  children: number;    // Min 0
  budget: number;      // Always stored as TOTAL (converted from per-person if needed)
  budgetType: BudgetType; // Original input type for display reference
  flexibility: FlexibilityType;
  interests: string[];
  status: TripStatus;
  plannedItems: PlannedItem[]; // Tentative selections
  createdAt: Date;
  updatedAt: Date;
}

// Data for creating a new trip
export interface CreateTripData {
  destination: string;
  country: string;
  startDate: Date;
  endDate: Date;
  adults: number;
  children: number;
  budget: number;
  budgetType: BudgetType;
  flexibility: string;
  interests: string[];
}

// Trip context to pass to AI
export interface TripContext {
  destination: string;
  country: string;
  startDate: string; // ISO string for API
  endDate: string;
  nights: number;
  adults: number;
  children: number;
  totalTravelers: number;
  totalBudget: number;        // Always total (converted from per-person if needed)
  budgetTier: BudgetTier;
  budgetPerPersonPerNight: number;
  interests: string[];
  flexibility: FlexibilityType;
  plannedItems: {
    flights: PlannedItem[];
    hotels: PlannedItem[];
    activities: PlannedItem[];
  };
  totalPlannedCost: number;
  remainingBudget: number;
  priceRanges: {
    flight: [number, number];
    hotel: [number, number];
    activity: [number, number];
  };
}

// Database row types (snake_case from Supabase)
export interface DbTrip {
  id: string;
  user_id: string;
  destination: string;
  country: string;
  start_date: string;
  end_date: string;
  adults: number;
  children: number;
  budget: number;
  budget_type: BudgetType;
  flexibility: FlexibilityType;
  interests: string[];
  status: TripStatus;
  created_at: string;
  updated_at: string;
}

export interface DbPlannedItem {
  id: string;
  trip_id: string;
  type: PlannedItemType;
  provider: string;
  title: string;
  subtitle?: string;
  details: Record<string, unknown>;
  price: number;
  nights?: number;
  tag?: string;
  is_confirmed: boolean;
  booking_reference?: string;
  created_at: string;
}

// Conversion helpers
export function dbTripToTrip(dbTrip: DbTrip, plannedItems: PlannedItem[] = []): Trip {
  return {
    id: dbTrip.id,
    userId: dbTrip.user_id,
    destination: dbTrip.destination,
    country: dbTrip.country,
    startDate: new Date(dbTrip.start_date),
    endDate: new Date(dbTrip.end_date),
    adults: dbTrip.adults,
    children: dbTrip.children,
    budget: dbTrip.budget,
    budgetType: dbTrip.budget_type,
    flexibility: dbTrip.flexibility,
    interests: dbTrip.interests,
    status: dbTrip.status,
    plannedItems,
    createdAt: new Date(dbTrip.created_at),
    updatedAt: new Date(dbTrip.updated_at),
  };
}

export function dbPlannedItemToPlannedItem(dbItem: DbPlannedItem): PlannedItem {
  return {
    id: dbItem.id,
    tripId: dbItem.trip_id,
    type: dbItem.type,
    provider: dbItem.provider,
    title: dbItem.title,
    subtitle: dbItem.subtitle,
    details: dbItem.details,
    price: dbItem.price,
    nights: dbItem.nights,
    tag: dbItem.tag,
    isConfirmed: dbItem.is_confirmed,
    bookingReference: dbItem.booking_reference,
    createdAt: new Date(dbItem.created_at),
  };
}

// Budget tier calculation based on $/person/night
export function getBudgetTier(totalBudget: number, nights: number, travelers: number): BudgetTier {
  const perPersonPerNight = totalBudget / travelers / nights;

  if (perPersonPerNight < 150) return 'budget';      // < $150/person/night
  if (perPersonPerNight < 350) return 'standard';    // $150-350/person/night
  return 'luxury';                                    // > $350/person/night
}

// Price ranges for AI recommendations based on budget tier
export function getPriceRanges(tier: BudgetTier): { flight: [number, number]; hotel: [number, number]; activity: [number, number] } {
  const ranges = {
    budget: { flight: [400, 800] as [number, number], hotel: [50, 120] as [number, number], activity: [20, 60] as [number, number] },
    standard: { flight: [800, 1500] as [number, number], hotel: [120, 280] as [number, number], activity: [50, 150] as [number, number] },
    luxury: { flight: [1500, 4000] as [number, number], hotel: [280, 800] as [number, number], activity: [100, 500] as [number, number] },
  };
  return ranges[tier];
}

// Calculate total planned cost with correct multipliers
export function calculateTotalPlannedCost(trip: Trip): number {
  const tripNights = Math.ceil(
    (trip.endDate.getTime() - trip.startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const totalTravelers = trip.adults + trip.children;

  return trip.plannedItems.reduce((sum, item) => {
    switch (item.type) {
      case 'flight':
        return sum + (item.price * totalTravelers);  // Per person × travelers
      case 'hotel':
        // Use hotel-specific nights if set, otherwise fall back to trip nights
        const hotelNights = item.nights || tripNights;
        return sum + (item.price * hotelNights);     // Per night × hotel nights
      case 'activity':
        return sum + (item.price * totalTravelers);  // Per person × travelers
      default:
        return sum + item.price;
    }
  }, 0);
}

// Helper to create trip context for AI
export function createTripContext(trip: Trip): TripContext {
  const nights = Math.ceil(
    (trip.endDate.getTime() - trip.startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const totalTravelers = trip.adults + trip.children;

  const flights = trip.plannedItems.filter((item) => item.type === 'flight');
  const hotels = trip.plannedItems.filter((item) => item.type === 'hotel');
  const activities = trip.plannedItems.filter((item) => item.type === 'activity');

  const totalPlannedCost = calculateTotalPlannedCost(trip);
  const budgetTier = getBudgetTier(trip.budget, nights, totalTravelers);
  const priceRanges = getPriceRanges(budgetTier);

  return {
    destination: trip.destination,
    country: trip.country,
    startDate: trip.startDate.toISOString().split('T')[0],
    endDate: trip.endDate.toISOString().split('T')[0],
    nights,
    adults: trip.adults,
    children: trip.children,
    totalTravelers,
    totalBudget: trip.budget,
    budgetTier,
    budgetPerPersonPerNight: trip.budget / totalTravelers / nights,
    interests: trip.interests,
    flexibility: trip.flexibility,
    plannedItems: { flights, hotels, activities },
    totalPlannedCost,
    remainingBudget: trip.budget - totalPlannedCost,
    priceRanges,
  };
}
