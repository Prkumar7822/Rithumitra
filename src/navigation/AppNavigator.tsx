import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';
import OnboardingScreen from '../screens/OnboardingScreen';
import LanguageSelectionScreen from '../screens/LanguageSelectionScreen';
import LoginScreen from '../screens/LoginScreen';
import VerifyOTPScreen from '../screens/VerifyOTPScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ProfileSetupScreen from '../screens/ProfileSetupScreen';
import { RootStackParamList } from './navigationTypes';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { hasCompletedOnboarding, hasCompletedLanguageSelection } = useAppStore();
  const { isAuthenticated, isProfileComplete, checkExistingSession } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  // We need to wait for Zustand persist hydration before rendering
  // Also check existing session here
  useEffect(() => {
    checkExistingSession().then(() => {
      setIsMounted(true);
    });
  }, []);

  if (!isMounted) {
    return null; // Or a simple loading spinner
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!hasCompletedOnboarding ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : !hasCompletedLanguageSelection ? (
          <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen} />
        ) : isAuthenticated ? (
          isProfileComplete ? (
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
          ) : (
            <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
          )
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="VerifyOTP" component={VerifyOTPScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
