import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { COLORS } from '../constants/colors';
import Button from '../components/common/Button';

const languages = [
  { id: 'en', title: 'English', subtitle: 'English', iconText: 'A' },
  { id: 'hi', title: 'हिंदी', subtitle: 'Hindi', iconText: 'अ' },
  { id: 'te', title: 'తెలుగు', subtitle: 'Telugu', iconText: 'అ' },
];

const LanguageSelectionScreen = () => {
  const { language, setLanguage, completeLanguageSelection } = useAppStore();

  const handleNext = () => {
    completeLanguageSelection();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select your preferred language</Text>
        <Text style={styles.subtitle}>
          Choose your language to continue{'\n'}and get easy farming guidance
        </Text>
      </View>

      <View style={styles.cardsContainer}>
        {languages.map((lang) => {
          const isSelected = language === lang.id;
          return (
            <TouchableOpacity
              key={lang.id}
              activeOpacity={0.8}
              onPress={() => setLanguage(lang.id)}
              style={[
                styles.card,
                isSelected ? styles.cardSelected : styles.cardUnselected,
              ]}
            >
              <View style={[styles.iconCircle, isSelected ? styles.iconCircleSelected : styles.iconCircleUnselected]}>
                <Text style={styles.iconText}>{lang.iconText}</Text>
              </View>
              
              <View style={styles.textContainer}>
                <Text style={[styles.langTitle, { color: COLORS.textDark }]}>{lang.title}</Text>
                <Text style={styles.langSubtitle}>{lang.subtitle}</Text>
              </View>

              {isSelected && (
                <View style={styles.checkCircle}>
                  <Text style={styles.checkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.bottomContainer}>
        <Button 
          title="Next →" 
          onPress={handleNext} 
          style={styles.nextButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textDark,
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 22,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 15,
  },
  cardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#F0F9F3', // Very light green
  },
  cardUnselected: {
    borderColor: '#E0E0E0',
    backgroundColor: COLORS.white,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  iconCircleSelected: {
    backgroundColor: COLORS.primary,
  },
  iconCircleUnselected: {
    backgroundColor: '#7A7A7A', // Grey
  },
  iconText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  textContainer: {
    flex: 1,
  },
  langTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  langSubtitle: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  nextButton: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 8,
    backgroundColor: '#0A3B1F', // Darker green as per Figma screenshot
  },
});

export default LanguageSelectionScreen;
