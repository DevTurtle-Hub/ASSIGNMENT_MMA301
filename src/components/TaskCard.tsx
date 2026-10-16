import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task, TaskPriority, TaskStatus } from '../types/task';
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

  const getPriorityLabel = (priority: TaskPriority) => {
    switch (priority) {
      case 'high':
        return 'High';
      case 'medium':
        return 'Medium';
      case 'low':
      default:
        return 'Low';
    }
  };

  const getStatusConfig = (status: TaskStatus) => {
    switch (status) {
      case 'done':
        return {
          label: 'Completed',
          color: '#16A34A',
          bg: '#F0FDF4',
          border: '#BBF7D0',
          iconName: 'checkmark-circle' as const,
        };
      case 'in_progress':
        return {
          label: 'In Progress',
          color: '#2563EB', // Primary app color
          bg: '#EFF6FF',
          border: '#BFDBFE',
          iconName: 'time' as const,
        };
      case 'todo':
      default:
        return {
          label: 'To Do',
          color: '#475569',
          bg: '#F8FAFC',
          border: '#E2E8F0',
          iconName: 'ellipse-outline' as const,
        };
    }
  };

  const statusConfig = getStatusConfig(task.status);

  return (
    <View
      style={[
        styles.card,
        isDone ? styles.cardDone : styles.cardActive,
      ]}
    >
      {/* Header Row: Title & Primary App-colored Status Pill */}
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <Text style={[styles.title, isDone && styles.titleDone]} numberOfLines={2}>
            {task.title}
          </Text>
        </View>

        {/* Interactive Status Pill */}
        <TouchableOpacity
          onPress={() => onToggleStatus(task)}
          style={[
            styles.statusPill,
            { backgroundColor: statusConfig.bg, borderColor: statusConfig.border },
          ]}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name={statusConfig.iconName} size={13} color={statusConfig.color} />
          <Text style={[styles.statusPillText, { color: statusConfig.color }]}>
            {statusConfig.label}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Description */}
      {Boolean(task.description) && (
        <Text style={[styles.description, isDone && styles.descriptionDone]} numberOfLines={2}>
          {task.description}
        </Text>
      )}

      {/* Metadata Badges in Primary & Slate Tones */}
      <View style={styles.badgeRow}>
        {/* Priority Badge */}
        <View style={styles.badge}>
          <View
            style={[
              styles.priorityDot,
              task.priority === 'high' ? styles.dotHigh : task.priority === 'medium' ? styles.dotMedium : styles.dotLow,
            ]}
          />
          <Text style={styles.badgeText}>
            {getPriorityLabel(task.priority)}
          </Text>
        </View>

        {/* Due Date Badge */}
        <View
          style={[
            styles.badge,
            isTaskOverdue && styles.badgeOverdue,
          ]}
        >
          <Ionicons
            name={isTaskOverdue ? 'alert-circle' : 'calendar-outline'}
            size={12}
            color={isTaskOverdue ? '#DC2626' : '#2563EB'}
          />
          <Text
            style={[
              styles.badgeText,
              isTaskOverdue && styles.badgeTextOverdue,
            ]}
          >
            {isTaskOverdue ? `Overdue: ${formatDate(task.dueDate)}` : formatDate(task.dueDate)}
          </Text>
        </View>

        {/* Team Tag (Primary Blue) */}
        {Boolean(task.teamName) && (
          <View style={[styles.badge, styles.badgeTeam]}>
            <Ionicons name="people" size={12} color="#2563EB" />
            <Text style={styles.badgeTextTeam} numberOfLines={1}>
              {task.teamName}
            </Text>
          </View>
        )}

        {/* Assignee Tag */}
        {Boolean(task.assigneeName) && (
          <View style={styles.badge}>
            <Ionicons name="person-outline" size={11} color="#64748B" />
            <Text style={styles.badgeText} numberOfLines={1}>
              {task.assigneeName}
            </Text>
          </View>
        )}
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Footer: Quick status note & Action buttons */}
      <View style={styles.footerRow}>
        <Text style={styles.footerNote}>
          {isDone ? '✓ Completed' : task.status === 'in_progress' ? '⚡ In progress' : 'Tap status to change'}
        </Text>

        <View style={styles.actionGroup}>
          <TouchableOpacity
            onPress={() => onEdit(task)}
            style={styles.btnEdit}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="pencil-sharp" size={12} color="#2563EB" />
            <Text style={styles.btnEditText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onDelete(task)}
            style={styles.btnDelete}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="trash-outline" size={13} color="#94A3B8" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    paddingTop: 14,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderLeftWidth: 4,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardActive: {
    borderLeftColor: '#2563EB', // Primary Brand Royal Blue
  },
  cardDone: {
    backgroundColor: '#F8FAFC',
    borderLeftColor: '#CBD5E1',
    opacity: 0.82,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 6,
  },
  titleWrap: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  description: {
    fontSize: 13.5,
    color: '#334155',
    lineHeight: 19,
    marginBottom: 10,
  },
  descriptionDone: {
    color: '#94A3B8',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
    marginBottom: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 7,
    borderWidth: 1,
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    gap: 4,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotHigh: {
    backgroundColor: '#EF4444',
  },
  dotMedium: {
    backgroundColor: '#F59E0B',
  },
  dotLow: {
    backgroundColor: '#64748B',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  badgeOverdue: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECDD3',
  },
  badgeTextOverdue: {
    color: '#DC2626',
    fontWeight: '700',
  },
  badgeTeam: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  badgeTextTeam: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB', // Primary Brand Royal Blue
    maxWidth: 100,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 8,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerNote: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  btnEdit: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 7,
    gap: 4,
  },
  btnEditText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#2563EB', // Primary Brand Royal Blue
  },
  btnDelete: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 7,
  },
});
