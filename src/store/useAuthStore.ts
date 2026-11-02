import { create } from 'zustand';
import { generateOtp, verifyOtp } from '../services/apiManager';
import { saveTokens, clearTokens, isTokenValid, getTokens } from '../services/tokenService';

interface AuthState {
  mobileNumber: string;
  isLoading: boolean;
  error: string | null;
  otpExpiresInSeconds: number;
  otpMaxAttempts: number;
  farmer: Record<string, any> | null;
  fields: any[] | null;
  isNewUser: boolean;
  isAuthenticated: boolean;
  isProfileComplete: boolean;

  setMobileNumber: (num: string) => void;
  requestOtp: (mobileNumber: string) => Promise<boolean>;
  verifyOtpCode: (mobileNumber: string, code: string) => Promise<boolean>;
  checkExistingSession: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  completeProfile: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  mobileNumber: '',
  isLoading: false,
  error: null,
  otpExpiresInSeconds: 0,
  otpMaxAttempts: 5,
  farmer: null,
  fields: null,
  isNewUser: false,
  isAuthenticated: false,
  isProfileComplete: false,

  setMobileNumber: (num) => set({ mobileNumber: num }),
  
  clearError: () => set({ error: null }),

  completeProfile: () => set({ isProfileComplete: true }),

  requestOtp: async (mobileNumber) => {
    set({ isLoading: true, error: null });
    try {
      const response = await generateOtp(mobileNumber);
      if (response.success) {
        set({ 
          mobileNumber, 
          otpExpiresInSeconds: response.expires_in_seconds,
          isLoading: false 
        });
        return true;
      }
      set({ error: response.message || 'Failed to generate OTP', isLoading: false });
      return false;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      return false;
    }
  },

  verifyOtpCode: async (mobileNumber, code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await verifyOtp(mobileNumber, code);
      if (response.success && response.tokens) {
        await saveTokens(response.tokens);
        
        set({
          isAuthenticated: true,
          isNewUser: response.is_new_user,
          farmer: response.farmer || null,
          fields: response.fields || null,
          isProfileComplete: !!(response.farmer?.is_profile_complete),
          isLoading: false,
          error: null
        });
        return true;
      }
      set({ error: 'Verification failed', isLoading: false });
      return false;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      return false;
    }
  },

  checkExistingSession: async () => {
    set({ isLoading: true });
    try {
      const valid = await isTokenValid();
      if (valid) {
        // Technically, the API doesn't have a /me endpoint to re-fetch the farmer data.
        // In a real app, you'd persist `farmer` data using AsyncStorage or fetch it.
        // For now, we just set authenticated to true so navigation bypasses login.
        set({ isAuthenticated: true, isProfileComplete: true, isLoading: false });
      } else {
        await clearTokens();
        set({ isAuthenticated: false, isLoading: false });
      }
    } catch {
      set({ isAuthenticated: false, isLoading: false });
    }
  },

  logout: async () => {
    await clearTokens();
    set({ 
      isAuthenticated: false, 
      farmer: null, 
      fields: null, 
      isNewUser: false,
      isProfileComplete: false,
      mobileNumber: ''
    });
  }
}));


