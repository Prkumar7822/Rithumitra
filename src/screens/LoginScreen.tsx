import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { COLORS } from '../constants/colors';
import Header from '../components/common/Header';
import Button from '../components/common/Button';

const LoginScreen = () => {
  const [mobileNumber, setMobileNumber] = useState('');

  const handleGetOTP = () => {
    // We will implement API logic here later
    console.log('Get OTP for:', mobileNumber);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header title="Verify your Mobile Number" />
      
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.textContainer}>
          <Text style={styles.title}>We will send an SMS to verify{'\n'}your mobile number.</Text>
          <Text style={styles.subtitle}>
            Input your phone number you'd like to{'\n'}add to your account
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your 10 digit mobile number"
            placeholderTextColor="#A0A0A0"
            keyboardType="numeric"
            maxLength={10}
            value={mobileNumber}
            onChangeText={setMobileNumber}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button 
            title="Get OTP" 
            onPress={handleGetOTP} 
            style={styles.button}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textDark,
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 30,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    color: COLORS.textDark,
    backgroundColor: COLORS.white,
  },
  buttonContainer: {
    marginTop: 'auto',
    marginBottom: 40,
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: '#0A3B1F', // Using the dark green from the Language screen
  },
});

export default LoginScreen;
