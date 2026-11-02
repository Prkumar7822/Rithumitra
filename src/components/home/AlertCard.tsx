import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AlertTriangle, X } from 'lucide-react-native';

const AlertCard = () => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <AlertTriangle color="#D32F2F" size={20} />
      </View>
      <Text style={styles.text}>
        High Priority Alert: Apply irrigation today for Field 1 to prevent crop stress.
      </Text>
      <TouchableOpacity style={styles.closeBtn}>
        <X color="#D32F2F" size={16} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFEAEA',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#D32F2F',
  },
  iconContainer: {
    marginRight: 10,
  },
  text: {
    flex: 1,
    color: '#D32F2F',
    fontSize: 12,
    fontWeight: '500',
  },
  closeBtn: {
    padding: 4,
  }
});

export default React.memo(AlertCard);
