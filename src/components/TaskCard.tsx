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

  // Priority color and label helper
  const getPriorityConfig = (priority: TaskPriority) => {
    switch (priority) {
      case 'high':
        return {
          label: 'High Priority',
          color: colors.priorityHigh,
          bg: colors.priorityHighBg,
          icon: 'flame' as const,
        };
      case 'medium':
        return {
          label: 'Medium',
          color: colors.priorityMedium,
          bg: colors.priorityMediumBg,
          icon: 'alert-circle' as const,
        };
      case 'low':
      default:
        return {
          label: 'Low',
          color: colors.priorityLow,
          bg: colors.priorityLowBg,
          icon: 'leaf' as const,
        };
    }
  };

  // Status configuration
  const getStatusConfig = (status: TaskStatus) => {
    switch (status) {
      case 'done':
        return {
          label: 'Completed',
          color: colors.statusDoneText,
          bg: colors.statusDoneBg,
          borderColor: colors.statusDoneBorder,
          icon: 'checkmark-circle' as const,
        };
      case 'in_progress':
        return {
          label: 'In Progress',
          color: colors.statusInProgressText,
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
      {/* Priority Bar Indicator on Left */}
      <View
        style={[
          styles.priorityBar,
          { backgroundColor: priorityConfig.color },
        ]}
      />

      <View style={styles.cardContent}>
        {/* Top Meta Row: Priority Badge + Status Pill */}
        <View style={styles.metaRow}>
          <View style={[styles.priorityBadge, { backgroundColor: priorityConfig.bg }]}>
            <Ionicons name={priorityConfig.icon} size={13} color={priorityConfig.color} />
            <Text style={[styles.priorityText, { color: priorityConfig.color }]}>
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
            <Ionicons name={statusConfig.icon} size={14} color={statusConfig.color} />
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Task Title */}
        <Text
          style={[styles.title, isDone && styles.titleDone]}
          numberOfLines={2}
        >
          {task.title}
        </Text>

        {/* Task Description */}
        {Boolean(task.description) && (
          <Text
            style={[styles.description, isDone && styles.descriptionDone]}
            numberOfLines={3}
          >
            {task.description}
          </Text>
        )}

        {/* Divider */}
        <View style={styles.divider} />

        {/* Bottom Row: Due Date & Actions */}
        <View style={styles.bottomRow}>
          {/* Due Date */}
          <View style={styles.dueDateContainer}>
            <Ionicons
              name={isTaskOverdue ? 'alert-circle' : 'calendar-outline'}
              size={15}
              color={isTaskOverdue ? colors.danger : colors.textMuted}
            />
            <Text
              style={[
                styles.dueDateText,
                isTaskOverdue && styles.dueDateOverdue,
              ]}
            >
              {isTaskOverdue ? `Overdue: ${formatDate(task.dueDate)}` : `Due: ${formatDate(task.dueDate)}`}
            </Text>
          </View>

          {/* Action Buttons (Edit / Delete) */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              onPress={() => onEdit(task)}
              style={styles.actionButton}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              activeOpacity={0.7}
            >
              <Ionicons name="pencil-outline" size={17} color={colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onDelete(task)}
              style={[styles.actionButton, styles.deleteButton]}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={17} color={colors.danger} />
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
    opacity: 0.85,
    backgroundColor: '#FAFCFF',
  },
  priorityBar: {
    width: 5,
  },
  cardContent: {
    flex: 1,
    padding: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
    gap: 4,
  },
  priorityText: {
    ...typography.small,
    fontWeight: '700',
    textTransform: 'uppercase',
    fontSize: 10,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    gap: 4,
  },
  statusText: {
    ...typography.small,
    fontWeight: '600',
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    lineHeight: 19,
  },
  descriptionDone: {
    color: colors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: colors.surfaceSubtle,
    marginVertical: spacing.xs + 2,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 2,
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dueDateText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  dueDateOverdue: {
    color: colors.danger,
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: colors.dangerBg,
  },
});
