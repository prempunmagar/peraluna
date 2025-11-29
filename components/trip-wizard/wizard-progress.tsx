import { Check } from 'lucide-react';
import { TOTAL_STEPS } from '@/lib/types/wizard';

interface WizardProgressProps {
  currentStep: number;
}

export function WizardProgress({ currentStep }: WizardProgressProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((step) => {
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;

          return (
            <div key={step} className="flex flex-1 items-center">
              <div className="relative flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    isCompleted
                      ? 'border-primary bg-primary text-primary-foreground'
                      : isCurrent
                        ? 'border-primary bg-background text-primary'
                        : 'border-muted bg-background text-muted-foreground'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{step}</span>
                  )}
                </div>
                <span className="mt-2 text-xs font-medium text-muted-foreground">
                  Step {step}
                </span>
              </div>

              {step < TOTAL_STEPS && (
                <div className="mx-2 h-0.5 flex-1 bg-border">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isCompleted ? 'bg-primary' : 'bg-transparent'
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">Progress</span>
          <span className="text-muted-foreground">
            {Math.round(((currentStep - 1) / TOTAL_STEPS) * 100)}% Complete
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-gradient-to-r from-primary via-accent to-secondary transition-all duration-500"
            style={{
              width: `${((currentStep - 1) / TOTAL_STEPS) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
