import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { ScreenWrapperProps } from '../../models/componentInterfaces';
import TopLeaf from '../../images/Top_leaf.svg';
import BottomLeaf from '../../images/Bottom_leaf.svg';

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children, style }) => {
  const { width } = useWindowDimensions();
  const leafSize = width * 0.45; // 45% of screen width

  return (
    <View style={[styles.container, style]}>
      {/* Top Left Leaf Decoration */}
      <View style={styles.topLeftLeafContainer}>
        <TopLeaf width={leafSize} height={leafSize} />
      </View>
      
      {/* Main Content */}
      <View style={styles.content}>
        {children}
      </View>

      {/* Bottom Right Leaf Decoration */}
      <View style={styles.bottomRightLeafContainer}>
        <BottomLeaf width={leafSize} height={leafSize} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
  topLeftLeafContainer: {
    position: 'absolute',
    top: -20,
    left: -20,
    zIndex: 0,
    transform: [{ scaleY: -1 }], // Flipping only vertically makes it point downwards and inwards
  },
  bottomRightLeafContainer: {
    position: 'absolute',
    bottom: -20,
    right: -20,
    zIndex: 0,
  },
});

export default ScreenWrapper;
