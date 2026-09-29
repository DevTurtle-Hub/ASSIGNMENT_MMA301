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
import { colors, spacing, borderRadius } from '../theme';
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
  const statusOptions: { label: string; value: TaskFilterStatus }[] = [
    { label: 'All', value: 'all' },
    { label: 'Todo', value: 'todo' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Done', value: 'done' },
  ];

  const priorityOptions: { label: string; value: TaskFilterPriority; color: string }[] = [
    { label: 'All', value: 'all', color: colors.textSecondary },
    { label: 'High', value: 'high', color: colors.priorityHigh },
    { label: 'Medium', value: 'medium', color: colors.priorityMedium },
    { label: 'Low', value: 'low', color: colors.priorityLow },
  ];

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={15} color={colors.primary} style={styles.searchIcon} />
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
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            style={styles.clearBtn}
          >
            <Ionicons name="close-circle" size={15} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Tasks Title + Status Filter Tabs (Matching Reference Image) */}
      <View style={styles.tasksFilterRow}>
        <View style={styles.tasksTitleGroup}>
          <Text style={styles.tasksHeading}>Tasks</Text>
          <View style={styles.tasksCountBadge}>
            <Text style={styles.tasksCountText}>{stats.total}</Text>
          </View>
        </View>

        {/* Filter Pills */}
        <View style={styles.pillTabs}>
          {statusOptions.map((item) => {
            const isSelected = statusFilter === item.value;
            return (
              <TouchableOpacity
                key={item.value}
                onPress={() => onStatusChange(item.value)}
                style={[
                  styles.filterPill,
                  isSelected && styles.filterPillActive,
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    isSelected && styles.filterPillTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Priority Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.priorityRow}
      >
        <Text style={styles.priorityPrefix}>Priority:</Text>
        {priorityOptions.map((item) => {
          const isSelected = priorityFilter === item.value;
          return (
            <TouchableOpacity
              key={item.value}
              onPress={() => onPriorityChange(item.value)}
              style={[
                styles.priorityChip,
                isSelected && styles.priorityChipActive,
              ]}
              activeOpacity={0.7}
            >
              {item.value !== 'all' && (
                <View style={[styles.priorityDot, { backgroundColor: item.color }]} />
              )}
              <Text
                style={[
                  styles.priorityText,
                  isSelected && styles.priorityTextActive,
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: 4,
    backgroundColor: colors.background,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: spacing.sm,
    paddingHorizontal: 10,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    height: 38,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 13,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 2,
  },
  tasksFilterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs + 2,
  },
  tasksTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tasksHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  tasksCountBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 7,
    paddingVertical: 1,
    borderRadius: borderRadius.full,
  },
  tasksCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F46E5',
  },
  pillTabs: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: borderRadius.full,
    padding: 2,
  },
  filterPill: {
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: borderRadius.full,
  },
  filterPillActive: {
    backgroundColor: '#4F46E5',
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  priorityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingBottom: 2,
  },
  priorityPrefix: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    marginRight: 2,
  },
  priorityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: borderRadius.xs,
    gap: 4,
  },
  priorityChipActive: {
    backgroundColor: '#EEF2FF',
  },
  priorityDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  priorityText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  priorityTextActive: {
    color: '#4F46E5',
    fontWeight: '700',
  },
});
