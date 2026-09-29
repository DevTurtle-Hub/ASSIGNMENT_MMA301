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
      {/* Top Banner Row */}
      <View style={styles.topRow}>
        <View style={styles.branding}>
          <View style={styles.logoBadge}>
            <Ionicons name="sparkles" size={18} color="#FFFFFF" />
          </View>
          <View>
            <View style={styles.brandTitleRow}>
              <Text style={styles.brandName}>TaskFlow</Text>
              <View style={styles.proPill}>
                <Text style={styles.proPillText}>EXPO</Text>
              </View>
            </View>
            <Text style={styles.brandSubtitle}>Cloud Task Workspace</Text>
          </View>
        </View>

        {/* Real-time Connection Status Badge */}
        <View
          style={[
            styles.statusBadge,
            isLiveFirestore ? styles.statusBadgeLive : styles.statusBadgeDemo,
          ]}
        >
          <View
            style={[
              styles.statusDot,
              { backgroundColor: isLiveFirestore ? '#10B981' : '#F59E0B' },
            ]}
          />
          <Text
            style={[
              styles.statusBadgeText,
              { color: isLiveFirestore ? '#047857' : '#B45309' },
            ]}
          >
            {isLiveFirestore ? 'Live Cloud' : 'Local Demo'}
          </Text>
        </View>
      </View>

      {/* Modern Dashboard Stats Grid */}
      <View style={styles.statsGrid}>
        {/* Total Tasks */}
        <View style={[styles.statCard, styles.statCardTotal]}>
          <View style={styles.statHeader}>
            <Text style={styles.statLabel}>Total Tasks</Text>
            <Ionicons name="layers-outline" size={14} color={colors.primary} />
          </View>
          <Text style={[styles.statNumber, { color: colors.primary }]}>{stats.total}</Text>
        </View>

        {/* To Do */}
        <View style={[styles.statCard, styles.statCardTodo]}>
          <View style={styles.statHeader}>
            <Text style={styles.statLabel}>To Do</Text>
            <Ionicons name="time-outline" size={14} color={colors.statusTodoText} />
          </View>
          <Text style={[styles.statNumber, { color: colors.statusTodoText }]}>{stats.todo}</Text>
        </View>

        {/* In Progress */}
        <View style={[styles.statCard, styles.statCardInProgress]}>
          <View style={styles.statHeader}>
            <Text style={styles.statLabel}>In Progress</Text>
            <Ionicons name="flash-outline" size={14} color={colors.textPurple} />
          </View>
          <Text style={[styles.statNumber, { color: colors.textPurple }]}>{stats.inProgress}</Text>
        </View>

        {/* Completed */}
        <View style={[styles.statCard, styles.statCardDone]}>
          <View style={styles.statHeader}>
            <Text style={styles.statLabel}>Done</Text>
            <Ionicons name="checkmark-done-outline" size={14} color={colors.statusDoneText} />
          </View>
          <Text style={[styles.statNumber, { color: colors.statusDoneText }]}>{stats.done}</Text>
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
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadows.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  branding: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  logoBadge: {
    width: 42,
    height: 42,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandName: {
    ...typography.h2,
    fontSize: 20,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  proPill: {
    backgroundColor: colors.secondaryLight,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.secondaryBorder,
  },
  proPillText: {
    ...typography.small,
    fontSize: 10,
    fontWeight: '700',
    color: colors.secondaryDark,
  },
  brandSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    gap: 5,
  },
  statusBadgeLive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  statusBadgeDemo: {
    backgroundColor: colors.accentAmberLight,
    borderColor: colors.accentAmberBorder,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  statusBadgeText: {
    ...typography.small,
    fontWeight: '700',
    fontSize: 11,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  statCardTotal: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primaryBorder,
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
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  statLabel: {
    ...typography.small,
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
