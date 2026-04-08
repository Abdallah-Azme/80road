import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Country
  selectedCountryCode: string;
  setSelectedCountry: (code: string) => void;

  // Preferences (from QuickWizard)
  preferences: {
    propertyType: string;
    purpose: string;
    area: string;
    // Store IDs for pre-filling forms
    countryId?: number;
    stateId?: number;
    cityId?: number;
    categoryValues?: number[];
  } | null;
  setPreferences: (p: UIState['preferences']) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () =>
        set((s) => {
          const next = s.theme === 'light' ? 'dark' : 'light';
          if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', next === 'dark');
          }
          return { theme: next };
        }),

      selectedCountryCode: 'KW',
      setSelectedCountry: (code) => set({ selectedCountryCode: code }),

      preferences: null,
      setPreferences: (p) => set({ preferences: p }),
    }),
    {
      name: 'road80_ui',
      // Only persist theme + country + prefs — never server data
      partialize: (s) => ({
        theme: s.theme,
        selectedCountryCode: s.selectedCountryCode,
        preferences: s.preferences,
      }),
    }
  )
);
