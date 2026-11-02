import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Droplet, Calendar, TrendingUp } from 'lucide-react-native';
import { CropItem } from '../../models/cropTypes';
import { COLORS } from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';

interface CropCardProps {
  crop: CropItem;
}

const CropCard: React.FC<CropCardProps> = ({ crop }) => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.card}>
      <Image source={{ uri: crop.image_url }} style={styles.image} />
      <View style={styles.tagContainer}>
        <Text style={styles.tagText}>{crop.highlight_tag}</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{crop.crop_name}</Text>
          <Text style={styles.profit}>Profit: {crop.profit_level}</Text>
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metric}>
            <TrendingUp color="#E65100" size={14} />
            <Text style={styles.metricText}>{crop.expected_yield.value} quintals/acre</Text>
          </View>
          <View style={styles.metric}>
            <Droplet color="#1976D2" size={14} />
            <Text style={styles.metricText}>Water: {crop.water_requirement}</Text>
          </View>
        </View>
        <View style={[styles.metric, { marginBottom: 12 }]}>
          <Calendar color={COLORS.textLight} size={14} />
          <Text style={styles.metricText}>{crop.duration_days} Days</Text>
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('CropDetails', { cropId: crop.crop_id })}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 140,
  },
  tagContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    color: '#D84315',
    fontWeight: 'bold',
    fontSize: 12,
  },
  content: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  profit: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D84315',
  },
  metricsRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metricText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginLeft: 4,
  },
  button: {
    backgroundColor: '#1A4D2E', // Dark green from the image
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
  }
});

export default React.memo(CropCard);
