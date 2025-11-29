'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTripStore } from '@/lib/stores/trip-store';
import { useUIStore } from '@/lib/stores/ui-store';
import { Trip } from '@/lib/types/trip';
import { format } from 'date-fns';

interface TripsSidebarProps {
  currentTripId: string;
}

export function TripsSidebar({ currentTripId }: TripsSidebarProps) {
  const router = useRouter();
  const trips = useTripStore((state) => state.trips);
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();

  const handleTripClick = (tripId: string) => {
    router.push(`/trip/${tripId}`);
  };

  const handleCreateTrip = () => {
    router.push('/trip/setup');
  };

  if (isSidebarCollapsed) {
    return (
      <div className="flex h-full w-16 flex-col border-r border-border bg-sidebar">
        <button
          onClick={toggleSidebar}
          className="flex h-16 items-center justify-center border-b border-border hover:bg-accent"
        >
          <ChevronRight className="h-5 w-5 text-sidebar-foreground" />
        </button>
        <div className="flex flex-1 flex-col items-center gap-2 p-2">
          {trips.slice(0, 5).map((trip) => (
            <button
              key={trip.id}
              onClick={() => handleTripClick(trip.id)}
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                trip.id === currentTripId
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
              title={trip.destination}
            >
              {trip.destination.slice(0, 2).toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-[280px] flex-col border-r border-border bg-sidebar">
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <h2 className="font-semibold text-sidebar-foreground">Your Trips</h2>
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-1 hover:bg-accent"
        >
          <ChevronLeft className="h-5 w-5 text-sidebar-foreground" />
        </button>
      </div>

      {/* Current Trip */}
      <div className="border-b border-sidebar-border p-4">
        {trips
          .filter((trip) => trip.id === currentTripId)
          .map((trip) => (
            <TripItem key={trip.id} trip={trip} isCurrent />
          ))}
      </div>

      {/* Other Trips */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="mb-2 px-2 text-xs font-medium text-sidebar-foreground/60">
          Other Trips
        </div>
        <div className="space-y-1">
          {trips
            .filter((trip) => trip.id !== currentTripId)
            .map((trip) => (
              <TripItem
                key={trip.id}
                trip={trip}
                onClick={() => handleTripClick(trip.id)}
              />
            ))}
        </div>
      </div>

      {/* Create New Trip Button */}
      <div className="border-t border-sidebar-border p-4">
        <Button
          onClick={handleCreateTrip}
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          size="sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Trip
        </Button>
      </div>
    </div>
  );
}

interface TripItemProps {
  trip: Trip;
  isCurrent?: boolean;
  onClick?: () => void;
}

function TripItem({ trip, isCurrent, onClick }: TripItemProps) {
  const statusConfig = {
    planning: { color: 'bg-amber-500', label: 'Planning' },
    booked: { color: 'bg-blue-500', label: 'Booked' },
    completed: { color: 'bg-green-500', label: 'Done' },
  };

  const status = statusConfig[trip.status];

  return (
    <button
      onClick={onClick}
      disabled={isCurrent}
      className={`w-full rounded-lg p-3 text-left transition-colors ${
        isCurrent
          ? 'bg-sidebar-accent cursor-default'
          : 'hover:bg-sidebar-accent/50'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sidebar-foreground">
              {trip.destination}
            </h3>
            {isCurrent && <Check className="h-4 w-4 text-primary" />}
          </div>
          <p className="text-xs text-sidebar-foreground/60">{trip.country}</p>
          <p className="mt-1 text-xs text-sidebar-foreground/60">
            {format(trip.startDate, 'MMM d')} - {format(trip.endDate, 'MMM d')}
          </p>
        </div>
        <Badge className={`h-5 text-xs ${status.color} border-0 text-white`}>
          {status.label}
        </Badge>
      </div>
    </button>
  );
}
