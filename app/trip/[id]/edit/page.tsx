'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ArrowLeft, Save, Calendar as CalendarIcon, MapPin, Users, DollarSign, Sparkles, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useTripStore } from '@/lib/stores/trip-store';
import { AuthGuard } from '@/components/auth/auth-guard';
import { cn } from '@/lib/utils';

interface EditTripPageProps {
  params: Promise<{ id: string }>;
}

const FLEXIBILITY_OPTIONS = [
  { value: 'very-flexible', label: 'Very Flexible', description: 'Open to changes' },
  { value: 'moderately-flexible', label: 'Moderately Flexible', description: 'Some flexibility' },
  { value: 'not-flexible', label: 'Not Flexible', description: 'Fixed dates' },
];

export default function EditTripPage({ params }: EditTripPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { trips, updateTrip } = useTripStore();
  const trip = trips.find((t) => t.id === id);

  // Initialize state directly from trip (no useEffect needed)
  const [startDate, setStartDate] = useState<Date | undefined>(() =>
    trip ? new Date(trip.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(() =>
    trip ? new Date(trip.endDate) : undefined
  );
  const [adults, setAdults] = useState(() => trip?.adults ?? 2);
  const [children, setChildren] = useState(() => trip?.children ?? 0);
  const [budget, setBudget] = useState(() => trip?.budget ?? 3000);
  const [budgetType, setBudgetType] = useState<'total' | 'per-person'>(() =>
    trip?.budgetType ?? 'total'
  );
  const [flexibility, setFlexibility] = useState(() => trip?.flexibility ?? '');
  const [interests, setInterests] = useState<string[]>(() => trip?.interests ?? []);
  const [customInterest, setCustomInterest] = useState('');
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isEndOpen, setIsEndOpen] = useState(false);

  const totalTravelers = adults + children;


  const addCustomInterest = () => {
    const trimmed = customInterest.trim();
    if (trimmed && !interests.includes(trimmed)) {
      setInterests([...interests, trimmed]);
      setCustomInterest('');
    }
  };

  if (!trip) {
    return (
      <AuthGuard>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold text-foreground">Trip Not Found</h1>
            <p className="mb-6 text-muted-foreground">The trip you&apos;re looking for doesn&apos;t exist.</p>
            <Button onClick={() => router.push('/dashboard')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </AuthGuard>
    );
  }

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleSave = () => {
    if (!startDate || !endDate) return;

    updateTrip(id, {
      startDate,
      endDate,
      adults,
      children,
      budget,
      budgetType,
      flexibility: flexibility as 'very-flexible' | 'moderately-flexible' | 'not-flexible',
      interests,
    });

    router.push('/dashboard');
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="mx-auto max-w-3xl px-4 py-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <Button variant="ghost" onClick={() => router.push('/dashboard')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>

          {/* Main Card */}
          <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
            <h1 className="mb-8 text-2xl font-bold text-foreground">Edit Trip</h1>

            <div className="space-y-8">
              {/* Destination (Read-only) */}
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Destination</p>
                    <p className="text-xl font-bold">{trip.destination}, {trip.country}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  To change destination, please create a new trip.
                </p>
              </div>

              {/* Dates */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Travel Dates</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Popover open={isStartOpen} onOpenChange={setIsStartOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'h-12 w-full justify-start text-left font-normal',
                            !startDate && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="z-[100] w-auto bg-white p-0 shadow-xl" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={(date) => {
                            setStartDate(date);
                            setIsStartOpen(false);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Popover open={isEndOpen} onOpenChange={setIsEndOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'h-12 w-full justify-start text-left font-normal',
                            !endDate && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, 'PPP') : 'Pick a date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="z-[100] w-auto bg-white p-0 shadow-xl" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={(date) => {
                            setEndDate(date);
                            setIsEndOpen(false);
                          }}
                          disabled={(date) => startDate ? date < startDate : false}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              {/* Travelers */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Travelers ({totalTravelers} total)</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Adults */}
                  <div className="rounded-lg border border-border p-4">
                    <p className="mb-2 text-sm font-medium">Adults</p>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                      >
                        -
                      </Button>
                      <span className="w-12 text-center text-2xl font-bold">{adults}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setAdults(Math.min(10, adults + 1))}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  {/* Children */}
                  <div className="rounded-lg border border-border p-4">
                    <p className="mb-2 text-sm font-medium">Children (0-12)</p>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setChildren(Math.max(0, children - 1))}
                      >
                        -
                      </Button>
                      <span className="w-12 text-center text-2xl font-bold">{children}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setChildren(Math.min(10, children + 1))}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Budget */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Budget</h2>
                </div>
                {/* Budget Type Toggle */}
                <div className="flex justify-center">
                  <div className="inline-flex rounded-lg border border-border bg-muted/30 p-1">
                    <button
                      onClick={() => setBudgetType('total')}
                      className={cn(
                        'rounded-md px-4 py-2 text-sm font-medium transition-all',
                        budgetType === 'total'
                          ? 'bg-white text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      Total Budget
                    </button>
                    <button
                      onClick={() => setBudgetType('per-person')}
                      className={cn(
                        'rounded-md px-4 py-2 text-sm font-medium transition-all',
                        budgetType === 'per-person'
                          ? 'bg-white text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      Per Person
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Math.max(500, Number(e.target.value)))}
                    className="h-12 pl-10 text-lg"
                    min={500}
                  />
                </div>
                {budgetType === 'per-person' && totalTravelers > 1 && (
                  <p className="text-sm text-muted-foreground text-center">
                    Total for {totalTravelers} travelers: <span className="font-semibold">${(budget * totalTravelers).toLocaleString()}</span>
                  </p>
                )}
              </div>

              {/* Flexibility */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Flexibility</h2>
                <div className="grid gap-3 sm:grid-cols-3">
                  {FLEXIBILITY_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFlexibility(option.value)}
                      className={cn(
                        'rounded-lg border-2 p-4 text-left transition-all',
                        flexibility === option.value
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <p className="font-medium">{option.label}</p>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Interests</h2>
                </div>

                {/* Current Interests as removable tags */}
                {interests.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest) => (
                      <span
                        key={interest}
                        className="flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
                      >
                        {interest}
                        <button
                          onClick={() => toggleInterest(interest)}
                          className="ml-1 rounded-full p-0.5 hover:bg-white/20"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No interests selected. Add some below!</p>
                )}

                {/* Add Interest Input */}
                <div className="space-y-2">
                  <Label>Add Interest</Label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="e.g., Beach, Culture, Wine tasting..."
                      value={customInterest}
                      onChange={(e) => setCustomInterest(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addCustomInterest()}
                      className="h-10"
                    />
                    <Button
                      type="button"
                      onClick={addCustomInterest}
                      disabled={!customInterest.trim()}
                      size="icon"
                      className="h-10 w-10"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex gap-4 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.push('/dashboard')}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSave}
                  disabled={!startDate || !endDate}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
