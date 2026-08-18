import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/useAuthStore';
import { RootStackParamList } from '../navigation/navigationTypes';
import { COLORS } from '../constants/colors';
import Header from '../components/common/Header';
import Button from '../components/common/Button';

// Set this to dynamically control the number of OTP boxes
const OTP_LENGTH = 6;

const VerifyOTPScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'VerifyOTP'>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { mobileNumber } = route.params || { mobileNumber: '9876543210' };
  
  const { verifyOtpCode, requestOtp, isLoading, error, otpExpiresInSeconds, isProfileComplete } = useAuthStore();
  const [otpCode, setOtpCode] = useState('');
  const [timer, setTimer] = useState(otpExpiresInSeconds > 0 ? otpExpiresInSeconds : 300);
  const inputRef = useRef<TextInput | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Auto-verify when 6 digits are entered
  useEffect(() => {
    if (otpCode.length === OTP_LENGTH && !isLoading && !error) {
      executeVerification(otpCode);
    }
  }, [otpCode]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleOtpChange = (text: string) => {
    // Restrict to numeric
    const numericText = text.replace(/[^0-9]/g, '');
    setOtpCode(numericText);
  };

  const executeVerification = async (finalOtp: string) => {
    const success = await verifyOtpCode(mobileNumber, finalOtp);
    if (success) {
      if (useAuthStore.getState().isProfileComplete) {
        navigation.replace('Dashboard', { farmer: useAuthStore.getState().farmer || {}, fields: useAuthStore.getState().fields || [] });
      } else {
        navigation.replace('ProfileSetup', { farmer: useAuthStore.getState().farmer || {} });
      }
    }
  };

  const handleVerify = () => {
    if (otpCode.length === OTP_LENGTH) {
      executeVerification(otpCode);
    }
  };

  const handleResend = async () => {
    if (timer === 0) {
      const success = await requestOtp(mobileNumber);
      if (success) {
        setTimer(useAuthStore.getState().otpExpiresInSeconds || 300);
        setOtpCode('');
      }
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
          <Text style={styles.title}>We just sent an SMS</Text>
          <Text style={styles.subtitle}>
            Enter the security code we sent to{'\n'}+91 {mobileNumber}
          </Text>
        </View>

        <View style={styles.otpContainer}>
          <TextInput
            ref={inputRef}
            value={otpCode}
            onChangeText={handleOtpChange}
            maxLength={OTP_LENGTH}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoComplete="sms-otp"
            style={styles.hiddenInput}
            autoFocus
          />
          <Pressable style={styles.boxesContainer} onPress={() => inputRef.current?.focus()}>
            {Array(OTP_LENGTH).fill(0).map((_, index) => {
              const isActive = otpCode.length === index;
              const isFilled = otpCode.length > index;
              return (
                <View
                  key={index}
                  style={[
                    styles.otpBox,
                    isActive ? styles.otpBoxActive : null,
                    isFilled ? styles.otpBoxFilled : null
                  ]}
                >
                  <Text style={styles.otpText}>{otpCode[index] || ''}</Text>
                </View>
              );
            })}
          </Pressable>
        </View>

        <View style={styles.buttonContainer}>
          {error && <Text style={styles.errorText}>{error}</Text>}
          <Button 
            title={isLoading ? "Verifying..." : "Verify"} 
            onPress={handleVerify} 
            style={styles.button}
          />
        </View>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Didn't receive code?</Text>
          <Text style={[styles.resendText, timer > 0 && styles.resendDisabled]} onPress={handleResend}>
            Resend {timer > 0 && <Text style={styles.timerText}>{formatTime(timer)}</Text>}
          </Text>
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
    alignItems: 'center', // Center everything in this layout
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 22,
  },
  otpContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
  boxesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    gap: 8, // Spacing between boxes
  },
  otpBox: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  otpBoxFilled: {
    borderColor: COLORS.primary,
    backgroundColor: '#F0F9F3', // Light green hint on fill
  },
  otpBoxActive: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  otpText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: '#0A3B1F', 
  },
  footerContainer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 5,
  },
  resendText: {
    fontSize: 13,
    color: COLORS.textDark,
    fontWeight: '500',
  },
  resendDisabled: {
    opacity: 0.5,
  },
  timerText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default VerifyOTPScreen;
