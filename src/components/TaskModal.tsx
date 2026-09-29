import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task, TaskPriority, TaskStatus, CreateTaskInput, UpdateTaskInput } from '../types/task';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';
import { getTodayString, getFutureDateString } from '../utils/dateUtils';

interface TaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmitCreate: (input: CreateTaskInput) => Promise<boolean>;
  onSubmitUpdate: (id: string, updates: UpdateTaskInput) => Promise<boolean>;
  taskToEdit?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  visible,
  onClose,
  onSubmitCreate,
  onSubmitUpdate,
  taskToEdit,
}) => {
  const isEditing = Boolean(taskToEdit);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState(getTodayString());

  // Error & loading
  const [titleError, setTitleError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (visible) {
      if (taskToEdit) {
        setTitle(taskToEdit.title);
        setDescription(taskToEdit.description || '');
        setStatus(taskToEdit.status);
        setPriority(taskToEdit.priority);
        setDueDate(taskToEdit.dueDate || getTodayString());
      } else {
        setTitle('');
        setDescription('');
        setStatus('todo');
        setPriority('medium');
        setDueDate(getTodayString());
      }
      setTitleError(null);
      setIsSubmitting(false);
    }
  }, [visible, taskToEdit]);

  const validateForm = (): boolean => {
    if (!title.trim()) {
      setTitleError('Task title is required.');
      return false;
    }
    setTitleError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (isEditing && taskToEdit) {
        const success = await onSubmitUpdate(taskToEdit.id, {
          title: title.trim(),
          description: description.trim(),
          status,
          priority,
          dueDate,
        });
        if (success) onClose();
      } else {
        const success = await onSubmitCreate({
          title: title.trim(),
          description: description.trim(),
          status,
          priority,
          dueDate,
        });
        if (success) onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusList: { label: string; value: TaskStatus; icon: any }[] = [
    { label: 'To Do', value: 'todo', icon: 'ellipse-outline' },
    { label: 'In Progress', value: 'in_progress', icon: 'time-outline' },
    { label: 'Done', value: 'done', icon: 'checkmark-circle-outline' },
  ];

  const priorityList: { label: string; value: TaskPriority; color: string; bg: string }[] = [
    { label: 'Low', value: 'low', color: colors.priorityLow, bg: colors.priorityLowBg },
    { label: 'Medium', value: 'medium', color: colors.priorityMedium, bg: colors.priorityMediumBg },
    { label: 'High', value: 'high', color: colors.priorityHigh, bg: colors.priorityHighBg },
  ];

  const quickDates = [
    { label: 'Today', value: getTodayString() },
    { label: 'Tomorrow', value: getFutureDateString(1) },
    { label: '+3 Days', value: getFutureDateString(3) },
    { label: '+1 Week', value: getFutureDateString(7) },
  ];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.modalSheet}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerTitleRow}>
              <View style={styles.headerIconBox}>
                <Ionicons
                  name={isEditing ? 'create' : 'add'}
                  size={20}
                  color="#FFFFFF"
                />
              </View>
              <View>
                <Text style={styles.modalTitle}>
                  {isEditing ? 'Edit Task' : 'New Task'}
                </Text>
                <Text style={styles.modalSubtitle}>
                  {isEditing ? 'Update task details and progress' : 'Fill in task details below'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.btnDismiss}
            >
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollArea}
          >
            {/* Title */}
            <View style={styles.field}>
              <View style={styles.fieldLabelRow}>
                <Text style={styles.fieldLabel}>Task Title</Text>
                <Text style={styles.requiredStar}>*</Text>
              </View>
              <TextInput
                style={[styles.input, Boolean(titleError) && styles.inputError]}
                placeholder="e.g. Design app homepage mockups"
                placeholderTextColor={colors.textMuted}
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  if (titleError) setTitleError(null);
                }}
                autoFocus={!isEditing}
              />
              {Boolean(titleError) && (
                <View style={styles.errorBanner}>
                  <Ionicons name="alert-circle" size={13} color={colors.danger} />
                  <Text style={styles.errorText}>{titleError}</Text>
                </View>
              )}
            </View>

            {/* Description */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Description (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Provide extra context, links, or sub-tasks..."
                placeholderTextColor={colors.textMuted}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Priority Selector */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Priority Level</Text>
              <View style={styles.pillRow}>
                {priorityList.map((item) => {
                  const isSelected = priority === item.value;
                  return (
                    <TouchableOpacity
                      key={item.value}
                      onPress={() => setPriority(item.value)}
                      style={[
                        styles.selectPill,
                        isSelected && {
                          borderColor: item.color,
                          backgroundColor: item.bg,
                        },
                      ]}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                      <Text
                        style={[
                          styles.selectPillText,
                          isSelected && { color: item.color, fontWeight: '700' },
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Status Selector */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Status</Text>
              <View style={styles.pillRow}>
                {statusList.map((item) => {
                  const isSelected = status === item.value;
                  return (
                    <TouchableOpacity
                      key={item.value}
                      onPress={() => setStatus(item.value)}
                      style={[
                        styles.selectPill,
                        isSelected && styles.statusPillActive,
                      ]}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={item.icon}
                        size={15}
                        color={isSelected ? colors.primaryDark : colors.textSecondary}
                      />
                      <Text
                        style={[
                          styles.selectPillText,
                          isSelected && styles.statusPillTextActive,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Due Date & Shortcuts */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Due Date (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textMuted}
                value={dueDate}
                onChangeText={setDueDate}
              />
              <View style={styles.quickDateRow}>
                {quickDates.map((item) => {
                  const isSelected = dueDate === item.value;
                  return (
                    <TouchableOpacity
                      key={item.label}
                      onPress={() => setDueDate(item.value)}
                      style={[
                        styles.quickDateItem,
                        isSelected && styles.quickDateItemActive,
                      ]}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.quickDateLabel,
                          isSelected && styles.quickDateLabelActive,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.btnCancel}
              disabled={isSubmitting}
            >
              <Text style={styles.btnCancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmit}
              style={[styles.btnSubmit, isSubmitting && styles.btnSubmitDisabled]}
              disabled={isSubmitting}
              activeOpacity={0.85}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons
                    name={isEditing ? 'save-outline' : 'checkmark'}
                    size={17}
                    color="#FFFFFF"
                  />
                  <Text style={styles.btnSubmitText}>
                    {isEditing ? 'Save Task' : 'Create Task'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalSheet: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    width: '100%',
    maxHeight: '90%',
    ...shadows.lg,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  headerIconBox: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    ...typography.h2,
    fontSize: 17,
    color: colors.textPrimary,
  },
  modalSubtitle: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSecondary,
  },
  btnDismiss: {
    padding: 6,
  },
  scrollArea: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  field: {
    gap: 6,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  fieldLabel: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textPrimary,
    fontSize: 12,
  },
  requiredStar: {
    color: colors.danger,
    fontWeight: '700',
  },
  input: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    ...typography.body,
    color: colors.textPrimary,
    fontSize: 14,
  },
  inputError: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerBg,
  },
  textArea: {
    minHeight: 65,
    paddingTop: 10,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  errorText: {
    ...typography.small,
    color: colors.danger,
    fontSize: 11,
  },
  pillRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  selectPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSubtle,
    gap: 5,
  },
  colorDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  selectPillText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  statusPillActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  statusPillTextActive: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  quickDateRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: 4,
  },
  quickDateItem: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickDateItemActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  quickDateLabel: {
    ...typography.small,
    fontSize: 11,
    color: colors.textSecondary,
  },
  quickDateLabelActive: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surfaceSubtle,
  },
  btnCancel: {
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
  },
  btnCancelText: {
    ...typography.bodyBold,
    color: colors.textSecondary,
  },
  btnSubmit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  btnSubmitDisabled: {
    opacity: 0.6,
  },
  btnSubmitText: {
    ...typography.bodyBold,
    color: '#FFFFFF',
    fontSize: 13,
  },
});
