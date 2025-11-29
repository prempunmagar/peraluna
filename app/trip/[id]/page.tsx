'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { TripsSidebar } from '@/components/trip-planner/trips-sidebar';
import { ChatInterface } from '@/components/chat/chat-interface';
import { TripSummary } from '@/components/trip-planner/trip-summary';
import { useTripStore } from '@/lib/stores/trip-store';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { AuthGuard } from '@/components/auth/auth-guard';

interface TripPlannerPageProps {
  params: Promise<{ id: string }>;
}

export default function TripPlannerPage({ params }: TripPlannerPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const trips = useTripStore((state) => state.trips);

  const trip = trips.find((t) => t.id === id);

  if (!trip) {
    return (
      <AuthGuard>
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-foreground">
            Trip Not Found
          </h1>
          <p className="mb-6 text-muted-foreground">
            The trip you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Left Sidebar - Trips List */}
      <TripsSidebar currentTripId={id} />

      {/* Center - Chat Interface */}
      <div className="flex min-h-0 flex-1 flex-col">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <div className="h-6 w-px bg-border" />
            <div>
              <h1 className="text-lg font-bold text-foreground">
                {trip.destination}, {trip.country}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5">
              <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              <span className="text-sm font-medium text-primary">
                Luna is active
              </span>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="min-h-0 flex-1 overflow-hidden">
          <ChatInterface tripId={id} />
        </div>
      </div>

      {/* Right Sidebar - Trip Summary */}
      <TripSummary trip={trip} />
    </div>
    </AuthGuard>
  );
}
