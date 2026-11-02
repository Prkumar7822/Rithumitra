import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { useHomeStore } from '../../store/useHomeStore';
import { COLORS } from '../../constants/colors';

const FieldSelector = () => {
  const { selectedField } = useHomeStore();

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.7}>
      <View>
        <Text style={styles.label}>Selected Field</Text>
        <Text style={styles.name}>{selectedField.name}</Text>
        <Text style={styles.details}>{selectedField.acres} Acres • {selectedField.crop}</Text>
      </View>
      <View style={styles.rightInfo}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{selectedField.soilStatus}</Text>
        </View>
        <ChevronDown color={COLORS.textDark} size={20} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 10,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  details: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  rightInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  tagText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: 'bold',
  }
});

export default React.memo(FieldSelector);
