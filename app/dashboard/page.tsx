'use client';

import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { TripCard } from '@/components/dashboard/trip-card';
import { Button } from '@/components/ui/button';
import { useTripStore } from '@/lib/stores/trip-store';
import { AuthGuard } from '@/components/auth/auth-guard';

export default function DashboardPage() {
  const router = useRouter();
  const trips = useTripStore((state) => state.trips);

  const handleCreateTrip = () => {
    router.push('/trip/setup');
  };

  return (
    <AuthGuard>
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Title and CTA */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              My Trips
            </h1>
            <p className="mt-2 text-muted-foreground">
              Manage and plan your upcoming adventures
            </p>
          </div>
          <Button
            size="lg"
            onClick={handleCreateTrip}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Plus className="mr-2 h-5 w-5" />
            Create New Trip
          </Button>
        </div>

        {/* Trips Grid */}
        {trips.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 py-20">
            <div className="mb-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 p-6">
              <Plus className="h-10 w-10 text-primary" />
            </div>
            <h3 className="mb-3 text-2xl font-bold text-foreground">
              Ready for your next adventure?
            </h3>
            <p className="mb-6 max-w-md text-center text-muted-foreground">
              Let Luna, your AI travel companion, help you plan the perfect trip.
              Just tell her where you want to go!
            </p>
            <Button
              onClick={handleCreateTrip}
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Your First Trip
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </main>
    </div>
    </AuthGuard>
  );
}
