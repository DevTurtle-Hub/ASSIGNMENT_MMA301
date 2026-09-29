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

  // Harmonious priority styling
  const getPriorityConfig = (priority: TaskPriority) => {
    switch (priority) {
      case 'high':
        return {
          label: 'HIGH',
          color: '#E11D48',
          bg: '#FFF1F2',
          border: '#FFE4E6',
        };
      case 'medium':
        return {
          label: 'MEDIUM',
          color: '#D97706',
          bg: '#FFFBEB',
          border: '#FEF3C7',
        };
      case 'low':
      default:
        return {
          label: 'LOW',
          color: '#0284C7',
          bg: '#F0F9FF',
          border: '#E0F2FE',
        };
    }
  };

  // Harmonious status styling
  const getStatusConfig = (status: TaskStatus) => {
    switch (status) {
      case 'done':
        return {
          label: 'Done',
          color: '#16A34A',
          bg: '#F0FDF4',
          border: '#DCFCE7',
          icon: 'checkmark-circle' as const,
        };
      case 'in_progress':
        return {
          label: 'In Prog',
          color: '#2563EB',
          bg: '#EFF6FF',
          border: '#BFDBFE',
          icon: 'time' as const,
        };
      case 'todo':
      default:
        return {
          label: 'To Do',
          color: '#64748B',
          bg: '#F8FAFC',
          border: '#E2E8F0',
          icon: 'ellipse-outline' as const,
        };
    }
  };

  const priorityConfig = getPriorityConfig(task.priority);
  const statusConfig = getStatusConfig(task.status);

  return (
    <View style={[styles.card, isDone && styles.cardDone]}>
      {/* Top Header Row: Priority + Status Pill */}
      <View style={styles.topRow}>
        {/* Harmonious Priority Pill */}
        <View
          style={[
            styles.priorityPill,
            {
              backgroundColor: priorityConfig.bg,
              borderColor: priorityConfig.border,
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
              borderColor: statusConfig.border,
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

        {/* Unified Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => onEdit(task)}
            style={styles.miniBtn}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            activeOpacity={0.7}
          >
            <Ionicons name="create-outline" size={15} color="#2563EB" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onDelete(task)}
            style={[styles.miniBtn, styles.miniBtnDelete]}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={15} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.md + 2,
    marginBottom: spacing.sm + 2,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  cardDone: {
    backgroundColor: '#F8FAFC',
    opacity: 0.82,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  priorityPill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
    borderWidth: 1,
  },
  priorityPillText: {
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    gap: 3.5,
  },
  statusPillText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 19,
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
    paddingTop: 4,
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
    width: 28,
    height: 28,
    borderRadius: borderRadius.sm,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniBtnDelete: {
    backgroundColor: '#FEF2F2',
  },
});
