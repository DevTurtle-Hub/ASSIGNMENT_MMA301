import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task, TaskPriority, TaskStatus } from '../types/task';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';
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

  // Priority visual styling
  const getPriorityConfig = (priority: TaskPriority) => {
    switch (priority) {
      case 'high':
        return {
          label: 'High Priority',
          color: colors.priorityHigh,
          bg: colors.priorityHighBg,
          borderColor: colors.priorityHighBorder,
          icon: 'flame' as const,
        };
      case 'medium':
        return {
          label: 'Medium',
          color: colors.priorityMedium,
          bg: colors.priorityMediumBg,
          borderColor: colors.priorityMediumBorder,
          icon: 'alert-circle' as const,
        };
      case 'low':
      default:
        return {
          label: 'Low',
          color: colors.priorityLow,
          bg: colors.priorityLowBg,
          borderColor: colors.priorityLowBorder,
          icon: 'leaf' as const,
        };
    }
  };

  // Status visual styling
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
          label: 'In Progress',
          color: colors.textPurple,
          bg: colors.statusInProgressBg,
          borderColor: colors.statusInProgressBorder,
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
      {/* Priority Colored Accent Strip */}
      <View
        style={[
          styles.priorityIndicator,
          { backgroundColor: priorityConfig.color },
        ]}
      />

      <View style={styles.cardMain}>
        {/* Top Meta Line: Priority & Interactive Status Pill */}
        <View style={styles.headerRow}>
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
            <Ionicons name={priorityConfig.icon} size={12} color={priorityConfig.color} />
            <Text style={[styles.priorityPillText, { color: priorityConfig.color }]}>
              {priorityConfig.label}
            </Text>
          </View>

          {/* Interactive Status Pill Button */}
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
            <Ionicons name={statusConfig.icon} size={14} color={statusConfig.color} />
            <Text style={[styles.statusPillText, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Task Title */}
        <Text
          style={[styles.taskTitle, isDone && styles.taskTitleDone]}
          numberOfLines={2}
        >
          {task.title}
        </Text>

        {/* Task Description */}
        {Boolean(task.description) && (
          <Text
            style={[styles.taskDesc, isDone && styles.taskDescDone]}
            numberOfLines={2}
          >
            {task.description}
          </Text>
        )}

        {/* Subtle Horizontal Divider */}
        <View style={styles.cardDivider} />

        {/* Footer Meta Row: Due Date + Action Icons */}
        <View style={styles.footerRow}>
          {/* Due Date Indicator */}
          <View style={styles.dueDateBadge}>
            <Ionicons
              name={isTaskOverdue ? 'warning' : 'calendar-outline'}
              size={13}
              color={isTaskOverdue ? colors.danger : colors.textSecondary}
            />
            <Text
              style={[
                styles.dueDateLabel,
                isTaskOverdue && styles.dueDateOverdue,
              ]}
            >
              {isTaskOverdue
                ? `Overdue (${formatDate(task.dueDate)})`
                : formatDate(task.dueDate)}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionGroup}>
            <TouchableOpacity
              onPress={() => onEdit(task)}
              style={styles.btnEdit}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              activeOpacity={0.7}
            >
              <Ionicons name="create-outline" size={16} color={colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onDelete(task)}
              style={styles.btnDelete}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={16} color={colors.danger} />
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
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  cardDone: {
    backgroundColor: '#FAFCFF',
    opacity: 0.88,
  },
  priorityIndicator: {
    width: 4.5,
  },
  cardMain: {
    flex: 1,
    padding: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs + 2,
  },
  priorityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    gap: 4,
  },
  priorityPillText: {
    ...typography.small,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    gap: 4,
  },
  statusPillText: {
    ...typography.small,
    fontWeight: '700',
    fontSize: 11,
  },
  taskTitle: {
    ...typography.h3,
    fontSize: 16,
    color: colors.textPrimary,
    marginTop: 2,
    marginBottom: 4,
  },
  taskTitleDone: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  taskDesc: {
    ...typography.body,
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    lineHeight: 18,
  },
  taskDescDone: {
    color: colors.textMuted,
  },
  cardDivider: {
    height: 1,
    backgroundColor: colors.borderSubtle,
    marginVertical: 4,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  dueDateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueDateLabel: {
    ...typography.caption,
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  dueDateOverdue: {
    color: colors.danger,
    fontWeight: '700',
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  btnEdit: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  btnDelete: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    backgroundColor: colors.dangerBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.dangerBorder,
  },
});
