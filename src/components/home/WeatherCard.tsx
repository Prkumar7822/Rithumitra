import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Sun } from 'lucide-react-native';
import { useHomeStore } from '../../store/useHomeStore';

const WeatherCard = () => {
  const { weather } = useHomeStore();

  return (
    <View style={styles.container}>
      <View style={styles.leftInfo}>
        <Sun color="#FBC02D" size={28} style={styles.icon} />
        <View>
          <Text style={styles.condition}>{weather.condition}</Text>
          <Text style={styles.humidity}>Humidity: {weather.humidity}%</Text>
        </View>
      </View>
      <Text style={styles.temp}>{weather.temp}°C</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#7A5B00',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  leftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  condition: {
    color: '#FFD54F',
    fontSize: 14,
    fontWeight: 'bold',
  },
  humidity: {
    color: '#FFD54F',
    fontSize: 12,
  },
  temp: {
    color: '#FFD54F',
    fontSize: 24,
    fontWeight: 'bold',
  }
});

export default React.memo(WeatherCard);
