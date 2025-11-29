'use client';

import { Minus, Plus, Users, User, Baby } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWizardStore } from '@/lib/stores/wizard-store';

interface QuickOption {
  label: string;
  adults: number;
  children: number;
}

const QUICK_OPTIONS: QuickOption[] = [
  { label: 'Solo', adults: 1, children: 0 },
  { label: 'Couple', adults: 2, children: 0 },
  { label: 'Family', adults: 2, children: 2 },
  { label: 'Group', adults: 4, children: 0 },
];

interface CounterProps {
  label: string;
  sublabel: string;
  value: number;
  min: number;
  max: number;
  icon: React.ReactNode;
  onIncrement: () => void;
  onDecrement: () => void;
}

function Counter({ label, sublabel, value, min, max, icon, onIncrement, onDecrement }: CounterProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border bg-card p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          {icon}
        </div>
        <div>
          <h4 className="font-semibold">{label}</h4>
          <p className="text-sm text-muted-foreground">{sublabel}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button
          size="icon"
          variant="outline"
          className="h-10 w-10 rounded-full"
          onClick={onDecrement}
          disabled={value <= min}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center text-xl font-bold">{value}</span>
        <Button
          size="icon"
          variant="outline"
          className="h-10 w-10 rounded-full"
          onClick={onIncrement}
          disabled={value >= max}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function Step3Travelers() {
  const { adults, children, updateField } = useWizardStore();

  const totalTravelers = adults + children;

  const isQuickOptionActive = (option: QuickOption) =>
    option.adults === adults && option.children === children;

  const selectQuickOption = (option: QuickOption) => {
    updateField('adults', option.adults);
    updateField('children', option.children);
  };

  return (
    <div className="space-y-6">
      {/* Total Display */}
      <div className="flex flex-col items-center pb-2">
        <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Users className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-4xl font-bold text-primary">{totalTravelers}</h3>
        <p className="text-muted-foreground">
          {totalTravelers === 1 ? 'Traveler' : 'Travelers'} total
        </p>
      </div>

      {/* Adults Counter */}
      <Counter
        label="Adults"
        sublabel="Ages 13 and above"
        value={adults}
        min={1}
        max={10}
        icon={<User className="h-6 w-6 text-primary" />}
        onIncrement={() => updateField('adults', Math.min(adults + 1, 10))}
        onDecrement={() => updateField('adults', Math.max(adults - 1, 1))}
      />

      {/* Children Counter */}
      <Counter
        label="Children"
        sublabel="Ages 0-12"
        value={children}
        min={0}
        max={10}
        icon={<Baby className="h-6 w-6 text-primary" />}
        onIncrement={() => updateField('children', Math.min(children + 1, 10))}
        onDecrement={() => updateField('children', Math.max(children - 1, 0))}
      />

      {/* Quick Select Options */}
      <div className="pt-2">
        <h4 className="mb-3 text-center text-sm font-medium text-muted-foreground">
          Quick Select
        </h4>
        <div className="flex flex-wrap justify-center gap-2">
          {QUICK_OPTIONS.map((option) => (
            <Button
              key={option.label}
              variant={isQuickOptionActive(option) ? 'default' : 'outline'}
              className="min-w-[80px]"
              onClick={() => selectQuickOption(option)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Info Message */}
      <div className="rounded-lg border border-muted bg-muted/20 p-4">
        <p className="text-sm text-muted-foreground">
          Luna will suggest family-friendly activities and accommodations based on your group composition.
        </p>
      </div>
    </div>
  );
}
