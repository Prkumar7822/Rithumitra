import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { OnboardingItem } from '../../models/types';
import { COLORS } from '../../constants/colors';

interface Props {
  item: OnboardingItem;
}

const OnboardingSlide: React.FC<Props> = ({ item }) => {
  const { width, height } = useWindowDimensions();

  // The first slide (logo only) doesn't have a description, so we can adjust styling
  const isSplash = item.id === '1';

  const SvgImage = item.image;

  // Dynamic sizing based on screen dimensions
  // Ensure the logo on the first screen isn't cut off by providing enough width and height
  const imageWidth = isSplash ? width * 0.7 : width * 0.85;
  const imageHeight = height * 0.45; // Take up explicit height rather than flex stretching

  return (
    <View style={[styles.container, { width }]}>
      <View style={[styles.imageContainer, { height: imageHeight, width: width }]}>
        <SvgImage width={imageWidth} height="100%" />
      </View>
      
      {!isSplash && (
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: '25%', // Push it down slightly from top
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 10, // Small gap between image and text
  },
  title: {
    fontWeight: '800',
    fontSize: 22,
    marginBottom: 15,
    color: COLORS.textDark,
    textAlign: 'center',
  },
  description: {
    fontWeight: '400',
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default OnboardingSlide;
