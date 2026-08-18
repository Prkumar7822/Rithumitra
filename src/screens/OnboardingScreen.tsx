import React, { useState, useRef } from 'react';
import { View, StyleSheet, FlatList, Animated, useWindowDimensions } from 'react-native';
import ScreenWrapper from '../components/common/ScreenWrapper';
import OnboardingSlide from '../components/onboarding/OnboardingSlide';
import Paginator from '../components/common/Paginator';
import Button from '../components/common/Button';
import { onboardingData } from '../constants/onboardingData';
import { useAppStore } from '../store/useAppStore';

const OnboardingScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);
  const { completeOnboarding } = useAppStore();
  const { width } = useWindowDimensions();

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollToNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      completeOnboarding();
    }
  };

  const isSplash = currentIndex === 0;

  const isLastSlide = currentIndex === onboardingData.length - 1;

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <FlatList
          data={onboardingData}
          renderItem={({ item }) => <OnboardingSlide item={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={width}
          snapToAlignment="center"
          decelerationRate="fast"
          bounces={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: false,
          })}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
          initialNumToRender={onboardingData.length}
          maxToRenderPerBatch={onboardingData.length}
          windowSize={10}
        />

        <View style={[styles.bottomContainer, isLastSlide ? styles.bottomContainerSplit : styles.bottomContainerCenter]}>
          <View style={styles.paginatorContainer}>
            <Paginator data={onboardingData} scrollX={scrollX} />
          </View>
          
          {isLastSlide && (
            <View style={styles.buttonContainer}>
              <Button title="Get Started" onPress={scrollToNext} />
            </View>
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 120, // Moved up to bring dots closer to text
    width: '100%',
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomContainerSplit: {
    justifyContent: 'space-between',
  },
  bottomContainerCenter: {
    justifyContent: 'center',
  },
  paginatorContainer: {
    // Flex is removed so it can center naturally when alone
  },
  buttonContainer: {
    // Flex is removed to size to content
  },
});

export default OnboardingScreen;

