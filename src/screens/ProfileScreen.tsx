import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { colors, spacing, borderRadius, shadows } from '../theme';
import { isFirebaseConfigured } from '../services/firebase';

export const ProfileScreen: React.FC = () => {
  const { user, firebaseUser, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const isFirestoreLive = isFirebaseConfigured();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      setConfirmModalVisible(false);
    } catch (err: any) {
      Alert.alert('Logout Error', err.message || 'Failed to sign out.');
    } finally {
      setLoggingOut(false);
    }
  };

  const displayName = user?.name || firebaseUser?.displayName || 'Student User';
  const displayEmail = user?.email || firebaseUser?.email || 'user@example.com';
  const initial = displayName.charAt(0).toUpperCase();

  const accountInfo = [
    { label: 'Full Name', value: displayName },
    { label: 'Email', value: displayEmail },
    { label: 'User ID (UID)', value: user?.id ? `${user.id.substring(0, 14)}...` : 'N/A' },
    {
      label: 'Member Since',
      value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Today',
    },
    { label: 'Auth Provider', value: 'Firebase Email/Password' },
    { label: 'Database', value: isFirestoreLive ? 'Cloud Firestore (Live)' : 'Demo Mode' },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card Header */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <Text style={styles.userName}>{displayName}</Text>
          <Text style={styles.userEmail}>{displayEmail}</Text>

          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Ionicons name="shield-checkmark" size={12} color={colors.primary} />
              <Text style={styles.badgeText}>Authenticated</Text>
            </View>
            <View style={[styles.badge, styles.badgeFirebase]}>
              <Ionicons name="flame" size={12} color="#0284C7" />
              <Text style={[styles.badgeText, styles.badgeFirebaseText]}>Firebase Auth</Text>
            </View>
          </View>
        </View>

        {/* Account Details Card */}
        <Text style={styles.sectionHeader}>Account Information</Text>
        <View style={styles.detailsCard}>
          {accountInfo.map((item, idx) => (
            <View
              key={idx}
              style={[
                styles.detailRow,
                idx !== accountInfo.length - 1 && styles.detailRowBorder,
              ]}
            >
              <Text style={styles.detailLabel}>{item.label}</Text>
              <Text style={styles.detailValue} numberOfLines={1}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>

        {/* Academic Course Specs */}
        <Text style={styles.sectionHeader}>Academic Course Details</Text>
        <View style={styles.detailsCard}>
          <View style={[styles.detailRow, styles.detailRowBorder]}>
            <Text style={styles.detailLabel}>Course</Text>
            <Text style={styles.detailValue}>MMA301 - Mobile Programming</Text>
          </View>
          <View style={[styles.detailRow, styles.detailRowBorder]}>
            <Text style={styles.detailLabel}>Assessment</Text>
            <Text style={styles.detailValue}>Practical Exam 2</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Stack</Text>
            <Text style={styles.detailValue}>React Native • Expo SDK 57 • Firebase</Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => setConfirmModalVisible(true)}
          activeOpacity={0.85}
        >
          <Ionicons name="log-out-outline" size={18} color={colors.danger} />
          <Text style={styles.logoutBtnText}>Log Out of TaskFlow</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={confirmModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconBox}>
              <Ionicons name="log-out" size={28} color={colors.danger} />
            </View>
            <Text style={styles.modalTitle}>Confirm Logout</Text>
            <Text style={styles.modalDesc}>
              Are you sure you want to sign out? You will need to enter your email and password to access your teams again.
            </Text>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setConfirmModalVisible(false)}
                disabled={loggingOut}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalConfirmBtn, loggingOut && styles.btnDisabled]}
                onPress={handleLogout}
                disabled={loggingOut}
              >
                {loggingOut ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalConfirmText}>Log Out</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    padding: spacing.lg,
    paddingBottom: 90,
    backgroundColor: colors.background,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  badgeText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 11,
  },
  badgeFirebase: {
    backgroundColor: '#E0F2FE',
    borderColor: '#BAE6FD',
  },
  badgeFirebaseText: {
    color: '#0284C7',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.xs + 2,
    marginTop: spacing.xs,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: spacing.lg,
  },
  detailRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    maxWidth: '60%',
    textAlign: 'right',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderRadius: borderRadius.md,
    paddingVertical: 12,
    marginTop: spacing.xs,
  },
  logoutBtnText: {
    color: colors.dangerDark,
    fontSize: 13,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    width: '100%',
    alignItems: 'center',
    ...shadows.lg,
  },
  modalIconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  modalDesc: {
    fontSize: 12.5,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing.xl,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: borderRadius.sm,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  modalConfirmBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.danger,
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  btnDisabled: {
    opacity: 0.6,
  },
});
