import * as Keychain from 'react-native-keychain';
import { TokenBundle } from '../models/apiTypes';

const TOKENS_KEY = 'rythumitra_auth';

export const saveTokens = async (tokens: TokenBundle) => {
  try {
    // Add a timestamp so we can check if it has expired locally
    const tokensWithTimestamp = {
      ...tokens,
      savedAt: Date.now(),
    };
    await Keychain.setGenericPassword(TOKENS_KEY, JSON.stringify(tokensWithTimestamp));
  } catch (error) {
    console.error('Error saving tokens:', error);
  }
};

export const getTokens = async (): Promise<(TokenBundle & { savedAt: number }) | null> => {
  try {
    const creds = await Keychain.getGenericPassword();
    if (creds) {
      return JSON.parse(creds.password);
    }
    return null;
  } catch (error) {
    console.error('Error retrieving tokens:', error);
    return null;
  }
};

export const clearTokens = async () => {
  try {
    await Keychain.resetGenericPassword();
  } catch (error) {
    console.error('Error clearing tokens:', error);
  }
};

export const isTokenValid = async (): Promise<boolean> => {
  const tokens = await getTokens();
  if (!tokens) return false;

  // token valid for 90 days = 90 * 24 * 60 * 60 * 1000 = 7776000000 ms
  const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  
  if (now - tokens.savedAt < NINETY_DAYS_MS) {
    return true;
  }
  
  return false;
};
