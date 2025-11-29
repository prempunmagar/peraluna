import { create } from 'zustand';
import { WizardState, WizardFormData, TOTAL_STEPS } from '@/lib/types/wizard';

const initialFormData: WizardFormData = {
  destination: '',
  country: '',
  startDate: null,
  endDate: null,
  adults: 2,
  children: 0,
  budget: 3000,
  budgetType: 'total',
  flexibility: '',
  interests: [],
};

export const useWizardStore = create<WizardState>((set) => ({
  ...initialFormData,
  currentStep: 1,

  setCurrentStep: (step) => set({ currentStep: step }),

  updateField: (field, value) => set({ [field]: value }),

  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, TOTAL_STEPS),
    })),

  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 1),
    })),

  reset: () => set({ ...initialFormData, currentStep: 1 }),
}));
