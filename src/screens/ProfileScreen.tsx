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
import { colors, spacing, borderRadius, typography, shadows } from '../theme';
import { isFirebaseConfigured } from '../services/firebase';

export const ProfileScreen: React.FC = () => {
  const isFirestoreLive = isFirebaseConfigured();

  const appInfoList = [
    { label: 'Course Code', value: 'MMA301' },
    { label: 'Exam', value: 'Practical Exam 1' },
    { label: 'Topic', value: 'React Native, Firebase Setup & CRUD' },
    { label: 'Frontend Stack', value: 'React Native (Expo SDK 57) + TypeScript' },
    { label: 'Database', value: isFirestoreLive ? 'Cloud Firestore (Live)' : 'In-Memory / Demo Store' },
    { label: 'Authentication', value: 'Public / None (Exam 1 Specification)' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card Header */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={40} color={colors.primary} />
          </View>
          <Text style={styles.userName}>Student Developer</Text>
          <Text style={styles.userRole}>Mobile App Developer • MMA301</Text>

          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>React Native Expo</Text>
            </View>
            <View style={[styles.badge, styles.badgeFirebase]}>
              <Text style={[styles.badgeText, styles.badgeFirebaseText]}>Cloud Firestore</Text>
            </View>
          </View>
        </View>

        {/* Project & Exam Technical Details */}
        <Text style={styles.sectionHeader}>Exam Technical Specifications</Text>
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

        {/* Exam 2 Preview Note */}
        <View style={styles.noticeCard}>
          <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
          <View style={styles.noticeContent}>
            <Text style={styles.noticeTitle}>User Authentication in Exam 2</Text>
            <Text style={styles.noticeText}>
              Firebase Authentication (Email/Password, Google Sign-in) and user profile management
              will be integrated in Practical Exam 2.
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
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.lg,
    paddingBottom: 80,
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  userName: {
    ...typography.h2,
    fontSize: 20,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  userRole: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  badge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    ...typography.small,
    color: colors.primaryDark,
    fontWeight: '600',
  },
  badgeFirebase: {
    backgroundColor: '#FEF3C7',
  },
  badgeFirebaseText: {
    color: '#B45309',
  },
  sectionHeader: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
  detailsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
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
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  detailValue: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    fontSize: 13,
  },
  noticeCard: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  noticeContent: {
    flex: 1,
  },
  noticeTitle: {
    ...typography.bodyBold,
    color: colors.primaryDark,
    marginBottom: 2,
  },
  noticeText: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 16,
  },
});
