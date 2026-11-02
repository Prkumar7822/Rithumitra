import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LineChart, CheckCircle2 } from 'lucide-react-native';
import { useHomeStore } from '../../store/useHomeStore';
import { COLORS } from '../../constants/colors';

const SoilHealthCard = () => {
  const { soilHealth, selectedField } = useHomeStore();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <LineChart color={COLORS.white} size={24} />
        <View style={styles.statusTag}>
          <CheckCircle2 color={COLORS.white} size={14} style={{ marginRight: 4 }} />
          <Text style={styles.statusTagText}>Healthy</Text>
        </View>
      </View>

      <Text style={styles.title}>Soil Health</Text>
      <Text style={styles.subtitle}>Nutrient levels are optimal for your current {selectedField.crop} crop cycle.</Text>

      <View style={styles.metricsContainer}>
        <View style={styles.metricBlock}>
          <Text style={styles.metricLabel}>Nitrogen</Text>
          <Text style={styles.metricValue}>{soilHealth.nitrogen}</Text>
        </View>
        <View style={styles.metricBlock}>
          <Text style={styles.metricLabel}>Moisture</Text>
          <Text style={styles.metricValue}>{soilHealth.moisture}</Text>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.btnSecondary} activeOpacity={0.8}>
          <Text style={styles.btnSecondaryText}>Know More</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnPrimary} activeOpacity={0.8}>
          <Text style={styles.btnPrimaryText}>Soil Test</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E5631', // Deep green
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusTagText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '500',
  },
  title: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: '#A5D6A7',
    fontSize: 12,
    marginBottom: 16,
    lineHeight: 18,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricBlock: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
  },
  metricLabel: {
    color: '#A5D6A7',
    fontSize: 10,
    marginBottom: 4,
  },
  metricValue: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btnSecondary: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  btnSecondaryText: {
    color: '#1E5631',
    fontWeight: 'bold',
    fontSize: 14,
  },
  btnPrimary: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: '#1E5631',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default React.memo(SoilHealthCard);
