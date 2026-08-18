import React from 'react';
import { View, StyleSheet, Animated, useWindowDimensions } from 'react-native';
import { COLORS } from '../../constants/colors';
import { PaginatorProps } from '../../models/componentInterfaces';

const Paginator: React.FC<PaginatorProps> = ({ data, scrollX, hideFirst }) => {
  const { width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      {data.map((_, i) => {
        if (hideFirst && i === 0) return null; // Skip rendering the first dot

        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 24, 10], // significantly wider active dot
          extrapolate: 'clamp',
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.4, 1, 0.4], // all dots are green, inactive are semi-transparent
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={i.toString()}
            style={[
              styles.dot,
              { width: dotWidth, opacity, backgroundColor: COLORS.primary },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
});

export default Paginator;

