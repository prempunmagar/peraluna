'use client';

import { useState } from 'react';
import {
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Plane,
  Hotel,
  MapPinned,
  Clock,
  Check,
  X,
  Sparkles,
  Eye,
} from 'lucide-react';
import { Trip, PlannedItem, getBudgetTier, calculateTotalPlannedCost } from '@/lib/types/trip';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useTripStore } from '@/lib/stores/trip-store';
import { BookingSummaryModal } from './booking-summary-modal';

interface TripSummaryProps {
  trip: Trip;
}

export function TripSummary({ trip }: TripSummaryProps) {
  const { confirmAllBookings, removePlannedItem } = useTripStore();
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  // Get planned items by type
  const flightItems = trip.plannedItems.filter((item) => item.type === 'flight');
  const hotelItems = trip.plannedItems.filter((item) => item.type === 'hotel');
  const activityItems = trip.plannedItems.filter((item) => item.type === 'activity');

  // Calculate nights and travelers
  const nights = Math.ceil(
    (trip.endDate.getTime() - trip.startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const totalTravelers = trip.adults + trip.children;

  // Calculate total planned cost using the proper function
  const estimatedSpent = calculateTotalPlannedCost(trip);
  const budgetPercentage = (estimatedSpent / trip.budget) * 100;
  const remainingBudget = trip.budget - estimatedSpent;

  // Get budget tier for display
  const budgetTier = getBudgetTier(trip.budget, nights, totalTravelers);
  const budgetTierLabels = {
    budget: { label: 'Budget', color: 'bg-blue-100 text-blue-700' },
    standard: { label: 'Standard', color: 'bg-purple-100 text-purple-700' },
    luxury: { label: 'Luxury', color: 'bg-amber-100 text-amber-700' },
  };

  // Check if there are unconfirmed items
  const hasUnconfirmedItems = trip.plannedItems.some((item) => !item.isConfirmed);
  const hasConfirmedItems = trip.plannedItems.some((item) => item.isConfirmed);
  const hasPlannedItems = trip.plannedItems.length > 0;

  const handleConfirmAll = async () => {
    const result = await confirmAllBookings(trip.id);
    console.log('Bookings confirmed:', result.bookingReferences);
    // Show the summary modal after confirmation
    setShowSummaryModal(true);
  };

  const handleRemoveItem = async (itemId: string) => {
    await removePlannedItem(trip.id, itemId);
  };

  // Format traveler display
  const formatTravelers = () => {
    if (trip.children === 0) {
      return `${trip.adults} ${trip.adults === 1 ? 'adult' : 'adults'}`;
    }
    return `${trip.adults} ${trip.adults === 1 ? 'adult' : 'adults'}, ${trip.children} ${trip.children === 1 ? 'child' : 'children'}`;
  };

  return (
    <div className="flex h-full w-[320px] flex-col border-l border-border bg-background">
      {/* Header */}
      <div className="flex h-16 items-center border-b border-border px-4">
        <h2 className="text-sm font-bold uppercase tracking-wide text-primary">
          Your Trip Summary
        </h2>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Trip Details */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 shrink-0 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Destination</p>
              <p className="text-sm text-muted-foreground">
                {trip.destination}, {trip.country}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 shrink-0 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Dates</p>
              <p className="text-sm text-muted-foreground">
                {format(trip.startDate, 'MMM d')} - {format(trip.endDate, 'MMM d, yyyy')}
                <span className="ml-1 text-xs">({nights} nights)</span>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 shrink-0 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Travelers</p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">{formatTravelers()}</p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 shrink-0 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Budget</p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  ${trip.budget.toLocaleString()} total
                </p>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${budgetTierLabels[budgetTier].color}`}>
                  {budgetTierLabels[budgetTier].label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Bookings Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Your Bookings
          </h3>

          {/* Flights (show all if multiple, or empty state if none) */}
          {flightItems.length > 0 ? (
            flightItems.map((flight) => (
              <PlannedItemCard
                key={flight.id}
                item={flight}
                type="flight"
                nights={nights}
                travelers={totalTravelers}
                onRemove={handleRemoveItem}
              />
            ))
          ) : (
            <PlannedItemCard
              type="flight"
              nights={nights}
              travelers={totalTravelers}
              onRemove={handleRemoveItem}
            />
          )}

          {/* Hotels (show all if multiple, or empty state if none) */}
          {hotelItems.length > 0 ? (
            hotelItems.map((hotel) => (
              <PlannedItemCard
                key={hotel.id}
                item={hotel}
                type="hotel"
                nights={nights}
                travelers={totalTravelers}
                onRemove={handleRemoveItem}
              />
            ))
          ) : (
            <PlannedItemCard
              type="hotel"
              nights={nights}
              travelers={totalTravelers}
              onRemove={handleRemoveItem}
            />
          )}

          {/* Activities (if any) */}
          {activityItems.map((activity) => (
            <PlannedItemCard
              key={activity.id}
              item={activity}
              type="activity"
              nights={nights}
              travelers={totalTravelers}
              onRemove={handleRemoveItem}
            />
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Estimated Spent */}
        <div className="rounded-lg bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Estimated Total
            </span>
            <DollarSign className="h-4 w-4 text-primary" />
          </div>
          <p className="text-3xl font-bold text-primary">
            ${estimatedSpent.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            of ${trip.budget.toLocaleString()} budget
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full transition-all duration-500 ${
                budgetPercentage > 90
                  ? 'bg-red-500'
                  : budgetPercentage > 70
                  ? 'bg-amber-500'
                  : 'bg-gradient-to-r from-primary via-accent to-secondary'
              }`}
              style={{ width: `${Math.min(100, budgetPercentage)}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {remainingBudget >= 0
              ? `$${remainingBudget.toLocaleString()} remaining`
              : `$${Math.abs(remainingBudget).toLocaleString()} over budget`}
          </p>
        </div>

        {/* Confirm All Bookings Button */}
        {hasPlannedItems && hasUnconfirmedItems && (
          <Button
            onClick={handleConfirmAll}
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Confirm All Bookings
          </Button>
        )}

        {/* View Booking Details Button (shown when items are confirmed) */}
        {hasConfirmedItems && !hasUnconfirmedItems && (
          <Button
            onClick={() => setShowSummaryModal(true)}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <Eye className="mr-2 h-4 w-4" />
            View Booking Details
          </Button>
        )}
      </div>

      {/* Booking Summary Modal */}
      <BookingSummaryModal
        trip={trip}
        open={showSummaryModal}
        onOpenChange={setShowSummaryModal}
      />
    </div>
  );
}

// Sub-component for individual planned items
interface PlannedItemCardProps {
  item?: PlannedItem;
  type: 'flight' | 'hotel' | 'activity';
  nights: number;
  travelers: number;
  onRemove: (itemId: string) => void;
}

function PlannedItemCard({ item, type, nights, travelers, onRemove }: PlannedItemCardProps) {
  const icons = {
    flight: Plane,
    hotel: Hotel,
    activity: MapPinned,
  };

  // Generate label - include context for specific items
  const getLabel = () => {
    if (type === 'hotel' && item?.nights) {
      return `Hotel (${item.nights} nights)`;
    }
    if (type === 'flight' && item?.subtitle) {
      // Show route info from subtitle (e.g., "NYC → Tokyo")
      return `Flight`;
    }
    const labels = {
      flight: 'Flight',
      hotel: 'Hotel',
      activity: 'Activity',
    };
    return labels[type];
  };

  const emptyMessages = {
    flight: 'Not selected yet. Ask Luna for flight options!',
    hotel: 'Not selected yet. Ask Luna for hotel options!',
    activity: 'Ask Luna for activity suggestions!',
  };

  const Icon = icons[type];
  const hasItem = !!item;
  const isConfirmed = item?.isConfirmed || false;

  // Calculate display price with multiplier info
  const getDisplayPrice = () => {
    if (!item) return { unit: '', total: '' };

    if (type === 'flight') {
      const total = item.price * travelers;
      return {
        unit: `$${item.price.toLocaleString()}/person`,
        total: travelers > 1 ? `$${total.toLocaleString()} total (×${travelers})` : '',
      };
    }
    if (type === 'hotel') {
      // Use hotel-specific nights if available, otherwise fall back to trip nights
      const hotelNights = item.nights || nights;
      const total = item.price * hotelNights;
      return {
        unit: `$${item.price.toLocaleString()}/night`,
        total: hotelNights > 1 ? `$${total.toLocaleString()} total (×${hotelNights} nights)` : '',
      };
    }
    // Activity
    const total = item.price * travelers;
    return {
      unit: `$${item.price.toLocaleString()}/person`,
      total: travelers > 1 ? `$${total.toLocaleString()} total (×${travelers})` : '',
    };
  };

  const priceInfo = getDisplayPrice();

  // Get status badge
  const getStatusBadge = () => {
    if (isConfirmed) {
      return (
        <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
          <Check className="h-3 w-3" />
          Booked
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
        <Clock className="h-3 w-3" />
        Planned
      </span>
    );
  };

  return (
    <div
      className={`rounded-lg border-2 p-3 ${
        hasItem
          ? isConfirmed
            ? 'border-green-200 bg-green-50'
            : 'border-amber-200 bg-amber-50'
          : 'border-dashed border-muted'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${
            hasItem
              ? isConfirmed
                ? 'bg-green-100'
                : 'bg-amber-100'
              : 'bg-muted'
          }`}
        >
          <Icon
            className={`h-4 w-4 ${
              hasItem
                ? isConfirmed
                  ? 'text-green-600'
                  : 'text-amber-600'
                : 'text-muted-foreground'
            }`}
          />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">{getLabel()}</p>
        </div>
        {hasItem ? (
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            {!isConfirmed && (
              <button
                onClick={() => onRemove(item.id)}
                className="rounded-full p-1 hover:bg-red-100 transition-colors"
                title="Remove"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-red-500" />
              </button>
            )}
          </div>
        ) : (
          <Clock className="h-5 w-5 text-muted-foreground" />
        )}
      </div>

      {hasItem ? (
        <div className="space-y-1 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">{item.provider}</p>
          {item.subtitle && <p>{item.subtitle}</p>}
          {item.tag && (
            <span className="inline-block rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {item.tag}
            </span>
          )}
          <p className={`font-semibold ${isConfirmed ? 'text-green-700' : 'text-amber-700'}`}>
            {priceInfo.unit}
          </p>
          {priceInfo.total && (
            <p className="text-xs text-muted-foreground">{priceInfo.total}</p>
          )}
          {isConfirmed && item.bookingReference && (
            <p className="text-xs text-muted-foreground">
              Ref: <span className="font-mono">{item.bookingReference}</span>
            </p>
          )}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">{emptyMessages[type]}</p>
      )}
    </div>
  );
}
