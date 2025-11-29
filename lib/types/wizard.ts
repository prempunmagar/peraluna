export interface WizardFormData {
  // Step 1: Destination
  destination: string;
  country: string;

  // Step 2: Dates
  startDate: Date | null;
  endDate: Date | null;

  // Step 3: Travelers
  adults: number;    // Min 1
  children: number;  // Min 0

  // Step 4: Budget
  budget: number;
  budgetType: 'total' | 'per-person';

  // Step 5: Flexibility
  flexibility: 'very-flexible' | 'moderately-flexible' | 'not-flexible' | '';

  // Step 6: Interests
  interests: string[];
}

export interface WizardState extends WizardFormData {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  updateField: <K extends keyof WizardFormData>(
    field: K,
    value: WizardFormData[K]
  ) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

export const TOTAL_STEPS = 6;

export const STEP_TITLES = [
  'Where do you want to go?',
  'When are you planning to travel?',
  'How many people are traveling?',
  "What's your budget?",
  'How flexible is your trip?',
  'What interests you most?',
];
