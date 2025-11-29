'use client';

import { Calendar, Clock, Sparkles } from 'lucide-react';
import { useWizardStore } from '@/lib/stores/wizard-store';

const FLEXIBILITY_OPTIONS = [
  {
    value: 'very-flexible' as const,
    label: 'Very Flexible',
    icon: Sparkles,
    description: 'I can adjust dates and plans easily',
    benefit: 'Best deals and more options',
    color: 'border-green-500 bg-green-50 dark:bg-green-950',
    selectedColor: 'border-green-500 bg-green-100 dark:bg-green-900',
  },
  {
    value: 'moderately-flexible' as const,
    label: 'Moderately Flexible',
    icon: Calendar,
    description: 'Some flexibility in dates',
    benefit: 'Good balance of choice and price',
    color: 'border-blue-500 bg-blue-50 dark:bg-blue-950',
    selectedColor: 'border-blue-500 bg-blue-100 dark:bg-blue-900',
  },
  {
    value: 'not-flexible' as const,
    label: 'Not Flexible',
    icon: Clock,
    description: 'Fixed dates and preferences',
    benefit: 'Precise recommendations',
    color: 'border-orange-500 bg-orange-50 dark:bg-orange-950',
    selectedColor: 'border-orange-500 bg-orange-100 dark:bg-orange-900',
  },
];

export function Step5Flexibility() {
  const { flexibility, updateField } = useWizardStore();

  return (
    <div className="space-y-6">
      <p className="text-center text-sm text-muted-foreground">
        This helps Luna provide better recommendations and find the best options for you.
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        {FLEXIBILITY_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isSelected = flexibility === option.value;

          return (
            <button
              key={option.value}
              onClick={() => updateField('flexibility', option.value)}
              className={`group relative flex flex-col items-center rounded-xl border-2 p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                isSelected ? option.selectedColor : option.color
              }`}
            >
              {/* Icon */}
              <div
                className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
                  isSelected ? 'bg-primary text-primary-foreground' : 'bg-background'
                }`}
              >
                <Icon className="h-8 w-8" />
              </div>

              {/* Label */}
              <h3 className="mb-2 text-lg font-bold text-foreground">
                {option.label}
              </h3>

              {/* Description */}
              <p className="mb-3 text-sm text-muted-foreground">
                {option.description}
              </p>

              {/* Benefit Badge */}
              <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {option.benefit}
              </div>

              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                  <svg
                    className="h-5 w-5"
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

      {/* Info Box */}
      <div className="rounded-lg border border-muted bg-muted/20 p-4">
        <h4 className="mb-2 font-medium text-foreground">💡 Pro Tip</h4>
        <p className="text-sm text-muted-foreground">
          More flexibility often means better deals! Luna can find alternative
          dates or nearby destinations that might save you money.
        </p>
      </div>
    </div>
  );
}
