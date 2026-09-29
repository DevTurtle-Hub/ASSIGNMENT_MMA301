import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../theme';
import { TaskStats } from '../types/task';

interface HeaderProps {
  stats: TaskStats;
  isLiveFirestore: boolean;
}

export const Header: React.FC<HeaderProps> = ({ stats, isLiveFirestore }) => {
  return (
    <View style={styles.container}>
      {/* Top Navbar */}
      <View style={styles.navBar}>
        {/* Logo: TF Task Flow */}
        <View style={styles.brandRow}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>TF</Text>
          </View>
          <Text style={styles.brandTask}>
            Task <Text style={styles.brandFlow}>Flow</Text>
          </Text>
        </View>

        {/* Top Right Badges / Links */}
        <View style={styles.navPills}>
          <View style={styles.homePill}>
            <Text style={styles.homePillText}>Home</Text>
          </View>
          <View
            style={[
              styles.cloudPill,
              isLiveFirestore ? styles.cloudPillLive : styles.cloudPillDemo,
            ]}
          >
            <View
              style={[
                styles.cloudDot,
                { backgroundColor: isLiveFirestore ? '#10B981' : '#F59E0B' },
              ]}
            />
            <Text
              style={[
                styles.cloudPillText,
                { color: isLiveFirestore ? '#047857' : '#B45309' },
              ]}
            >
              {isLiveFirestore ? 'Firestore Live' : 'Demo Mode'}
            </Text>
          </View>
        </View>
      </View>

      {/* Hero Banner Section */}
      <View style={styles.heroSection}>
        {/* Pill Tag */}
        <View style={styles.tagPill}>
          <View style={styles.tagDot} />
          <Text style={styles.tagText}>Technical Foundation • Practical Exam 1</Text>
        </View>

        {/* Big Heading: Task & Team Management */}
        <Text style={styles.heroHeadline}>
          Task & Team{' '}
          <Text style={styles.headlineHighlight}>Management</Text>
        </Text>

        {/* Subtitle */}
        <Text style={styles.heroSubtitle}>
          Orchestrate workflows with ease. Powered by Expo React Native, TypeScript, and Firebase Cloud Firestore.
        </Text>
      </View>

      {/* 3 Stats Cards Row (Exactly matching reference UI) */}
      <View style={styles.statsContainer}>
        {/* TO DO Card */}
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>TO DO</Text>
          <Text style={[styles.statCount, { color: colors.statTodo }]}>{stats.todo}</Text>
        </View>

        {/* IN PROGRESS Card */}
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>IN PROGRESS</Text>
          <Text style={[styles.statCount, { color: colors.statInProgress }]}>
            {stats.inProgress}
          </Text>
        </View>

        {/* COMPLETED Card */}
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>COMPLETED</Text>
          <Text style={[styles.statCount, { color: colors.statCompleted }]}>{stats.done}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.lg,
    paddingTop: Platform.OS === 'ios' ? spacing.sm : spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoBox: {
    width: 34,
    height: 34,
    borderRadius: borderRadius.sm + 2,
    borderWidth: 1.5,
    borderColor: '#6366F1',
    backgroundColor: '#F5F3FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4F46E5',
    letterSpacing: -0.5,
  },
  brandTask: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  brandFlow: {
    color: '#06B6D4',
  },
  navPills: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  homePill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: borderRadius.md,
    backgroundColor: '#EEF2FF',
  },
  homePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
  },
  cloudPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    gap: 5,
  },
  cloudPillLive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  cloudPillDemo: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  cloudDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  cloudPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  heroSection: {
    marginBottom: spacing.md,
  },
  tagPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    marginBottom: spacing.xs + 2,
    gap: 6,
  },
  tagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#06B6D4',
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4F46E5',
  },
  heroHeadline: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  headlineHighlight: {
    color: '#4F46E5',
  },
  heroSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: 4,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  statTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  statCount: {
    fontSize: 22,
    fontWeight: '800',
  },
});
