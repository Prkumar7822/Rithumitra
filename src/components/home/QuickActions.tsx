import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants/colors';
import FertilizerIcon from '../../images/svg/FertilizerRecommendation.svg';
import CropRecIcon from '../../images/svg/CropRecommendation.svg';
import SoilHealthIcon from '../../images/svg/SoilHealthCorrection.svg';
import ValueAdditionIcon from '../../images/svg/ValueAddition.svg';

const actions = [
  { id: '1', title: 'Fertilizer\nRecommendation', Icon: FertilizerIcon },
  { id: '2', title: 'Crop\nRecommendation', Icon: CropRecIcon },
  { id: '3', title: 'Soil Health\nCorrection', Icon: SoilHealthIcon },
  { id: '4', title: 'Value Addition\n', Icon: ValueAdditionIcon },
];

const QuickActions = () => {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Quick Actions</Text>
      <View style={styles.grid}>
        {actions.map((action) => (
          <TouchableOpacity key={action.id} style={styles.card} activeOpacity={0.7} onPress={() => { if (action.id === '2') { navigation.navigate('CropRecommendation'); } }}>
            <View style={styles.iconContainer}>
              <action.Icon width={50} height={50} />
            </View>
            <Text style={styles.title}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E5631',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: COLORS.white,
    width: '48%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    marginBottom: 12,
  },
  title: {
    fontSize: 11,
    color: COLORS.textDark,
    textAlign: 'center',
    fontWeight: '500',
  }
});

export default React.memo(QuickActions);

