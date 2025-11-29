'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trip } from '@/lib/types/trip';
import { useTripStore } from '@/lib/stores/trip-store';
import {
  Calendar,
  Users,
  DollarSign,
  MapPin,
  MessageCircle,
  Settings,
  Plane,
  Hotel,
  Check,
  Clock,
  Trash2,
} from 'lucide-react';

interface TripCardProps {
  trip: Trip;
}

const statusConfig = {
  planning: {
    label: 'Planning',
    className: 'bg-amber-500 text-white',
  },
  booked: {
    label: 'Booked',
    className: 'bg-blue-500 text-white',
  },
  completed: {
    label: 'Completed',
    className: 'bg-green-500 text-white',
  },
};

export function TripCard({ trip }: TripCardProps) {
  const router = useRouter();
  const { deleteTrip } = useTripStore();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const status = statusConfig[trip.status];

  // Check if flights and hotels are booked based on plannedItems
  const hasFlightPlanned = trip.plannedItems?.some((item) => item.type === 'flight');
  const hasHotelPlanned = trip.plannedItems?.some((item) => item.type === 'hotel');
  const flightConfirmed = trip.plannedItems?.some((item) => item.type === 'flight' && item.isConfirmed);
  const hotelConfirmed = trip.plannedItems?.some((item) => item.type === 'hotel' && item.isConfirmed);

  const handleViewTrip = () => {
    router.push(`/trip/${trip.id}`);
  };

  const handleDelete = () => {
    deleteTrip(trip.id);
    setIsDeleteOpen(false);
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
      <CardContent className="p-6">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <h3 className="text-xl font-bold text-foreground">
                {trip.destination}
              </h3>
              <p className="text-sm text-muted-foreground">{trip.country}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={status.className}>{status.label}</Badge>
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
              <AlertDialogTrigger asChild>
                <button
                  className="rounded-full p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-red-100 hover:text-red-600 group-hover:opacity-100"
                  title="Delete trip"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this trip?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete your trip to <strong>{trip.destination}, {trip.country}</strong>?
                    This action cannot be undone and all planned bookings will be lost.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete Trip
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {format(trip.startDate, 'MMM d')} -{' '}
              {format(trip.endDate, 'MMM d, yyyy')}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>
              {trip.children > 0
                ? `${trip.adults} ${trip.adults === 1 ? 'adult' : 'adults'}, ${trip.children} ${trip.children === 1 ? 'child' : 'children'}`
                : `${trip.adults} ${trip.adults === 1 ? 'adult' : 'adults'}`}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span>Budget: ${trip.budget.toLocaleString()}</span>
          </div>
        </div>

        {/* Booking Status */}
        <div className="mt-4 flex gap-3">
          <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
            flightConfirmed
              ? 'bg-green-100 text-green-700'
              : hasFlightPlanned
                ? 'bg-amber-100 text-amber-700'
                : 'bg-muted text-muted-foreground'
          }`}>
            <Plane className="h-4 w-4" />
            <span className="text-sm font-medium">Flights</span>
            {flightConfirmed ? (
              <Check className="h-4 w-4" />
            ) : (
              <Clock className="h-4 w-4" />
            )}
          </div>
          <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
            hotelConfirmed
              ? 'bg-green-100 text-green-700'
              : hasHotelPlanned
                ? 'bg-amber-100 text-amber-700'
                : 'bg-muted text-muted-foreground'
          }`}>
            <Hotel className="h-4 w-4" />
            <span className="text-sm font-medium">Hotels</span>
            {hotelConfirmed ? (
              <Check className="h-4 w-4" />
            ) : (
              <Clock className="h-4 w-4" />
            )}
          </div>
        </div>

        {/* Interests Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {trip.interests.slice(0, 3).map((interest) => (
            <span
              key={interest}
              className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
            >
              {interest}
            </span>
          ))}
          {trip.interests.length > 3 && (
            <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
              +{trip.interests.length - 3} more
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="border-t border-border bg-muted/30 p-4">
        <div className="flex w-full gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => router.push(`/trip/${trip.id}/edit`)}
          >
            <Settings className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            size="sm"
            className="flex-1 group-hover:bg-primary group-hover:text-primary-foreground"
            onClick={handleViewTrip}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Plan with Luna
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
