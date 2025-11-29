'use client';

import { Plane, Hotel, MapPin, Utensils, Check } from 'lucide-react';

export type OptionType = 'flight' | 'hotel' | 'activity' | 'restaurant';

export interface OptionData {
  id: string;
  type: OptionType;
  title: string;
  subtitle: string;
  price: string;
  details: string[];
  tag?: string;
  tagColor?: string;
  nights?: number; // For hotels: number of nights
}

interface OptionCardProps {
  option: OptionData;
  onSelect: (option: OptionData) => void;
  isSelected?: boolean;
}

const iconMap = {
  flight: Plane,
  hotel: Hotel,
  activity: MapPin,
  restaurant: Utensils,
};

const tagColorMap: Record<string, string> = {
  'Best Value': 'bg-green-500',
  'Premium': 'bg-purple-500',
  'Budget': 'bg-blue-500',
  'Luxury': 'bg-amber-500',
  'Fastest': 'bg-cyan-500',
  'Popular': 'bg-pink-500',
};

export function OptionCard({ option, onSelect, isSelected }: OptionCardProps) {
  const Icon = iconMap[option.type] || Plane;
  const tagColor = option.tag ? (tagColorMap[option.tag] || 'bg-primary') : 'bg-primary';

  return (
    <button
      onClick={() => onSelect(option)}
      className={`w-full text-left rounded-xl border-2 p-4 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
        isSelected
          ? 'border-primary bg-primary/10 shadow-md'
          : 'border-border bg-card hover:border-primary/50'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${isSelected ? 'bg-primary text-white' : 'bg-muted'}`}>
          <Icon className="h-5 w-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header with tag */}
          <div className="flex items-center gap-2 mb-1">
            {option.tag && (
              <span className={`text-xs font-semibold text-white px-2 py-0.5 rounded-full ${tagColor}`}>
                {option.tag}
              </span>
            )}
          </div>

          {/* Title */}
          <h4 className="font-semibold text-foreground truncate">{option.title}</h4>

          {/* Subtitle */}
          <p className="text-sm text-muted-foreground">{option.subtitle}</p>

          {/* Details */}
          <div className="mt-2 space-y-1">
            {option.details.map((detail, i) => (
              <p key={i} className="text-xs text-muted-foreground">{detail}</p>
            ))}
          </div>
        </div>

        {/* Price & Select */}
        <div className="text-right shrink-0">
          <p className="text-lg font-bold text-primary">{option.price}</p>
          {isSelected ? (
            <div className="mt-2 flex items-center justify-end gap-1 text-sm text-primary">
              <Check className="h-4 w-4" />
              Selected
            </div>
          ) : (
            <p className="mt-2 text-xs text-muted-foreground">Click to select</p>
          )}
        </div>
      </div>
    </button>
  );
}

interface OptionCardsProps {
  options: OptionData[];
  onSelect: (option: OptionData) => void;
  selectedId?: string;
}

export function OptionCards({ options, onSelect, selectedId }: OptionCardsProps) {
  return (
    <div className="space-y-3 my-3">
      {options.map((option) => (
        <OptionCard
          key={option.id}
          option={option}
          onSelect={onSelect}
          isSelected={selectedId === option.id}
        />
      ))}
    </div>
  );
}
