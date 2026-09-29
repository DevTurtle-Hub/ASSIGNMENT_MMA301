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

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState(getTodayString());

  // Validation & Loading states
  const [titleError, setTitleError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset or populate fields when modal opens/changes
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
        if (success) {
          onClose();
        }
      } else {
        const success = await onSubmitCreate({
          title: title.trim(),
          description: description.trim(),
          status,
          priority,
          dueDate,
        });
        if (success) {
          onClose();
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusList: { label: string; value: TaskStatus }[] = [
    { label: 'To Do', value: 'todo' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Completed', value: 'done' },
  ];

  const priorityList: { label: string; value: TaskPriority; color: string }[] = [
    { label: 'Low', value: 'low', color: colors.priorityLow },
    { label: 'Medium', value: 'medium', color: colors.priorityMedium },
    { label: 'High', value: 'high', color: colors.priorityHigh },
  ];

  const quickDates = [
    { label: 'Today', value: getTodayString() },
    { label: 'Tomorrow', value: getFutureDateString(1) },
    { label: '+3 Days', value: getFutureDateString(3) },
    { label: '+1 Week', value: getFutureDateString(7) },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.modalCard}>
          {/* Modal Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Ionicons
                name={isEditing ? 'create-outline' : 'add-circle-outline'}
                size={22}
                color={colors.primary}
              />
              <Text style={styles.headerTitle}>
                {isEditing ? 'Edit Task' : 'Create New Task'}
              </Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Title Field (Required) */}
            <View style={styles.formGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Task Title</Text>
                <Text style={styles.requiredAsterisk}>*</Text>
              </View>
              <TextInput
                style={[
                  styles.input,
                  Boolean(titleError) && styles.inputError,
                ]}
                placeholder="e.g. Implement user authentication"
                placeholderTextColor={colors.textMuted}
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  if (titleError) setTitleError(null);
                }}
                autoFocus={!isEditing}
              />
              {Boolean(titleError) && (
                <View style={styles.errorRow}>
                  <Ionicons name="alert-circle" size={14} color={colors.danger} />
                  <Text style={styles.errorText}>{titleError}</Text>
                </View>
              )}
            </View>

            {/* Description Field (Optional) */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Description (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add more details, requirements, or notes..."
                placeholderTextColor={colors.textMuted}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Priority Selector */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Priority Level</Text>
              <View style={styles.optionsRow}>
                {priorityList.map((item) => {
                  const isSelected = priority === item.value;
                  return (
                    <TouchableOpacity
                      key={item.value}
                      onPress={() => setPriority(item.value)}
                      style={[
                        styles.optionChip,
                        isSelected && {
                          borderColor: item.color,
                          backgroundColor:
                            item.value === 'high'
                              ? colors.priorityHighBg
                              : item.value === 'medium'
                              ? colors.priorityMediumBg
                              : colors.priorityLowBg,
                        },
                      ]}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.priorityDot, { backgroundColor: item.color }]} />
                      <Text
                        style={[
                          styles.optionChipText,
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
            <View style={styles.formGroup}>
              <Text style={styles.label}>Task Status</Text>
              <View style={styles.optionsRow}>
                {statusList.map((item) => {
                  const isSelected = status === item.value;
                  return (
                    <TouchableOpacity
                      key={item.value}
                      onPress={() => setStatus(item.value)}
                      style={[
                        styles.optionChip,
                        isSelected && styles.statusChipSelected,
                      ]}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.optionChipText,
                          isSelected && styles.statusChipTextSelected,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Due Date Field & Shortcuts */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Due Date (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textMuted}
                value={dueDate}
                onChangeText={setDueDate}
              />

              {/* Quick Date Buttons */}
              <View style={styles.quickDatesRow}>
                {quickDates.map((item) => {
                  const isSelected = dueDate === item.value;
                  return (
                    <TouchableOpacity
                      key={item.label}
                      onPress={() => setDueDate(item.value)}
                      style={[
                        styles.quickDateBtn,
                        isSelected && styles.quickDateBtnSelected,
                      ]}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.quickDateText,
                          isSelected && styles.quickDateTextSelected,
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

          {/* Modal Footer / Action Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.cancelButton}
              disabled={isSubmitting}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmit}
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={colors.surface} />
              ) : (
                <>
                  <Ionicons
                    name={isEditing ? 'save-outline' : 'checkmark-sharp'}
                    size={18}
                    color={colors.surface}
                  />
                  <Text style={styles.submitButtonText}>
                    {isEditing ? 'Save Changes' : 'Create Task'}
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
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    width: '100%',
    maxHeight: '90%',
    ...shadows.lg,
    overflow: 'hidden',
  },
  header: {
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
    gap: spacing.sm,
  },
  headerTitle: {
    ...typography.h2,
    fontSize: 18,
    color: colors.textPrimary,
  },
  closeButton: {
    padding: spacing.xs,
  },
  scrollContent: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  formGroup: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  label: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  requiredAsterisk: {
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
  },
  inputError: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerBg,
  },
  textArea: {
    minHeight: 70,
    paddingTop: 10,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  errorText: {
    ...typography.small,
    color: colors.danger,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  optionChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSubtle,
    gap: 6,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  optionChipText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  statusChipSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  statusChipTextSelected: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  quickDatesRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: 4,
  },
  quickDateBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickDateBtnSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  quickDateText: {
    ...typography.small,
    fontSize: 11,
    color: colors.textSecondary,
  },
  quickDateTextSelected: {
    color: colors.primaryDark,
    fontWeight: '600',
  },
  footer: {
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
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
  },
  cancelButtonText: {
    ...typography.bodyBold,
    color: colors.textSecondary,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    ...typography.bodyBold,
    color: colors.surface,
  },
});
