'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWizardStore } from '@/lib/stores/wizard-store';
import { useTripStore } from '@/lib/stores/trip-store';
import { WizardProgress } from '@/components/trip-wizard/wizard-progress';
import { Step1Destination } from '@/components/trip-wizard/step1-destination';
import { Step2Dates } from '@/components/trip-wizard/step2-dates';
import { Step3Travelers } from '@/components/trip-wizard/step3-travelers';
import { Step4Budget } from '@/components/trip-wizard/step4-budget';
import { Step5Flexibility } from '@/components/trip-wizard/step5-flexibility';
import { Step6Interests } from '@/components/trip-wizard/step6-interests';
import { STEP_TITLES, TOTAL_STEPS } from '@/lib/types/wizard';
import { AuthGuard } from '@/components/auth/auth-guard';

export default function TripSetupPage() {
  const router = useRouter();
  const {
    currentStep,
    nextStep,
    prevStep,
    reset,
    destination,
    country,
    startDate,
    endDate,
    adults,
    children,
    budget,
    budgetType,
    flexibility,
    interests,
  } = useWizardStore();

  const createTrip = useTripStore((state) => state.createTrip);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Destination />;
      case 2:
        return <Step2Dates />;
      case 3:
        return <Step3Travelers />;
      case 4:
        return <Step4Budget />;
      case 5:
        return <Step5Flexibility />;
      case 6:
        return <Step6Interests />;
      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return destination && country;
      case 2:
        return startDate && endDate;
      case 3:
        return adults >= 1;
      case 4:
        return budget >= 500;
      case 5:
        return flexibility !== '';
      case 6:
        return interests.length >= 1;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep === TOTAL_STEPS) {
      handleComplete();
    } else {
      nextStep();
    }
  };

  const handleComplete = async () => {
    if (!startDate || !endDate) return;

    const tripId = await createTrip({
      destination,
      country,
      startDate,
      endDate,
      adults,
      children,
      budget,
      budgetType,
      flexibility,
      interests,
    });

    reset();
    // Redirect to chat interface with the new trip
    router.push(`/trip/${tripId}`);
  };

  const handleCancel = () => {
    reset();
    router.push('/dashboard');
  };

  return (
    <AuthGuard>
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Button variant="ghost" onClick={handleCancel}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <div className="text-sm text-muted-foreground">
            Step {currentStep} of {TOTAL_STEPS}
          </div>
        </div>

        {/* Progress Indicator */}
        <WizardProgress currentStep={currentStep} />

        {/* Main Card */}
        <div className="animate-in fade-in zoom-in rounded-2xl border border-border bg-card p-8 shadow-2xl shadow-primary/5 duration-500 md:p-12">
          {/* Step Title */}
          <h1 className="mb-8 text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {STEP_TITLES[currentStep - 1]}
          </h1>

          {/* Step Content */}
          <div className="mb-8">{renderStep()}</div>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex-1"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Previous
            </Button>
            <Button
              size="lg"
              onClick={handleNext}
              disabled={!isStepValid()}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {currentStep === TOTAL_STEPS ? (
                <>
                  <Check className="mr-2 h-5 w-5" />
                  Start Planning
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>

          {/* Validation Message */}
          {!isStepValid() && (
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Please complete this step to continue
            </p>
          )}
        </div>
      </div>
    </div>
    </AuthGuard>
  );
}
