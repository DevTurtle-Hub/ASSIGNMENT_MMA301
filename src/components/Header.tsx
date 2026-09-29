import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';
import { TaskStats } from '../types/task';

interface HeaderProps {
  stats: TaskStats;
  isLiveFirestore: boolean;
}

export const Header: React.FC<HeaderProps> = ({ stats, isLiveFirestore }) => {
  return (
    <View style={styles.container}>
      {/* Top Bar with Title & Status Badge */}
      <View style={styles.topRow}>
        <View style={styles.titleContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="checkmark-done" size={22} color={colors.surface} />
          </View>
          <View>
            <Text style={styles.appTitle}>TaskFlow</Text>
            <Text style={styles.appSubtitle}>Cloud Firestore Task Management</Text>
          </View>
        </View>

        {/* Cloud Connection Badge */}
        <View
          style={[
            styles.badge,
            isLiveFirestore ? styles.badgeLive : styles.badgeDemo,
          ]}
        >
          <View
            style={[
              styles.badgeDot,
              { backgroundColor: isLiveFirestore ? '#22C55E' : '#F59E0B' },
            ]}
          />
          <Text
            style={[
              styles.badgeText,
              { color: isLiveFirestore ? '#15803D' : '#B45309' },
            ]}
          >
            {isLiveFirestore ? 'Firestore Live' : 'Demo Mode'}
          </Text>
        </View>
      </View>

      {/* Intro Description */}
      <Text style={styles.description}>
        Manage and track your project tasks with real-time Firebase Firestore synchronization.
      </Text>

      {/* Quick Statistics Row */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, styles.statCardTotal]}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>

        <View style={[styles.statCard, styles.statCardTodo]}>
          <Text style={[styles.statNumber, { color: colors.statusTodoText }]}>
            {stats.todo}
          </Text>
          <Text style={styles.statLabel}>To Do</Text>
        </View>

        <View style={[styles.statCard, styles.statCardInProgress]}>
          <Text style={[styles.statNumber, { color: colors.statusInProgressText }]}>
            {stats.inProgress}
          </Text>
          <Text style={styles.statLabel}>In Progress</Text>
        </View>

        <View style={[styles.statCard, styles.statCardDone]}>
          <Text style={[styles.statNumber, { color: colors.statusDoneText }]}>
            {stats.done}
          </Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingTop: Platform.OS === 'ios' ? spacing.sm : spacing.md,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadows.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  appTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  appSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    gap: 6,
  },
  badgeLive: {
    backgroundColor: '#DCFCE7',
    borderColor: '#BBF7D0',
  },
  badgeDemo: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  badgeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  badgeText: {
    ...typography.small,
    fontWeight: '600',
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statCardTotal: {
    backgroundColor: colors.primaryLight,
    borderColor: '#C7D2FE',
  },
  statCardTodo: {
    backgroundColor: colors.statusTodoBg,
    borderColor: colors.statusTodoBorder,
  },
  statCardInProgress: {
    backgroundColor: colors.statusInProgressBg,
    borderColor: colors.statusInProgressBorder,
  },
  statCardDone: {
    backgroundColor: colors.statusDoneBg,
    borderColor: colors.statusDoneBorder,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  statLabel: {
    ...typography.small,
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
