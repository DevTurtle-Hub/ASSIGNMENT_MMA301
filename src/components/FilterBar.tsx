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
    { label: 'Completed', value: 'done', count: stats.done },
  ];

  const priorityOptions: { label: string; value: TaskFilterPriority; color: string }[] = [
    { label: 'All Priority', value: 'all', color: colors.textSecondary },
    { label: 'High', value: 'high', color: colors.priorityHigh },
    { label: 'Medium', value: 'medium', color: colors.priorityMedium },
    { label: 'Low', value: 'low', color: colors.priorityLow },
  ];

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search tasks by title or description..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={onSearchChange}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {Boolean(searchQuery) && (
          <TouchableOpacity
            onPress={() => onSearchChange('')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Status Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsScroll}
      >
        {statusOptions.map((item) => {
          const isSelected = statusFilter === item.value;
          return (
            <TouchableOpacity
              key={item.value}
              onPress={() => onStatusChange(item.value)}
              style={[
                styles.chip,
                isSelected ? styles.chipSelected : styles.chipUnselected,
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.chipText,
                  isSelected ? styles.chipTextSelected : styles.chipTextUnselected,
                ]}
              >
                {item.label}
              </Text>
              <View
                style={[
                  styles.countBadge,
                  isSelected ? styles.countBadgeSelected : styles.countBadgeUnselected,
                ]}
              >
                <Text
                  style={[
                    styles.countText,
                    isSelected ? styles.countTextSelected : styles.countTextUnselected,
                  ]}
                >
                  {item.count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Priority Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.priorityScroll}
      >
        {priorityOptions.map((item) => {
          const isSelected = priorityFilter === item.value;
          return (
            <TouchableOpacity
              key={item.value}
              onPress={() => onPriorityChange(item.value)}
              style={[
                styles.priorityChip,
                isSelected ? styles.priorityChipSelected : styles.priorityChipUnselected,
              ]}
              activeOpacity={0.7}
            >
              {item.value !== 'all' && (
                <View style={[styles.priorityDot, { backgroundColor: item.color }]} />
              )}
              <Text
                style={[
                  styles.priorityChipText,
                  isSelected
                    ? styles.priorityChipTextSelected
                    : styles.priorityChipTextUnselected,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    height: 42,
  },
  searchIcon: {
    marginRight: spacing.xs,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  clearButton: {
    padding: spacing.xs,
  },
  chipsScroll: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    paddingBottom: spacing.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    gap: 6,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipUnselected: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  chipText: {
    ...typography.caption,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: colors.surface,
  },
  chipTextUnselected: {
    color: colors.textSecondary,
  },
  countBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: borderRadius.full,
  },
  countBadgeSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  countBadgeUnselected: {
    backgroundColor: colors.surfaceSubtle,
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
  },
  countTextSelected: {
    color: colors.surface,
  },
  countTextUnselected: {
    color: colors.textSecondary,
  },
  priorityScroll: {
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
    paddingTop: 4,
    paddingBottom: 2,
  },
  priorityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    gap: 4,
  },
  priorityChipSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  priorityChipUnselected: {
    backgroundColor: 'transparent',
    borderColor: colors.border,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  priorityChipText: {
    ...typography.small,
  },
  priorityChipTextSelected: {
    color: colors.primaryDark,
    fontWeight: '600',
  },
  priorityChipTextUnselected: {
    color: colors.textSecondary,
  },
});
