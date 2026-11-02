import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/DashboardScreen';
import CropRecommendationScreen from '../screens/CropRecommendationScreen';
import CropDetailsScreen from '../screens/CropDetailsScreen';
import DeviceConnectionScreen from '../screens/DeviceConnectionScreen';

export type HomeStackParamList = {
  Dashboard: undefined;
  CropRecommendation: undefined;
  CropDetails: { cropId: string };
  DeviceConnection: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="CropRecommendation" component={CropRecommendationScreen} />
      <Stack.Screen name="CropDetails" component={CropDetailsScreen} />
      <Stack.Screen name="DeviceConnection" component={DeviceConnectionScreen} />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
