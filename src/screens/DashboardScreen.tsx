import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import HomeHeader from '../components/home/HomeHeader';
import AlertCard from '../components/home/AlertCard';
import WeatherCard from '../components/home/WeatherCard';
import FieldSelector from '../components/home/FieldSelector';
import SoilHealthCard from '../components/home/SoilHealthCard';
import QuickActions from '../components/home/QuickActions';
import FieldIntelligence from '../components/home/FieldIntelligence';
import TodaysFeed from '../components/home/TodaysFeed';
import { HomeStackParamList } from '../navigation/HomeStackNavigator';

const DashboardScreen = () => {
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader />
        <AlertCard />
        <WeatherCard />
        <FieldSelector />
        <SoilHealthCard />
        <QuickActions />
        {/* Hardware Integration Test Button */}
        <TouchableOpacity
          style={styles.deviceButton}
          onPress={() => navigation.navigate('DeviceConnection')}
          activeOpacity={0.7}
        >
          <Text style={styles.deviceButtonText}>Connect Hardware Device</Text>
        </TouchableOpacity>
        <FieldIntelligence />
        <TodaysFeed />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 80,
  },
  deviceButton: {
    backgroundColor: '#1E5631',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  deviceButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default DashboardScreen;
