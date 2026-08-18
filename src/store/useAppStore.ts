import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppState {
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
  
  hasCompletedLanguageSelection: boolean;
  completeLanguageSelection: () => void;

  language: string;
  setLanguage: (lang: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      hasCompletedOnboarding: false,
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      
      hasCompletedLanguageSelection: false,
      completeLanguageSelection: () => set({ hasCompletedLanguageSelection: true }),

      language: 'en',
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
