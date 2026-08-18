import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants/colors';
import { HeaderProps } from '../../models/componentInterfaces';

const Header: React.FC<HeaderProps> = ({ title, onBackPress, style }) => {
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <Text style={styles.backIcon}>{'<'}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.placeholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
  },
  backButton: {
    padding: 5,
  },
  backIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  placeholder: {
    width: 24, // To balance the back button and keep title centered
  },
});

export default Header;
