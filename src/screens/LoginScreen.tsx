import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { useAuthStore } from '../store/useAuthStore';
import { COLORS } from '../constants/colors';
import Header from '../components/common/Header';
import Button from '../components/common/Button';

const LoginScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [mobileNumber, setMobileNumber] = useState('');
  const { requestOtp, isLoading, error } = useAuthStore();
  
  const isButtonDisabled = mobileNumber.length !== 10 || isLoading;

  const handleGetOTP = async () => {
    if (mobileNumber.length !== 10) return;
    const success = await requestOtp(mobileNumber);
    if (success) {
      navigation.navigate('VerifyOTP', { mobileNumber });
    }
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
            onChangeText={(text) => {
              // Ensure only numbers are entered
              const numericValue = text.replace(/[^0-9]/g, '');
              setMobileNumber(numericValue);
            }}
          />
        </View>

        <View style={styles.buttonContainer}>
          {error && <Text style={styles.errorText}>{error}</Text>}
          <Button 
            title={isLoading ? "Loading..." : "Get OTP"} 
            onPress={handleGetOTP} 
            style={styles.button}
            disabled={isButtonDisabled}
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
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: '#0A3B1F', 
  },
});

export default LoginScreen;

