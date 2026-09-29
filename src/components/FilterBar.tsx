import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../theme';
import { TaskFilterStatus, TaskFilterPriority, TaskStats } from '../types/task';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: TaskFilterStatus;
  onStatusChange: (status: TaskFilterStatus) => void;
  priorityFilter: TaskFilterPriority;
  onPriorityChange: (priority: TaskFilterPriority) => void;
  stats: TaskStats;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  stats,
}) => {
  const statusOptions: { label: string; value: TaskFilterStatus; count: number }[] = [
    { label: 'All', value: 'all', count: stats.total },
    { label: 'To Do', value: 'todo', count: stats.todo },
    { label: 'In Progress', value: 'in_progress', count: stats.inProgress },
    { label: 'Done', value: 'done', count: stats.done },
  ];

  const priorityOptions: { label: string; value: TaskFilterPriority; color: string }[] = [
    { label: 'All Priorities', value: 'all', color: colors.textSecondary },
    { label: 'High', value: 'high', color: colors.priorityHigh },
    { label: 'Medium', value: 'medium', color: colors.priorityMedium },
    { label: 'Low', value: 'low', color: colors.priorityLow },
  ];

  return (
    <View style={styles.container}>
      {/* Search Input Bar */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={17} color={colors.primary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search tasks..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={onSearchChange}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {Boolean(searchQuery) && (
          <TouchableOpacity
            onPress={() => onSearchChange('')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.clearBtn}
          >
            <Ionicons name="close-circle" size={17} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Status Segmented Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statusRow}
      >
        {statusOptions.map((item) => {
          const isSelected = statusFilter === item.value;
          return (
            <TouchableOpacity
              key={item.value}
              onPress={() => onStatusChange(item.value)}
              style={[
                styles.statusTab,
                isSelected ? styles.statusTabActive : styles.statusTabInactive,
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.statusTabText,
                  isSelected ? styles.statusTabTextActive : styles.statusTabTextInactive,
                ]}
              >
                {item.label}
              </Text>
              <View
                style={[
                  styles.badgeCount,
                  isSelected ? styles.badgeCountActive : styles.badgeCountInactive,
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    isSelected ? styles.badgeTextActive : styles.badgeTextInactive,
                  ]}
                >
                  {item.count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Priority Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.priorityRow}
      >
        {priorityOptions.map((item) => {
          const isSelected = priorityFilter === item.value;
          return (
            <TouchableOpacity
              key={item.value}
              onPress={() => onPriorityChange(item.value)}
              style={[
                styles.priorityChip,
                isSelected ? styles.priorityChipActive : styles.priorityChipInactive,
              ]}
              activeOpacity={0.7}
            >
              {item.value !== 'all' && (
                <View style={[styles.priorityDot, { backgroundColor: item.color }]} />
              )}
              <Text
                style={[
                  styles.priorityText,
                  isSelected ? styles.priorityTextActive : styles.priorityTextInactive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    height: 44,
  },
  searchIcon: {
    marginRight: spacing.xs,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    paddingVertical: 0,
    fontSize: 14,
  },
  clearBtn: {
    padding: 4,
  },
  statusRow: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    paddingBottom: 6,
  },
  statusTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    gap: 6,
  },
  statusTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  statusTabInactive: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  statusTabText: {
    ...typography.caption,
    fontWeight: '600',
    fontSize: 13,
  },
  statusTabTextActive: {
    color: '#FFFFFF',
  },
  statusTabTextInactive: {
    color: colors.textSecondary,
  },
  badgeCount: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: borderRadius.full,
  },
  badgeCountActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  badgeCountInactive: {
    backgroundColor: colors.surfaceSubtle,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  badgeTextActive: {
    color: '#FFFFFF',
  },
  badgeTextInactive: {
    color: colors.textSecondary,
  },
  priorityRow: {
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
    paddingTop: 2,
    paddingBottom: 2,
  },
  priorityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    gap: 5,
  },
  priorityChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  priorityChipInactive: {
    backgroundColor: 'transparent',
    borderColor: colors.border,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  priorityText: {
    ...typography.small,
    fontSize: 11,
  },
  priorityTextActive: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  priorityTextInactive: {
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
