import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task, TaskPriority, TaskStatus } from '../types/task';
import { colors, spacing, borderRadius, shadows } from '../theme';
import { formatDate, isOverdue } from '../utils/dateUtils';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleStatus: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const isTaskOverdue = isOverdue(task.dueDate) && task.status !== 'done';
  const isDone = task.status === 'done';

  const getPriorityConfig = (priority: TaskPriority) => {
    switch (priority) {
      case 'high':
        return {
          label: 'High',
          color: colors.priorityHigh,
          bg: colors.priorityHighBg,
          borderColor: colors.priorityHighBorder,
        };
      case 'medium':
        return {
          label: 'Medium',
          color: colors.priorityMedium,
          bg: colors.priorityMediumBg,
          borderColor: colors.priorityMediumBorder,
        };
      case 'low':
      default:
        return {
          label: 'Low',
          color: colors.priorityLow,
          bg: colors.priorityLowBg,
          borderColor: colors.priorityLowBorder,
        };
    }
  };

  const getStatusConfig = (status: TaskStatus) => {
    switch (status) {
      case 'done':
        return {
          label: 'Done',
          color: colors.statusDoneText,
          bg: colors.statusDoneBg,
          borderColor: colors.statusDoneBorder,
          icon: 'checkmark-circle' as const,
        };
      case 'in_progress':
        return {
          label: 'In Prog',
          color: colors.primaryDark,
          bg: colors.primarySoft,
          borderColor: colors.primaryBorder,
          icon: 'time' as const,
        };
      case 'todo':
      default:
        return {
          label: 'To Do',
          color: colors.statusTodoText,
          bg: colors.statusTodoBg,
          borderColor: colors.statusTodoBorder,
          icon: 'ellipse-outline' as const,
        };
    }
  };

  const priorityConfig = getPriorityConfig(task.priority);
  const statusConfig = getStatusConfig(task.status);

  return (
    <View style={[styles.card, isDone && styles.cardDone]}>
      {/* Priority Left Color Line */}
      <View style={[styles.priorityLine, { backgroundColor: priorityConfig.color }]} />

      <View style={styles.cardContent}>
        {/* Top Header Row */}
        <View style={styles.topRow}>
          {/* Priority Pill */}
          <View
            style={[
              styles.priorityPill,
              {
                backgroundColor: priorityConfig.bg,
                borderColor: priorityConfig.borderColor,
              },
            ]}
          >
            <Text style={[styles.priorityPillText, { color: priorityConfig.color }]}>
              {priorityConfig.label}
            </Text>
          </View>

          {/* Interactive Status Pill */}
          <TouchableOpacity
            onPress={() => onToggleStatus(task)}
            style={[
              styles.statusPill,
              {
                backgroundColor: statusConfig.bg,
                borderColor: statusConfig.borderColor,
              },
            ]}
            activeOpacity={0.7}
          >
            <Ionicons name={statusConfig.icon} size={12} color={statusConfig.color} />
            <Text style={[styles.statusPillText, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Task Title */}
        <Text style={[styles.title, isDone && styles.titleDone]} numberOfLines={2}>
          {task.title}
        </Text>

        {/* Task Description */}
        {Boolean(task.description) && (
          <Text style={[styles.description, isDone && styles.descriptionDone]} numberOfLines={2}>
            {task.description}
          </Text>
        )}

        {/* Bottom Meta Row */}
        <View style={styles.bottomRow}>
          {/* Due Date */}
          <View style={styles.dueDateBadge}>
            <Ionicons
              name={isTaskOverdue ? 'warning' : 'calendar-outline'}
              size={12}
              color={isTaskOverdue ? colors.danger : colors.textMuted}
            />
            <Text style={[styles.dueDateText, isTaskOverdue && styles.dueDateOverdue]}>
              {isTaskOverdue ? `Overdue: ${formatDate(task.dueDate)}` : formatDate(task.dueDate)}
            </Text>
          </View>

          {/* Compact Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={() => onEdit(task)}
              style={styles.miniBtn}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              activeOpacity={0.7}
            >
              <Ionicons name="create-outline" size={15} color={colors.primaryDark} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onDelete(task)}
              style={[styles.miniBtn, styles.miniBtnDelete]}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={15} color={colors.danger} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm + 2,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  cardDone: {
    backgroundColor: '#FAF9FF',
    opacity: 0.85,
  },
  priorityLine: {
    width: 3.5,
  },
  cardContent: {
    flex: 1,
    paddingVertical: 9,
    paddingHorizontal: 11,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  priorityPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
    borderWidth: 1,
  },
  priorityPillText: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    gap: 3,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 18,
    marginTop: 2,
    marginBottom: 2,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  description: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
    marginBottom: 6,
  },
  descriptionDone: {
    color: colors.textMuted,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 3,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
  },
  dueDateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueDateText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  dueDateOverdue: {
    color: colors.danger,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    gap: 6,
  },
  miniBtn: {
    width: 26,
    height: 26,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  miniBtnDelete: {
    backgroundColor: colors.dangerBg,
    borderColor: colors.dangerBorder,
  },
});
