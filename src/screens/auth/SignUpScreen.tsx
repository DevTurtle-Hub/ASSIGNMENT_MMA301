import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';

interface SignUpScreenProps {
  navigation: any;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const { signUp } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getFriendlyErrorMessage = (error: any): string => {
    const code = error?.code || '';
    switch (code) {
      case 'auth/configuration-not-found':
        return 'Email/Password is not enabled in Firebase Console. Please go to Authentication > Sign-in method and enable Email/Password.';
      case 'auth/email-already-in-use':
        return 'This email address is already in use. Please sign in instead.';
      case 'auth/invalid-email':
        return 'Please provide a valid email address.';
      case 'auth/weak-password':
        return 'Password must be at least 6 characters long.';
      case 'auth/network-request-failed':
        return 'Network connection error. Check your internet connectivity.';
      default:
        return error?.message || 'Failed to create account. Please try again.';
    }
  };

  const handleSignUp = async () => {
    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter a password.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setErrorMessage(null);
    setLoading(true);

    try {
      await signUp(name.trim(), email.trim(), password);
    } catch (err: any) {
      console.error('[SignUpScreen] Error:', err);
      setErrorMessage(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled={Platform.OS === 'ios'}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Top Navigation Row: Back button + Brand */}
          <View style={styles.topNavRow}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={styles.backCircleBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={20} color="#0F172A" />
            </TouchableOpacity>
            <View style={styles.brandRow}>
              <View style={styles.logoBadge}>
                <Ionicons name="checkbox" size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.brandName}>
                Task<Text style={styles.brandNameAccent}>Flow</Text>
              </Text>
            </View>
            <View style={{ width: 36 }} />
          </View>

          {/* Heading */}
          <View style={styles.headingBlock}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join TaskFlow to create team workspaces, assign tasks, and chat in real-time.
            </Text>
          </View>

          {/* Error Banner */}
          {Boolean(errorMessage) && (
            <View style={styles.errorBanner}>
              <View style={styles.errorIconWrap}>
                <Ionicons name="alert" size={14} color="#EF4444" />
              </View>
              <Text style={styles.errorBannerText}>{errorMessage}</Text>
            </View>
          )}

          {/* Full Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>FULL NAME</Text>
            <View
              style={[
                styles.inputField,
                nameFocused && styles.inputFieldFocused,
              ]}
            >
              <View style={[styles.fieldIconBox, nameFocused && styles.fieldIconBoxActive]}>
                <Ionicons
                  name="person"
                  size={17}
                  color={nameFocused ? '#FFFFFF' : '#2563EB'}
                />
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Alex Johnson"
                placeholderTextColor="#94A3B8"
                value={name}
                onChangeText={(t) => {
                  setName(t);
                  if (errorMessage) setErrorMessage(null);
                }}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
              />
            </View>
          </View>

          {/* Email Address Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
            <View
              style={[
                styles.inputField,
                emailFocused && styles.inputFieldFocused,
              ]}
            >
              <View style={[styles.fieldIconBox, emailFocused && styles.fieldIconBoxActive]}>
                <Ionicons
                  name="mail"
                  size={17}
                  color={emailFocused ? '#FFFFFF' : '#2563EB'}
                />
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="name@company.com"
                placeholderTextColor="#94A3B8"
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  if (errorMessage) setErrorMessage(null);
                }}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>PASSWORD</Text>
            <View
              style={[
                styles.inputField,
                passwordFocused && styles.inputFieldFocused,
              ]}
            >
              <View style={[styles.fieldIconBox, passwordFocused && styles.fieldIconBoxActive]}>
                <Ionicons
                  name="lock-closed"
                  size={17}
                  color={passwordFocused ? '#FFFFFF' : '#2563EB'}
                />
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="At least 6 characters"
                placeholderTextColor="#94A3B8"
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  if (errorMessage) setErrorMessage(null);
                }}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                style={styles.eyeBtn}
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={19}
                  color={showPassword ? '#2563EB' : '#94A3B8'}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>CONFIRM PASSWORD</Text>
            <View
              style={[
                styles.inputField,
                confirmPasswordFocused && styles.inputFieldFocused,
              ]}
            >
              <View style={[styles.fieldIconBox, confirmPasswordFocused && styles.fieldIconBoxActive]}>
                <Ionicons
                  name="shield-checkmark"
                  size={17}
                  color={confirmPasswordFocused ? '#FFFFFF' : '#2563EB'}
                />
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="Re-enter your password"
                placeholderTextColor="#94A3B8"
                value={confirmPassword}
                onChangeText={(t) => {
                  setConfirmPassword(t);
                  if (errorMessage) setErrorMessage(null);
                }}
                onFocus={() => setConfirmPasswordFocused(true)}
                onBlur={() => setConfirmPasswordFocused(false)}
                secureTextEntry={!showPassword}
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.buttonDisabled]}
            onPress={handleSignUp}
            disabled={loading}
            activeOpacity={0.88}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <View style={styles.btnContentRow}>
                <Text style={styles.primaryButtonText}>Create Account</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>

          {/* Switch to Login */}
          <View style={styles.switchAuthRow}>
            <Text style={styles.switchAuthPrompt}>Already have an account?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.7}
            >
              <Text style={styles.switchAuthAction}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 52 : 36,
    paddingBottom: 36,
  },
  topNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBadge: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  brandNameAccent: {
    color: '#2563EB',
  },
  headingBlock: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 16,
    gap: 10,
  },
  errorIconWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FECDD3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorBannerText: {
    color: '#DC2626',
    fontSize: 12.5,
    fontWeight: '600',
    flex: 1,
    lineHeight: 17,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    height: 52,
  },
  inputFieldFocused: {
    borderColor: '#2563EB',
    backgroundColor: '#FFFFFF',
  },
  fieldIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  fieldIconBoxActive: {
    backgroundColor: '#2563EB',
  },
  textInput: {
    flex: 1,
    fontSize: 14.5,
    color: '#0F172A',
    fontWeight: '500',
    paddingVertical: 0,
  },
  eyeBtn: {
    padding: 6,
    marginLeft: 4,
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    borderRadius: 14,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  btnContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  switchAuthRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  switchAuthPrompt: {
    color: '#64748B',
    fontSize: 13.5,
  },
  switchAuthAction: {
    color: '#2563EB',
    fontSize: 13.5,
    fontWeight: '700',
  },
});
