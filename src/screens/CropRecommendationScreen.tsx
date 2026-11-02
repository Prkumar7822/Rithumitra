import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Bell, ChevronDown, CheckCircle2 } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useCropStore } from '../store/useCropStore';
import CropCard from '../components/crops/CropCard';
import { COLORS } from '../constants/colors';

const CropRecommendationScreen = () => {
  const navigation = useNavigation<any>();
  const { recommendations, isIntercropping, setIsIntercropping } = useCropStore();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <ArrowLeft color={COLORS.primary} size={24} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}>
          <Bell color={COLORS.primary} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.mainTitle}>Recommended Crops</Text>
        <Text style={styles.subTitle}>For Your Soil</Text>

        <View style={styles.filtersContainer}>
          <View style={styles.dropdown}>
            <Text style={styles.dropdownLabel}>Field Selection</Text>
            <View style={styles.dropdownInner}>
              <Text style={styles.dropdownValue}>RythuMitra Farm - 1</Text>
              <ChevronDown color={COLORS.textLight} size={20} />
            </View>
          </View>
          <View style={styles.dropdown}>
            <Text style={styles.dropdownLabel}>Season Selection</Text>
            <View style={styles.dropdownInner}>
              <Text style={styles.dropdownValue}>Kharif 2024</Text>
              <ChevronDown color={COLORS.textLight} size={20} />
            </View>
          </View>
          <View style={styles.dropdown}>
            <Text style={styles.dropdownLabel}>Crop to Yield (Optional)</Text>
            <View style={styles.dropdownInner}>
              <Text style={styles.dropdownValue}>High Yield</Text>
              <ChevronDown color={COLORS.textLight} size={20} />
            </View>
          </View>

          <TouchableOpacity style={styles.getRecBtn}>
            <Text style={styles.getRecBtnText}>Get Recommendation</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.soilStatusCard}>
          <Text style={styles.soilStatusTitle}>Soil Status: Healthy 85%</Text>
          <View style={styles.soilMetrics}>
            <View style={styles.soilMetric}>
              <Text style={styles.soilMetricLabel}>N</Text>
              <Text style={styles.soilMetricValue}>High</Text>
            </View>
            <View style={styles.soilMetric}>
              <Text style={styles.soilMetricLabel}>P</Text>
              <Text style={styles.soilMetricValue}>Medium</Text>
            </View>
            <View style={styles.soilMetric}>
              <Text style={styles.soilMetricLabel}>K</Text>
              <Text style={styles.soilMetricValue}>Optimal</Text>
            </View>
          </View>
        </View>

        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleBtn, !isIntercropping && styles.toggleActive]}
            onPress={() => setIsIntercropping(false)}
          >
            <Text style={[styles.toggleText, !isIntercropping && styles.toggleTextActive]}>Single Crop</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleBtn, isIntercropping && styles.toggleActive]}
            onPress={() => setIsIntercropping(true)}
          >
            <Text style={[styles.toggleText, isIntercropping && styles.toggleTextActive]}>INTERCROPPING</Text>
          </TouchableOpacity>
        </View>

        {!isIntercropping ? (
          <View style={styles.listContainer}>
            {recommendations.map(crop => (
              <CropCard key={crop.crop_id} crop={crop} />
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Intercropping recommendations will appear here.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  iconBtn: {
    padding: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  subTitle: {
    fontSize: 18,
    color: '#D84315', // Orange red color from design
    marginBottom: 20,
    fontWeight: '600',
  },
  filtersContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  dropdown: {
    marginBottom: 12,
  },
  dropdownLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  dropdownInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dropdownValue: {
    fontSize: 14,
    color: COLORS.textDark,
  },
  getRecBtn: {
    backgroundColor: '#1A4D2E',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  getRecBtnText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  soilStatusCard: {
    backgroundColor: '#FAF8EB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0D4B0',
    alignItems: 'center',
  },
  soilStatusTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 12,
  },
  soilMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  soilMetric: {
    alignItems: 'center',
  },
  soilMetricLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  soilMetricValue: {
    fontSize: 12,
    color: '#D84315',
    fontWeight: '500',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
  },
  toggleActive: {
    backgroundColor: '#1A4D2E',
  },
  toggleText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textLight,
  },
  toggleTextActive: {
    color: COLORS.white,
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textLight,
  }
});

export default CropRecommendationScreen;
