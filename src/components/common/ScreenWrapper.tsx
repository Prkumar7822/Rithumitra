import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { ScreenWrapperProps } from '../../models/componentInterfaces';

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children, style }) => {
  return (
    <View style={[styles.container, style]}>
      {/* Top Left Leaf Decoration */}
      <Image 
        source={require('../../images/c414a4292fe2f48e4b73873bd52019ea967f9ec5.png')} 
        style={styles.topLeftLeaf} 
      />
      
      {/* Main Content */}
      <View style={styles.content}>
        {children}
      </View>

      {/* Bottom Right Leaf Decoration */}
      <Image 
        source={require('../../images/448f768d684768b901c18815cb7abd1d33570e3b.png')} 
        style={styles.bottomRightLeaf} 
      />
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
  topLeftLeaf: {
    position: 'absolute',
    top: -20,
    left: -20,
    width: 180,
    height: 180,
    resizeMode: 'contain',
    transform: [{ scaleY: -1 }], // Flipping only vertically makes it point downwards and inwards
    zIndex: 0,
  },
  bottomRightLeaf: {
    position: 'absolute',
    bottom: -20,
    right: -20,
    width: 180,
    height: 180,
    resizeMode: 'contain',
    zIndex: 0,
  },
});

export default ScreenWrapper;



