import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Calendar, Mic, Leaf, User } from 'lucide-react-native';
import HomeStackNavigator from './HomeStackNavigator';
import { COLORS } from '../constants/colors';

// Placeholder screens for other tabs
const PlaceholderScreen = () => <View style={{ flex: 1, backgroundColor: COLORS.white }} />;

const Tab = createBottomTabNavigator();

const CustomMicButton = ({ children, onPress }: any) => (
  <TouchableOpacity
    style={styles.customMicButton}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={styles.micInner}>
      {children}
    </View>
  </TouchableOpacity>
);

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: '#F8F9FA',
          borderTopWidth: 0,
          elevation: 0,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        }
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <View style={color === COLORS.primary ? styles.activeIconContainer : null}>
              <Home color={color === COLORS.primary ? COLORS.primary : color} size={size} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Planner"
        component={PlaceholderScreen}
        options={{
          tabBarLabel: 'Planner',
          tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Mic"
        component={PlaceholderScreen} // Dummy component
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color }) => <Mic color={COLORS.white} size={28} />,
          tabBarButton: (props) => <CustomMicButton {...props} />,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            // Handle mic press later
            console.log('Mic pressed');
          },
        }}
      />
      <Tab.Screen
        name="Nutrients"
        component={PlaceholderScreen}
        options={{
          tabBarLabel: 'Nutrients',
          tabBarIcon: ({ color, size }) => <Leaf color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Account"
        component={PlaceholderScreen}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  customMicButton: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1A4D2E', // Darker green for mic button
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  activeIconContainer: {
    backgroundColor: '#E8F5E9', // Light green highlight
    padding: 8,
    borderRadius: 20,
  }
});

export default MainTabNavigator;

