import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WizardState {
  // Add Wizard (17 steps)
  postAdForm: {
    listingType: string;
    propertyType: string;
    country: string;
    governorate: string;
    area: string;
    rooms: number | string;
    bathrooms: number | string;
    size: number;
    balcony: string;
    parking: string;
    parkingSystems: string[];
    electricity: string;
    water: string;
    ac: string;
    // Files cannot be persisted in localStorage easily, 
    // so we'll store them in a separate non-persisted state if needed,
    // or just accept that they are lost on refresh for now (standard behavior).
  };
  setPostAdValue: (key: string, value: unknown) => void;
  resetPostAdForm: () => void;

  // Quick Start (5 steps)
  quickStartForm: {
    name: string;
    purpose: string;
    propertyType: string;
    governorate: string;
    area: string;
  };
  setQuickStartValue: (key: string, value: unknown) => void;
  resetQuickStartForm: () => void;
}

const INIT_POST_AD = {
  listingType: '',
  propertyType: '',
  country: 'الكويت',
  governorate: '',
  area: '',
  rooms: '',
  bathrooms: '',
  size: 400,
  balcony: '',
  parking: '',
  parkingSystems: [],
  electricity: '',
  water: '',
  ac: '',
};

const INIT_QUICK_START = {
  name: '',
  purpose: '',
  propertyType: '',
  governorate: '',
  area: '',
};

export const useWizardStore = create<WizardState>()(
  persist(
    (set) => ({
      postAdForm: INIT_POST_AD,
      setPostAdValue: (key, value) =>
        set((s) => ({
          postAdForm: { ...s.postAdForm, [key]: value },
        })),
      resetPostAdForm: () => set({ postAdForm: INIT_POST_AD }),

      quickStartForm: INIT_QUICK_START,
      setQuickStartValue: (key, value) =>
        set((s) => ({
          quickStartForm: { ...s.quickStartForm, [key]: value },
        })),
      resetQuickStartForm: () => set({ quickStartForm: INIT_QUICK_START }),
    }),
    {
      name: 'road80_wizard',
      partialize: (s) => ({
        postAdForm: s.postAdForm,
        quickStartForm: s.quickStartForm,
      }),
    }
  )
);
