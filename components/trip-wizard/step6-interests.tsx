'use client';

import { useState } from 'react';
import {
  Waves,
  Mountain,
  Landmark,
  Tent,
  Music,
  UtensilsCrossed,
  Clock,
  ShoppingBag,
  Dumbbell,
  Flower2,
  Camera,
  Palmtree,
  Plus,
  X,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useWizardStore } from '@/lib/stores/wizard-store';

const INTERESTS = [
  { value: 'Beach', icon: Waves, color: 'bg-blue-500' },
  { value: 'Mountains', icon: Mountain, color: 'bg-green-600' },
  { value: 'Culture', icon: Landmark, color: 'bg-purple-500' },
  { value: 'Adventure', icon: Tent, color: 'bg-orange-500' },
  { value: 'Nightlife', icon: Music, color: 'bg-pink-500' },
  { value: 'Food', icon: UtensilsCrossed, color: 'bg-red-500' },
  { value: 'History', icon: Clock, color: 'bg-amber-600' },
  { value: 'Shopping', icon: ShoppingBag, color: 'bg-indigo-500' },
  { value: 'Sports', icon: Dumbbell, color: 'bg-cyan-500' },
  { value: 'Wellness', icon: Flower2, color: 'bg-emerald-500' },
  { value: 'Photography', icon: Camera, color: 'bg-gray-600' },
  { value: 'Nature', icon: Palmtree, color: 'bg-lime-600' },
];

export function Step6Interests() {
  const { interests, updateField } = useWizardStore();
  const [customInterest, setCustomInterest] = useState('');

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      updateField(
        'interests',
        interests.filter((i) => i !== interest)
      );
    } else {
      updateField('interests', [...interests, interest]);
    }
  };

  const addCustomInterest = () => {
    const trimmed = customInterest.trim();
    if (trimmed && !interests.includes(trimmed)) {
      updateField('interests', [...interests, trimmed]);
      setCustomInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    updateField(
      'interests',
      interests.filter((i) => i !== interest)
    );
  };

  // Get custom interests (ones not in the predefined list)
  const customInterests = interests.filter(
    (i) => !INTERESTS.some((preset) => preset.value === i)
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Select 3-5 interests to help Luna personalize your trip
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          {interests.length} selected
          {interests.length >= 3 && interests.length <= 5 && (
            <span className="ml-2 text-green-600">✓ Perfect!</span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {INTERESTS.map((interest) => {
          const Icon = interest.icon;
          const isSelected = interests.includes(interest.value);

          return (
            <button
              key={interest.value}
              onClick={() => toggleInterest(interest.value)}
              className={`group relative flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all duration-200 hover:scale-105 ${
                isSelected
                  ? 'border-primary bg-primary/10 shadow-md'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full ${interest.color} text-white transition-all ${
                  isSelected ? 'scale-110' : 'opacity-70'
                }`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <span
                className={`text-sm font-medium ${
                  isSelected ? 'text-primary' : 'text-foreground'
                }`}
              >
                {interest.value}
              </span>

              {isSelected && (
                <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Custom Interest Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Add Your Own Interest</label>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="e.g., Wine tasting, Scuba diving..."
            value={customInterest}
            onChange={(e) => setCustomInterest(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCustomInterest()}
            className="h-12"
          />
          <Button
            type="button"
            onClick={addCustomInterest}
            disabled={!customInterest.trim()}
            className="h-12 px-4"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Custom Interests Display */}
      {customInterests.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {customInterests.map((interest) => (
            <span
              key={interest}
              className="flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-sm font-medium text-primary-foreground"
            >
              {interest}
              <button
                onClick={() => removeInterest(interest)}
                className="ml-1 rounded-full p-0.5 hover:bg-white/20"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Validation Message */}
      {interests.length > 5 && (
        <div className="rounded-lg border border-amber-500 bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-200">
          We recommend selecting up to 5 interests for the best recommendations.
        </div>
      )}

      {interests.length > 0 && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <h4 className="mb-2 font-medium text-foreground">Your Interests</h4>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest) => (
              <span
                key={interest}
                className="rounded-full bg-primary px-3 py-1 text-sm font-medium text-primary-foreground"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
