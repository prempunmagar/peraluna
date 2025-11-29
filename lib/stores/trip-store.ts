import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Trip,
  CreateTripData,
  PlannedItem,
  PlannedItemType,
  FlexibilityType,
  BudgetType,
  calculateTotalPlannedCost,
} from '@/lib/types/trip';

interface TripState {
  trips: Trip[];
  activeTrip: Trip | null;
  isLoading: boolean;
  isOnline: boolean; // Whether we're using Supabase or localStorage

  // Trip actions
  setActiveTrip: (trip: Trip | null) => void;
  createTrip: (data: CreateTripData) => Promise<string>;
  updateTrip: (id: string, data: Partial<CreateTripData>) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
  fetchTrips: () => Promise<void>;

  // Planned items actions
  addPlannedItem: (tripId: string, item: Omit<PlannedItem, 'id' | 'tripId' | 'createdAt' | 'isConfirmed'>) => Promise<void>;
  removePlannedItem: (tripId: string, itemId: string) => Promise<void>;
  confirmAllBookings: (tripId: string) => Promise<{ bookingReferences: string[] }>;
  getPlannedItemsByType: (tripId: string, type: PlannedItemType) => PlannedItem[];
  getTotalPlannedCost: (tripId: string) => number;
}

// Generate mock booking reference
function generateBookingRef(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PL-${timestamp}-${random}`;
}

export const useTripStore = create<TripState>()(
  persist(
    (set, get) => ({
      trips: [],
      activeTrip: null,
      isLoading: false,
      isOnline: false,

      setActiveTrip: (trip) => set({ activeTrip: trip }),

      createTrip: async (data) => {
        // Convert per-person budget to total if needed
        const totalTravelers = data.adults + data.children;
        const totalBudget = data.budgetType === 'per-person'
          ? data.budget * totalTravelers
          : data.budget;

        // Try API first
        try {
          const response = await fetch('/api/trips', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...data,
              budget: totalBudget,
              startDate: data.startDate.toISOString().split('T')[0],
              endDate: data.endDate.toISOString().split('T')[0],
            }),
          });

          if (response.ok) {
            const { trip } = await response.json();
            // Ensure dates are Date objects
            const newTrip: Trip = {
              ...trip,
              startDate: new Date(trip.startDate),
              endDate: new Date(trip.endDate),
              createdAt: new Date(trip.createdAt),
              updatedAt: new Date(trip.updatedAt),
            };
            set((state) => ({
              trips: [newTrip, ...state.trips],
              activeTrip: newTrip,
              isOnline: true,
            }));
            return newTrip.id;
          }
        } catch {
          // API failed, fall back to localStorage
        }

        // Fallback to localStorage
        const tripId = Date.now().toString();
        const newTrip: Trip = {
          id: tripId,
          destination: data.destination,
          country: data.country,
          startDate: data.startDate,
          endDate: data.endDate,
          adults: data.adults,
          children: data.children,
          budget: totalBudget,
          budgetType: data.budgetType,
          flexibility: data.flexibility as FlexibilityType,
          interests: data.interests,
          status: 'planning',
          plannedItems: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          trips: [newTrip, ...state.trips],
          activeTrip: newTrip,
          isOnline: false,
        }));
        return tripId;
      },

      updateTrip: async (id, data) => {
        const state = get();

        // Calculate new budget if needed
        const trip = state.trips.find(t => t.id === id);
        if (!trip) return;

        let newBudget = trip.budget;
        if (data.budget !== undefined || data.budgetType !== undefined || data.adults !== undefined || data.children !== undefined) {
          const adults = data.adults ?? trip.adults;
          const children = data.children ?? trip.children;
          const budgetType = (data.budgetType ?? trip.budgetType) as BudgetType;
          const budgetInput = data.budget ?? trip.budget;
          const totalTravelers = adults + children;

          newBudget = budgetType === 'per-person'
            ? budgetInput * totalTravelers
            : budgetInput;
        }

        // Try API first
        try {
          const response = await fetch(`/api/trips/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...data,
              budget: newBudget,
              startDate: data.startDate?.toISOString().split('T')[0],
              endDate: data.endDate?.toISOString().split('T')[0],
            }),
          });

          if (response.ok) {
            const { trip: updatedTrip } = await response.json();
            const processedTrip: Trip = {
              ...updatedTrip,
              startDate: new Date(updatedTrip.startDate),
              endDate: new Date(updatedTrip.endDate),
              createdAt: new Date(updatedTrip.createdAt),
              updatedAt: new Date(updatedTrip.updatedAt),
              plannedItems: updatedTrip.plannedItems?.map((item: PlannedItem) => ({
                ...item,
                createdAt: new Date(item.createdAt),
              })) || [],
            };

            set((state) => ({
              trips: state.trips.map(t => t.id === id ? processedTrip : t),
              activeTrip: state.activeTrip?.id === id ? processedTrip : state.activeTrip,
            }));
            return;
          }
        } catch {
          // API failed, fall back to localStorage
        }

        // Fallback to localStorage
        set((state) => {
          const updatedTrips = state.trips.map((t) => {
            if (t.id !== id) return t;
            return {
              ...t,
              ...data,
              budget: newBudget,
              flexibility: (data.flexibility as FlexibilityType) || t.flexibility,
              updatedAt: new Date(),
            };
          });

          return {
            trips: updatedTrips,
            activeTrip: state.activeTrip?.id === id
              ? updatedTrips.find(t => t.id === id) || null
              : state.activeTrip,
          };
        });
      },

      deleteTrip: async (id) => {
        // Try API first
        try {
          const response = await fetch(`/api/trips/${id}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            set((state) => ({
              trips: state.trips.filter((trip) => trip.id !== id),
              activeTrip: state.activeTrip?.id === id ? null : state.activeTrip,
            }));
            return;
          }
        } catch {
          // API failed, fall back to localStorage
        }

        // Fallback to localStorage
        set((state) => ({
          trips: state.trips.filter((trip) => trip.id !== id),
          activeTrip: state.activeTrip?.id === id ? null : state.activeTrip,
        }));
      },

      fetchTrips: async () => {
        set({ isLoading: true });

        // Try API first
        try {
          const response = await fetch('/api/trips');

          if (response.ok) {
            const { trips } = await response.json();
            const processedTrips = trips.map((trip: Trip) => ({
              ...trip,
              startDate: new Date(trip.startDate),
              endDate: new Date(trip.endDate),
              createdAt: new Date(trip.createdAt),
              updatedAt: new Date(trip.updatedAt),
              plannedItems: trip.plannedItems?.map((item: PlannedItem) => ({
                ...item,
                createdAt: new Date(item.createdAt),
              })) || [],
            }));

            set({
              trips: processedTrips,
              isLoading: false,
              isOnline: true,
            });
            return;
          }
        } catch {
          // API failed, use localStorage data
        }

        set({ isLoading: false, isOnline: false });
      },

      // Add a planned item (tentative selection)
      addPlannedItem: async (tripId, itemData) => {
        // Try API first
        try {
          const response = await fetch(`/api/trips/${tripId}/items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(itemData),
          });

          if (response.ok) {
            const { item } = await response.json();
            const newItem: PlannedItem = {
              ...item,
              createdAt: new Date(item.createdAt),
            };

            set((state) => {
              const updatedTrips = state.trips.map((trip) => {
                if (trip.id !== tripId) return trip;
                return {
                  ...trip,
                  plannedItems: [...trip.plannedItems, newItem],
                  updatedAt: new Date(),
                };
              });

              return {
                trips: updatedTrips,
                activeTrip: state.activeTrip?.id === tripId
                  ? updatedTrips.find(t => t.id === tripId) || null
                  : state.activeTrip,
              };
            });
            return;
          }
        } catch {
          // API failed, fall back to localStorage
        }

        // Fallback to localStorage
        const itemId = `pi-${Date.now()}`;
        const newItem: PlannedItem = {
          ...itemData,
          id: itemId,
          tripId,
          isConfirmed: false,
          createdAt: new Date(),
        };

        set((state) => {
          const updatedTrips = state.trips.map((trip) => {
            if (trip.id !== tripId) return trip;
            return {
              ...trip,
              plannedItems: [...trip.plannedItems, newItem],
              updatedAt: new Date(),
            };
          });

          return {
            trips: updatedTrips,
            activeTrip: state.activeTrip?.id === tripId
              ? updatedTrips.find(t => t.id === tripId) || null
              : state.activeTrip,
          };
        });
      },

      // Remove a planned item
      removePlannedItem: async (tripId, itemId) => {
        // Try API first
        try {
          const response = await fetch(`/api/trips/${tripId}/items/${itemId}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            set((state) => {
              const updatedTrips = state.trips.map((trip) => {
                if (trip.id !== tripId) return trip;
                return {
                  ...trip,
                  plannedItems: trip.plannedItems.filter((item) => item.id !== itemId),
                  updatedAt: new Date(),
                };
              });

              return {
                trips: updatedTrips,
                activeTrip: state.activeTrip?.id === tripId
                  ? updatedTrips.find(t => t.id === tripId) || null
                  : state.activeTrip,
              };
            });
            return;
          }
        } catch {
          // API failed, fall back to localStorage
        }

        // Fallback to localStorage
        set((state) => {
          const updatedTrips = state.trips.map((trip) => {
            if (trip.id !== tripId) return trip;
            return {
              ...trip,
              plannedItems: trip.plannedItems.filter((item) => item.id !== itemId),
              updatedAt: new Date(),
            };
          });

          return {
            trips: updatedTrips,
            activeTrip: state.activeTrip?.id === tripId
              ? updatedTrips.find(t => t.id === tripId) || null
              : state.activeTrip,
          };
        });
      },

      // Confirm all bookings and generate booking references
      confirmAllBookings: async (tripId) => {
        const bookingReferences: string[] = [];
        const state = get();
        const trip = state.trips.find(t => t.id === tripId);

        if (!trip) return { bookingReferences: [] };

        // Try API first for each unconfirmed item
        const unconfirmedItems = trip.plannedItems.filter(item => !item.isConfirmed);

        for (const item of unconfirmedItems) {
          const bookingRef = generateBookingRef();
          bookingReferences.push(bookingRef);

          try {
            await fetch(`/api/trips/${tripId}/items/${item.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                isConfirmed: true,
                bookingReference: bookingRef,
              }),
            });
          } catch {
            // Continue even if API fails
          }
        }

        // Update trip status
        try {
          await fetch(`/api/trips/${tripId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'booked' }),
          });
        } catch {
          // Continue even if API fails
        }

        // Update local state
        set((state) => {
          let refIndex = 0;
          const updatedTrips = state.trips.map((t) => {
            if (t.id !== tripId) return t;

            const confirmedItems = t.plannedItems.map((item) => {
              if (item.isConfirmed) return item;
              return {
                ...item,
                isConfirmed: true,
                bookingReference: bookingReferences[refIndex++] || generateBookingRef(),
              };
            });

            return {
              ...t,
              plannedItems: confirmedItems,
              status: 'booked' as const,
              updatedAt: new Date(),
            };
          });

          return {
            trips: updatedTrips,
            activeTrip: state.activeTrip?.id === tripId
              ? updatedTrips.find(t => t.id === tripId) || null
              : state.activeTrip,
          };
        });

        return { bookingReferences };
      },

      // Get planned items by type
      getPlannedItemsByType: (tripId, type) => {
        const trip = get().trips.find((t) => t.id === tripId);
        if (!trip) return [];
        return trip.plannedItems.filter((item) => item.type === type);
      },

      // Get total planned cost for a trip
      getTotalPlannedCost: (tripId) => {
        const trip = get().trips.find((t) => t.id === tripId);
        if (!trip) return 0;
        return calculateTotalPlannedCost(trip);
      },
    }),
    {
      name: 'peraluna-trips',
      // Custom serialization for Date objects
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const parsed = JSON.parse(str);
          // Convert date strings back to Date objects
          if (parsed.state?.trips) {
            parsed.state.trips = parsed.state.trips.map((trip: Trip) => ({
              ...trip,
              startDate: new Date(trip.startDate),
              endDate: new Date(trip.endDate),
              createdAt: new Date(trip.createdAt),
              updatedAt: new Date(trip.updatedAt),
              plannedItems: trip.plannedItems?.map((item: PlannedItem) => ({
                ...item,
                createdAt: new Date(item.createdAt),
              })) || [],
            }));
          }
          if (parsed.state?.activeTrip) {
            parsed.state.activeTrip = {
              ...parsed.state.activeTrip,
              startDate: new Date(parsed.state.activeTrip.startDate),
              endDate: new Date(parsed.state.activeTrip.endDate),
              createdAt: new Date(parsed.state.activeTrip.createdAt),
              updatedAt: new Date(parsed.state.activeTrip.updatedAt),
              plannedItems: parsed.state.activeTrip.plannedItems?.map((item: PlannedItem) => ({
                ...item,
                createdAt: new Date(item.createdAt),
              })) || [],
            };
          }
          return parsed;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);
