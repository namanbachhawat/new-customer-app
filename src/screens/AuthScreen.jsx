import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { LinearGradient } from 'expo-linear-gradient';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Button } from '../components/Button';
import { GradientButton } from '../components/GradientCard';
import { Input } from '../components/Input';
import api from '../services/api';
import { apiClient } from '../services/apiClient';

const { width } = Dimensions.get('window');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCLJ85pNNUlPNjQr2xOiRQTLS7lzZxfGvY",
  authDomain: "customerapp-6a548.firebaseapp.com",
  projectId: "customerapp-6a548",
  storageBucket: "customerapp-6a548.firebasestorage.app",
  messagingSenderId: "323844165106",
  appId: "1:323844165106:web:2d7dab93b49a9e9318ef6b",
  measurementId: "G-9MEZ2M17ZP"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const AuthScreen = ({ navigation }) => {
  const recaptchaVerifier = useRef(null);
  const [activeTab, setActiveTab] = useState('login');
  const [authStep, setAuthStep] = useState('phone'); // 'phone' or 'otp'
  const [verificationId, setVerificationId] = useState(null);
  const [formData, setFormData] = useState({
    phone: '',
    otp: '',
    email: '',
    name: '',
    acceptTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateLogin = () => {
    const newErrors = {};
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOTP = () => {
    const newErrors = {};
    if (!formData.otp.trim()) {
      newErrors.otp = 'OTP is required';
    } else if (formData.otp.length !== 6 || !/^\d+$/.test(formData.otp)) {
      newErrors.otp = 'Please enter a valid 6-digit OTP';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegister = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (formData.email.trim() && !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Send OTP using Firebase
  const handleSendOTP = async () => {
    if (!validateLogin()) return;

    setLoading(true);
    try {
      const phoneNumber = `+91${formData.phone}`;
      console.log('[AuthScreen] Sending OTP to:', phoneNumber);

      const phoneProvider = new firebase.auth.PhoneAuthProvider();
      const verificationId = await phoneProvider.verifyPhoneNumber(
        phoneNumber,
        recaptchaVerifier.current
      );

      console.log('[AuthScreen] Verification ID received:', verificationId);
      setVerificationId(verificationId);
      setAuthStep('otp');
      setCountdown(60);
      Alert.alert('OTP Sent', `A verification code has been sent to ${phoneNumber}`);
    } catch (error) {
      console.error('[AuthScreen] Error sending OTP:', error);
      Alert.alert('Error', error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP using Firebase
  const handleVerifyOTP = async () => {
    if (!validateOTP()) return;

    setLoading(true);
    try {
      console.log('[AuthScreen] Verifying OTP...');

      const credential = firebase.auth.PhoneAuthProvider.credential(
        verificationId,
        formData.otp
      );

      const userCredential = await firebase.auth().signInWithCredential(credential);
      console.log('[AuthScreen] User signed in:', userCredential.user.uid);

      // Set the customer ID for all API calls
      // TODO: Map Firebase UID to backend UUID via user registration API
      const customerUUID = '123e4567-e89b-12d3-a456-426614174000';
      apiClient.setCustomerId(customerUUID);
      console.log('[AuthScreen] Customer ID set for API calls:', customerUUID);

      navigation.navigate('Home');
    } catch (error) {
      console.error('[AuthScreen] Error verifying OTP:', error);

      if (error.code === 'auth/invalid-verification-code') {
        Alert.alert('Error', 'Invalid OTP code. Please check and try again.');
      } else if (error.code === 'auth/code-expired') {
        Alert.alert('Error', 'OTP has expired. Please request a new one.');
      } else {
        Alert.alert('Error', error.message || 'Failed to verify OTP.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (countdown > 0) return;
    await handleSendOTP();
  };

  // Go back to phone input
  const handleBackToPhone = () => {
    setAuthStep('phone');
    setFormData(prev => ({ ...prev, otp: '' }));
    setVerificationId(null);
    setErrors({});
  };

  const handleRegister = async () => {
    if (!validateRegister()) return;
    await handleSendOTP();
  };

  const handleGuestLogin = () => {
    // Set a development customer ID for guest users
    // In production, this should create a proper guest session or require auth
    const guestId = '123e4567-e89b-12d3-a456-426614174000';
    apiClient.setCustomerId(guestId);
    console.log('[AuthScreen] Guest login - Customer ID set:', guestId);
    navigation.navigate('Home');
  };

  const handleSocialLogin = async (provider) => {
    try {
      const response = await api.socialLogin(provider);
      if (response.success) {
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', 'Social login failed. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to login with social account.');
    }
  };

  // OTP Verification Screen
  const renderOTPVerification = () => (
    <View style={styles.formContainer}>
      <TouchableOpacity style={styles.backLink} onPress={handleBackToPhone}>
        <Text style={styles.backLinkText}>← Change phone number</Text>
      </TouchableOpacity>

      <Text style={styles.otpTitle}>Enter Verification Code</Text>
      <Text style={styles.otpSubtitle}>
        We've sent a 6-digit code to{'\n'}
        <Text style={styles.phoneHighlight}>+91 {formData.phone}</Text>
      </Text>

      <View style={styles.otpInputContainer}>
        <TextInput
          style={styles.otpInput}
          placeholder="Enter 6-digit OTP"
          value={formData.otp}
          onChangeText={(text) => handleInputChange('otp', text.replace(/\D/g, '').slice(0, 6))}
          keyboardType="number-pad"
          maxLength={6}
          placeholderTextColor="#94a3b8"
        />
      </View>
      {errors.otp && <Text style={styles.errorText}>{errors.otp}</Text>}

      <GradientButton
        title={loading ? "Verifying..." : "Verify OTP"}
        onPress={handleVerifyOTP}
        disabled={loading}
        style={styles.primaryButton}
      />

      <View style={styles.resendContainer}>
        {countdown > 0 ? (
          <Text style={styles.countdownText}>Resend OTP in {countdown}s</Text>
        ) : (
          <TouchableOpacity onPress={handleResendOTP} disabled={loading}>
            <Text style={styles.resendText}>Resend OTP</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={['#f0fdf4', '#dcfce7', '#bbf7d0']}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Firebase reCAPTCHA Verifier Modal */}
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
        attemptInvisibleVerification={true}
      />

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Header with Logo Area */}
        <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.header}>
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={['#22c55e', '#16a34a']}
              style={styles.logoGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.logoText}>🥗</Text>
            </LinearGradient>
          </View>
          <Text style={styles.welcomeTitle}>Welcome to Nashtto</Text>
          <Text style={styles.welcomeSubtitle}>
            Pure vegetarian food delivered fresh to your doorstep
          </Text>
        </Animated.View>

        {/* Auth Card */}
        <Animated.View entering={FadeInUp.duration(600).delay(300)} style={styles.authCard}>
          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'login' && styles.activeTab]}
              onPress={() => { setActiveTab('login'); setAuthStep('phone'); setFormData(prev => ({ ...prev, otp: '' })); }}
            >
              <Text style={[styles.tabText, activeTab === 'login' && styles.activeTabText]}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'register' && styles.activeTab]}
              onPress={() => { setActiveTab('register'); setAuthStep('phone'); }}
            >
              <Text style={[styles.tabText, activeTab === 'register' && styles.activeTabText]}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Login Form */}
          {activeTab === 'login' && (
            authStep === 'otp' ? renderOTPVerification() : (
              <View style={styles.formContainer}>
                <Input
                  placeholder="Enter your 10-digit mobile number"
                  value={formData.phone}
                  onChangeText={(text) => handleInputChange('phone', text.replace(/\D/g, '').slice(0, 10))}
                  keyboardType="phone-pad"
                  error={errors.phone}
                  maxLength={10}
                />

                <GradientButton
                  title={loading ? "Sending OTP..." : "Send OTP"}
                  onPress={handleSendOTP}
                  disabled={loading}
                  style={styles.primaryButton}
                />

                <Button
                  title="Continue as Guest"
                  onPress={handleGuestLogin}
                  variant="outline"
                  style={styles.secondaryButton}
                />

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>

                <View style={styles.socialContainer}>
                  <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialLogin('google')}>
                    <Text style={styles.googleIcon}>G</Text>
                    <Text style={styles.socialButtonText}>Google</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialLogin('facebook')}>
                    <Text style={styles.facebookIcon}>f</Text>
                    <Text style={styles.socialButtonText}>Facebook</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            authStep === 'otp' ? renderOTPVerification() : (
              <View style={styles.formContainer}>
                <Input placeholder="Enter your full name" value={formData.name} onChangeText={(text) => handleInputChange('name', text)} error={errors.name} />
                <Input placeholder="Enter your phone number" value={formData.phone} onChangeText={(text) => handleInputChange('phone', text.replace(/\D/g, '').slice(0, 10))} keyboardType="phone-pad" error={errors.phone} maxLength={10} />
                <Input placeholder="Enter your email (optional)" value={formData.email} onChangeText={(text) => handleInputChange('email', text)} keyboardType="email-address" error={errors.email} />

                <TouchableOpacity style={styles.termsContainer} onPress={() => handleInputChange('acceptTerms', !formData.acceptTerms)}>
                  <View style={[styles.checkbox, formData.acceptTerms && styles.checkboxChecked]}>
                    {formData.acceptTerms && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.termsText}>I agree to Nashtto's Terms of Service and Privacy Policy</Text>
                </TouchableOpacity>
                {errors.acceptTerms && <Text style={styles.errorText}>{errors.acceptTerms}</Text>}

                <GradientButton
                  title={loading ? "Sending OTP..." : "Sign Up with OTP"}
                  onPress={handleRegister}
                  disabled={loading}
                  style={styles.primaryButton}
                />

                <View style={styles.loginLink}>
                  <Text style={styles.loginLinkText}>Already have an account? </Text>
                  <TouchableOpacity onPress={() => setActiveTab('login')}>
                    <Text style={styles.loginLinkButton}>Sign in here</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )
          )}
        </Animated.View>

        {/* Additional Info */}
        <Animated.View entering={FadeInUp.duration(600).delay(500)} style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <Text style={styles.infoIcon}>🌿</Text>
            </View>
            <Text style={styles.infoText}>100% Vegetarian</Text>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <Text style={styles.infoIcon}>✨</Text>
            </View>
            <Text style={styles.infoText}>Fresh & Healthy</Text>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <Text style={styles.infoIcon}>🚀</Text>
            </View>
            <Text style={styles.infoText}>Fast Delivery</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    justifyContent: 'center',
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  logoText: {
    fontSize: 40,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
  authCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
  activeTabText: {
    color: '#1e293b',
  },
  formContainer: {
    gap: 16,
  },
  primaryButton: {
    marginTop: 8,
  },
  secondaryButton: {
    borderColor: '#22c55e',
    borderWidth: 2,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
  },
  socialContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 8,
    backgroundColor: '#fafafa',
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4285F4',
  },
  facebookIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1877F2',
  },
  socialButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: -8,
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  loginLinkText: {
    color: '#64748b',
    fontSize: 14,
  },
  loginLinkButton: {
    color: '#22c55e',
    fontWeight: '600',
    fontSize: 14,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 32,
    paddingHorizontal: 8,
  },
  infoItem: {
    alignItems: 'center',
    gap: 8,
  },
  infoIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  infoIcon: {
    fontSize: 24,
  },
  infoText: {
    color: '#1e293b',
    fontSize: 12,
    fontWeight: '600',
  },
  backLink: {
    marginBottom: 16,
  },
  backLinkText: {
    color: '#22c55e',
    fontSize: 14,
    fontWeight: '600',
  },
  otpTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
  },
  otpSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  phoneHighlight: {
    color: '#1e293b',
    fontWeight: '600',
  },
  otpInputContainer: {
    marginBottom: 8,
  },
  otpInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 8,
    color: '#1e293b',
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  countdownText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  resendText: {
    color: '#22c55e',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AuthScreen;