'use client';

import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trip, PlannedItem } from '@/lib/types/trip';
import { format } from 'date-fns';
import {
  MapPin,
  Calendar,
  Users,
  Plane,
  Hotel,
  MapPinned,
  CheckCircle2,
  Download,
  Share2,
  Sparkles,
} from 'lucide-react';

interface BookingSummaryModalProps {
  trip: Trip;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookingSummaryModal({ trip, open, onOpenChange }: BookingSummaryModalProps) {
  const nights = Math.ceil(
    (trip.endDate.getTime() - trip.startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const totalTravelers = trip.adults + trip.children;

  // Get confirmed items
  const confirmedItems = trip.plannedItems.filter((item) => item.isConfirmed);
  const flightItem = confirmedItems.find((item) => item.type === 'flight');
  const hotelItem = confirmedItems.find((item) => item.type === 'hotel');
  const activityItems = confirmedItems.filter((item) => item.type === 'activity');

  // Calculate total cost
  const flightCost = flightItem ? flightItem.price * totalTravelers : 0;
  const hotelCost = hotelItem ? hotelItem.price * nights : 0;
  const activityCost = activityItems.reduce((sum, item) => sum + item.price * totalTravelers, 0);
  const totalCost = flightCost + hotelCost + activityCost;

  // Format traveler display
  const travelerText = trip.children === 0
    ? `${trip.adults} ${trip.adults === 1 ? 'adult' : 'adults'}`
    : `${trip.adults} ${trip.adults === 1 ? 'adult' : 'adults'}, ${trip.children} ${trip.children === 1 ? 'child' : 'children'}`;

  // Generate and download itinerary
  const handleDownload = () => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Trip Itinerary - ${trip.destination}, ${trip.country}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 800px; margin: 0 auto; padding: 40px 20px; }
    .header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #7c3aed; }
    .header h1 { color: #7c3aed; font-size: 28px; margin-bottom: 8px; }
    .header p { color: #666; font-size: 14px; }
    .section { margin-bottom: 30px; }
    .section-title { font-size: 18px; font-weight: 600; color: #7c3aed; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 1px solid #e5e5e5; }
    .overview-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
    .overview-item { background: #f8f8f8; padding: 15px; border-radius: 8px; }
    .overview-item label { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
    .overview-item p { font-size: 16px; font-weight: 600; margin-top: 4px; }
    .booking-card { background: #fff; border: 1px solid #e5e5e5; border-radius: 8px; padding: 20px; margin-bottom: 15px; }
    .booking-card h3 { font-size: 16px; color: #1a1a1a; margin-bottom: 10px; }
    .booking-card .details { color: #666; font-size: 14px; }
    .booking-card .reference { background: #d1fae5; color: #065f46; padding: 8px 12px; border-radius: 6px; margin-top: 10px; font-family: monospace; font-size: 13px; }
    .booking-card .price { text-align: right; font-size: 18px; font-weight: 600; color: #7c3aed; margin-top: 10px; }
    .total-section { background: linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%); color: white; padding: 25px; border-radius: 12px; text-align: center; }
    .total-section h2 { font-size: 32px; margin-bottom: 5px; }
    .total-section p { opacity: 0.9; }
    .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e5e5; color: #999; font-size: 12px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>🌴 Trip to ${trip.destination}, ${trip.country}</h1>
    <p>Your complete travel itinerary • Powered by Peraluna</p>
  </div>

  <div class="section">
    <div class="section-title">Trip Overview</div>
    <div class="overview-grid">
      <div class="overview-item">
        <label>Destination</label>
        <p>${trip.destination}, ${trip.country}</p>
      </div>
      <div class="overview-item">
        <label>Travel Dates</label>
        <p>${format(trip.startDate, 'MMM d')} - ${format(trip.endDate, 'MMM d, yyyy')}</p>
      </div>
      <div class="overview-item">
        <label>Duration</label>
        <p>${nights} nights</p>
      </div>
      <div class="overview-item">
        <label>Travelers</label>
        <p>${travelerText}</p>
      </div>
    </div>
  </div>

  ${flightItem ? `
  <div class="section">
    <div class="section-title">✈️ Flight</div>
    <div class="booking-card">
      <h3>${flightItem.title}</h3>
      <div class="details">
        <p>${flightItem.subtitle || ''}</p>
        ${flightItem.tag ? `<p><strong>${flightItem.tag}</strong></p>` : ''}
      </div>
      ${flightItem.bookingReference ? `<div class="reference">Booking Reference: ${flightItem.bookingReference}</div>` : ''}
      <div class="price">$${flightCost.toLocaleString()}</div>
    </div>
  </div>
  ` : ''}

  ${hotelItem ? `
  <div class="section">
    <div class="section-title">🏨 Accommodation</div>
    <div class="booking-card">
      <h3>${hotelItem.title}</h3>
      <div class="details">
        <p>${hotelItem.subtitle || ''}</p>
        ${hotelItem.tag ? `<p><strong>${hotelItem.tag}</strong></p>` : ''}
        <p>${nights} nights × $${hotelItem.price.toLocaleString()}/night</p>
      </div>
      ${hotelItem.bookingReference ? `<div class="reference">Booking Reference: ${hotelItem.bookingReference}</div>` : ''}
      <div class="price">$${hotelCost.toLocaleString()}</div>
    </div>
  </div>
  ` : ''}

  ${activityItems.length > 0 ? `
  <div class="section">
    <div class="section-title">🎯 Activities & Experiences</div>
    ${activityItems.map(activity => `
    <div class="booking-card">
      <h3>${activity.title}</h3>
      <div class="details">
        <p>${activity.subtitle || ''}</p>
        ${activity.tag ? `<p><strong>${activity.tag}</strong></p>` : ''}
      </div>
      ${activity.bookingReference ? `<div class="reference">Booking Reference: ${activity.bookingReference}</div>` : ''}
      <div class="price">$${(activity.price * totalTravelers).toLocaleString()}</div>
    </div>
    `).join('')}
  </div>
  ` : ''}

  <div class="section">
    <div class="total-section">
      <p>Total Trip Cost</p>
      <h2>$${totalCost.toLocaleString()}</h2>
      <p>${((totalCost / trip.budget) * 100).toFixed(0)}% of your $${trip.budget.toLocaleString()} budget</p>
    </div>
  </div>

  <div class="footer">
    <p>Generated on ${format(new Date(), 'MMMM d, yyyy')} • Peraluna Travel</p>
    <p>Have a wonderful trip! 🌟</p>
  </div>
</body>
</html>
    `;

    // Create blob and download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${trip.destination.toLowerCase().replace(/\s+/g, '-')}-itinerary.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl flex flex-col max-h-[85vh] p-0 gap-0 bg-white">
        {/* Fixed Header */}
        <div className="p-6 pb-4 border-b border-border shrink-0 bg-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 shrink-0">
              <CheckCircle2 className="h-7 w-7 text-green-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-foreground">Booking Confirmed!</h2>
              <p className="text-sm text-muted-foreground">
                Your trip to {trip.destination} is all set
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-5 bg-white">
          {/* Trip Overview */}
          <div className="rounded-lg bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Destination</p>
                  <p className="font-semibold">{trip.destination}, {trip.country}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Dates</p>
                  <p className="font-semibold">
                    {format(trip.startDate, 'MMM d')} - {format(trip.endDate, 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Travelers</p>
                  <p className="font-semibold">{travelerText}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="font-semibold">{nights} nights</p>
                </div>
              </div>
            </div>
          </div>

          {/* Flight Details */}
          {flightItem && (
            <BookingCard
              icon={Plane}
              title="Flight"
              item={flightItem}
              priceLabel={`$${flightItem.price.toLocaleString()}/person × ${totalTravelers}`}
              totalPrice={flightCost}
            />
          )}

          {/* Hotel Details */}
          {hotelItem && (
            <BookingCard
              icon={Hotel}
              title="Accommodation"
              item={hotelItem}
              priceLabel={`$${hotelItem.price.toLocaleString()}/night × ${nights} nights`}
              totalPrice={hotelCost}
            />
          )}

          {/* Activities */}
          {activityItems.length > 0 && (
            <div className="rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10">
                  <MapPinned className="h-4 w-4 text-accent" />
                </div>
                <h3 className="font-semibold">Activities & Experiences</h3>
              </div>
              <div className="space-y-3">
                {activityItems.map((activity) => (
                  <div key={activity.id} className="flex justify-between items-start border-b border-border pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      {activity.subtitle && (
                        <p className="text-sm text-muted-foreground">{activity.subtitle}</p>
                      )}
                      {activity.tag && (
                        <span className="inline-block mt-1 rounded bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                          {activity.tag}
                        </span>
                      )}
                      {activity.bookingReference && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Ref: <span className="font-mono">{activity.bookingReference}</span>
                        </p>
                      )}
                    </div>
                    <p className="font-semibold text-foreground">
                      ${(activity.price * totalTravelers).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-4 pt-3 border-t border-border">
                <span className="text-sm text-muted-foreground">Activities Total</span>
                <span className="font-bold text-accent">${activityCost.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Total Cost Summary */}
          <div className="rounded-lg bg-green-50 border-2 border-green-200 p-4">
            <div className="space-y-2">
              {flightItem && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Flights ({totalTravelers} × ${flightItem.price.toLocaleString()})</span>
                  <span>${flightCost.toLocaleString()}</span>
                </div>
              )}
              {hotelItem && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Hotel ({nights} nights × ${hotelItem.price.toLocaleString()})</span>
                  <span>${hotelCost.toLocaleString()}</span>
                </div>
              )}
              {activityItems.length > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Activities ({activityItems.length} items)</span>
                  <span>${activityCost.toLocaleString()}</span>
                </div>
              )}
              <div className="border-t border-green-300 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-bold text-lg">Total Trip Cost</span>
                  <span className="font-bold text-2xl text-green-700">${totalCost.toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {((totalCost / trip.budget) * 100).toFixed(0)}% of your ${trip.budget.toLocaleString()} budget
                </p>
              </div>
            </div>
          </div>

          {/* Interests reminder */}
          {trip.interests.length > 0 && (
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Your Interests</p>
              <div className="flex flex-wrap gap-2">
                {trip.interests.map((interest) => (
                  <span
                    key={interest}
                    className="rounded-full bg-muted px-3 py-1 text-xs"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Fixed Footer */}
        <div className="p-6 pt-4 border-t border-border shrink-0 bg-white rounded-b-lg">
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download Itinerary
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => {
              // Copy link to clipboard (for sharing)
              const shareUrl = `${window.location.origin}/trip/${trip.id}`;
              navigator.clipboard.writeText(shareUrl);
              alert('Trip link copied to clipboard!');
            }}>
              <Share2 className="mr-2 h-4 w-4" />
              Share Trip
            </Button>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-3">
            Confirmation emails will be sent to your registered email address.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Sub-component for individual booking cards
interface BookingCardProps {
  icon: React.ElementType;
  title: string;
  item: PlannedItem;
  priceLabel: string;
  totalPrice: number;
}

function BookingCard({ icon: Icon, title, item, priceLabel, totalPrice }: BookingCardProps) {
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <h3 className="font-semibold">{title}</h3>
        {item.tag && (
          <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {item.tag}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-medium">{item.title}</p>
            {item.subtitle && (
              <p className="text-sm text-muted-foreground">{item.subtitle}</p>
            )}
          </div>
        </div>

        {item.details && 'rawDetails' in item.details && Array.isArray(item.details.rawDetails) && (
          <div className="text-sm text-muted-foreground">
            {item.details.rawDetails.map((detail: string, idx: number) => (
              <p key={idx}>{detail}</p>
            ))}
          </div>
        )}

        {item.bookingReference && (
          <div className="flex items-center gap-2 rounded bg-green-100 px-3 py-2 mt-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-700">
              Booking Reference: <span className="font-mono font-bold">{item.bookingReference}</span>
            </span>
          </div>
        )}

        <div className="flex justify-between items-center pt-2 border-t border-border">
          <span className="text-sm text-muted-foreground">{priceLabel}</span>
          <span className="font-bold text-primary">${totalPrice.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
