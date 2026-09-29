import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '../theme';
import { isFirebaseConfigured } from '../services/firebase';

export const ProfileScreen: React.FC = () => {
  const isFirestoreLive = isFirebaseConfigured();

  const appInfoList = [
    { label: 'Course Code', value: 'MMA301' },
    { label: 'Exam', value: 'Practical Exam 1' },
    { label: 'Framework', value: 'React Native (Expo SDK 57)' },
    { label: 'Language', value: 'TypeScript' },
    { label: 'Database', value: isFirestoreLive ? 'Cloud Firestore (Live)' : 'Demo Mode' },
    { label: 'Auth Status', value: 'Public (No Auth required)' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card Header */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={36} color="#FFFFFF" />
          </View>
          <Text style={styles.userName}>Student Developer</Text>
          <Text style={styles.userRole}>Mobile Multi-Platform • MMA301</Text>

          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Expo TypeScript</Text>
            </View>
            <View style={[styles.badge, styles.badgeFirebase]}>
              <Text style={[styles.badgeText, styles.badgeFirebaseText]}>Cloud Firestore</Text>
            </View>
          </View>
        </View>

        {/* Technical Specs Card */}
        <Text style={styles.sectionHeader}>System Specifications</Text>
        <View style={styles.detailsCard}>
          {appInfoList.map((item, idx) => (
            <View
              key={idx}
              style={[
                styles.detailRow,
                idx !== appInfoList.length - 1 && styles.detailRowBorder,
              ]}
            >
              <Text style={styles.detailLabel}>{item.label}</Text>
              <Text style={styles.detailValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Exam 2 Notice */}
        <View style={styles.noticeCard}>
          <Ionicons name="shield-checkmark-outline" size={20} color="#2563EB" />
          <View style={styles.noticeContent}>
            <Text style={styles.noticeTitle}>Authentication in Practical Exam 2</Text>
            <Text style={styles.noticeText}>
              Firebase Authentication (Email/Password, Google Login) and profile syncing will be
              fully integrated in the next exam.
            </Text>
          </View>
        </View>
      </ScrollView>
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
    paddingBottom: 80,
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
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  userRole: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  badge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  badgeText: {
    color: '#2563EB',
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
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
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
    paddingVertical: 12,
    paddingHorizontal: spacing.lg,
  },
  detailRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceSubtle,
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
  },
  noticeCard: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  noticeContent: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
    marginBottom: 2,
  },
  noticeText: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
  },
});
