'use client';

import { DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useWizardStore } from '@/lib/stores/wizard-store';

const QUICK_BUDGETS = [1000, 3000, 5000, 10000];

const BUDGET_RANGES = [
  { label: 'Budget', min: 500, max: 2000, color: 'text-blue-600' },
  { label: 'Standard', min: 2001, max: 5000, color: 'text-purple-600' },
  { label: 'Luxury', min: 5001, max: 20000, color: 'text-amber-600' },
];

export function Step4Budget() {
  const { budget, budgetType, adults, children, updateField } = useWizardStore();

  const totalTravelers = adults + children;

  // Calculate the effective total budget for tier calculation
  const effectiveTotalBudget = budgetType === 'per-person'
    ? budget * totalTravelers
    : budget;

  const getBudgetRange = (amount: number) => {
    if (amount <= 2000) return BUDGET_RANGES[0];
    if (amount <= 5000) return BUDGET_RANGES[1];
    return BUDGET_RANGES[2];
  };

  // Use effective total for range display
  const currentRange = getBudgetRange(effectiveTotalBudget);

  return (
    <div className="space-y-8">
      {/* Budget Type Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-lg border border-border bg-muted/30 p-1">
          <button
            onClick={() => updateField('budgetType', 'total')}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
              budgetType === 'total'
                ? 'bg-white text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Total Budget
          </button>
          <button
            onClick={() => updateField('budgetType', 'per-person')}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
              budgetType === 'per-person'
                ? 'bg-white text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Per Person
          </button>
        </div>
      </div>

      {/* Budget Display */}
      <div className="flex flex-col items-center">
        <h3 className="mb-2 text-5xl font-bold text-accent">
          ${budget.toLocaleString()}
        </h3>
        <p className={`text-lg font-medium ${currentRange.color}`}>
          {currentRange.label} Trip
        </p>
        {budgetType === 'per-person' && totalTravelers > 1 && (
          <p className="mt-2 text-sm text-muted-foreground">
            Total: ${effectiveTotalBudget.toLocaleString()} ({totalTravelers} travelers)
          </p>
        )}
      </div>

      {/* Custom Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Custom Amount</label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="number"
            value={budget}
            onChange={(e) => {
              const value = Math.max(500, Math.min(50000, Number(e.target.value)));
              updateField('budget', value);
            }}
            className="h-12 pl-10 text-base"
            min={500}
            max={50000}
          />
        </div>
      </div>

      {/* Quick Select */}
      <div>
        <h4 className="mb-3 text-center text-sm font-medium text-muted-foreground">
          Quick Select
        </h4>
        <div className="grid grid-cols-4 gap-3">
          {QUICK_BUDGETS.map((amount) => (
            <Button
              key={amount}
              variant={budget === amount ? 'default' : 'outline'}
              onClick={() => updateField('budget', amount)}
              className="h-12"
            >
              ${(amount / 1000).toFixed(0)}k
            </Button>
          ))}
        </div>
      </div>

      {/* Budget Breakdown Info */}
      <div className="space-y-2 rounded-lg border border-muted bg-muted/20 p-4">
        <h4 className="font-medium text-foreground">What&apos;s included:</h4>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>✓ Flights & Transportation</li>
          <li>✓ Accommodation</li>
          <li>✓ Activities & Experiences</li>
          <li>✓ Food & Dining</li>
        </ul>
      </div>
    </div>
  );
}
