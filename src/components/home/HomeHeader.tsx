import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Bell } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';
import { useAuthStore } from '../../store/useAuthStore';

const HomeHeader = () => {
  const { farmer } = useAuthStore();
  const name = farmer?.farmer_name || 'Murali';

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <Image 
          source={{ uri: 'https://i.pravatar.cc/100' }} 
          style={styles.avatar} 
        />
        <View style={styles.textContainer}>
          <Text style={styles.greeting}>Namasthe</Text>
          <Text style={styles.name}>{name}</Text>
        </View>
      </View>
      <View style={styles.iconContainer}>
        <Bell color={COLORS.primary} size={24} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  textContainer: {
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  iconContainer: {
    padding: 8,
  }
});

export default React.memo(HomeHeader);
