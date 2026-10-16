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
import { Team, TeamMember } from '../types/team';
import { useAuth } from '../contexts/AuthContext';
import { subscribeUserTeams, subscribeTeamMembers } from '../services/teamService';
import { colors, spacing, borderRadius, shadows } from '../theme';
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
  const { user } = useAuth();
  const isEditing = Boolean(taskToEdit);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState(getTodayString());

  // Team & Assignee states (Functional Requirement 3)
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [selectedTeamName, setSelectedTeamName] = useState<string | null>(null);
  const [selectedAssigneeId, setSelectedAssigneeId] = useState<string | null>(null);
  const [selectedAssigneeName, setSelectedAssigneeName] = useState<string | null>(null);

  const [userTeams, setUserTeams] = useState<Team[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  const [titleError, setTitleError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load user teams
  useEffect(() => {
    if (!visible || !user) return;
    const unsubTeams = subscribeUserTeams(user.id, (teams) => {
      setUserTeams(teams);
    });
    return () => unsubTeams();
  }, [visible, user]);

  // Load members of selected team
  useEffect(() => {
    if (!selectedTeamId) {
      setTeamMembers([]);
      return;
    }
    const unsubMembers = subscribeTeamMembers(selectedTeamId, (members) => {
      setTeamMembers(members);
    });
    return () => unsubMembers();
  }, [selectedTeamId]);

  useEffect(() => {
    if (visible) {
      if (taskToEdit) {
        setTitle(taskToEdit.title);
        setDescription(taskToEdit.description || '');
        setStatus(taskToEdit.status);
        setPriority(taskToEdit.priority);
        setDueDate(taskToEdit.dueDate || getTodayString());
        setSelectedTeamId(taskToEdit.teamId || null);
        setSelectedTeamName(taskToEdit.teamName || null);
        setSelectedAssigneeId(taskToEdit.assigneeId || null);
        setSelectedAssigneeName(taskToEdit.assigneeName || null);
      } else {
        setTitle('');
        setDescription('');
        setStatus('todo');
        setPriority('medium');
        setDueDate(getTodayString());
        setSelectedTeamId(null);
        setSelectedTeamName(null);
        setSelectedAssigneeId(null);
        setSelectedAssigneeName(null);
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
      const payload = {
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        dueDate,
        teamId: selectedTeamId,
        teamName: selectedTeamName,
        assigneeId: selectedAssigneeId,
        assigneeName: selectedAssigneeName,
      };

      if (isEditing && taskToEdit) {
        const success = await onSubmitUpdate(taskToEdit.id, payload);
        if (success) onClose();
      } else {
        const success = await onSubmitCreate(payload);
        if (success) onClose();
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
    { label: '+1 Wk', value: getFutureDateString(7) },
  ];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.card}>
          {/* Top Purple-to-Cyan Accent Stripe */}
          <View style={styles.gradientStripe} />

          {/* Modal Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <View style={styles.iconBox}>
                <Ionicons
                  name={isEditing ? 'create-outline' : 'add'}
                  size={18}
                  color="#2563EB"
                />
              </View>
              <Text style={styles.headerTitle}>
                {isEditing ? 'Edit Task' : 'Create New Task'}
              </Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.closeBtn}
            >
              <Ionicons name="close" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.formBody}
          >
            {/* TITLE Field */}
            <View style={styles.formGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.inputLabel}>TITLE</Text>
                <Text style={styles.asterisk}>*</Text>
              </View>
              <TextInput
                style={[styles.input, Boolean(titleError) && styles.inputError]}
                placeholder="e.g. Design team dashboard architecture"
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
                  <Ionicons name="alert-circle" size={12} color={colors.danger} />
                  <Text style={styles.errorMsg}>{titleError}</Text>
                </View>
              )}
            </View>

            {/* DESCRIPTION Field */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>DESCRIPTION</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add relevant context, checklist, or deliverables..."
                placeholderTextColor={colors.textMuted}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* TEAM SELECTION Field (Requirement 3) */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>ASSIGN TO TEAM</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedTeamId(null);
                    setSelectedTeamName(null);
                    setSelectedAssigneeId(null);
                    setSelectedAssigneeName(null);
                  }}
                  style={[
                    styles.selectPillHorizontal,
                    selectedTeamId === null && styles.selectPillActive,
                  ]}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="person-outline"
                    size={12}
                    color={selectedTeamId === null ? colors.primary : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.selectPillText,
                      selectedTeamId === null && styles.selectPillTextActive,
                    ]}
                  >
                    Personal (No Team)
                  </Text>
                </TouchableOpacity>

                {userTeams.map((t) => {
                  const isSelected = selectedTeamId === t.id;
                  return (
                    <TouchableOpacity
                      key={t.id}
                      onPress={() => {
                        setSelectedTeamId(t.id);
                        setSelectedTeamName(t.name);
                        // Reset assignee when switching teams
                        setSelectedAssigneeId(null);
                        setSelectedAssigneeName(null);
                      }}
                      style={[
                        styles.selectPillHorizontal,
                        isSelected && styles.selectPillActive,
                      ]}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name="people"
                        size={12}
                        color={isSelected ? colors.primary : colors.textSecondary}
                      />
                      <Text
                        style={[
                          styles.selectPillText,
                          isSelected && styles.selectPillTextActive,
                        ]}
                      >
                        {t.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* ASSIGNEE SELECTION Field (Requirement 3 - when a team is selected) */}
            {Boolean(selectedTeamId) && (
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>ASSIGNEE (TEAM MEMBER)</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedAssigneeId(null);
                      setSelectedAssigneeName(null);
                    }}
                    style={[
                      styles.selectPillHorizontal,
                      selectedAssigneeId === null && styles.selectPillActive,
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.selectPillText,
                        selectedAssigneeId === null && styles.selectPillTextActive,
                      ]}
                    >
                      Unassigned
                    </Text>
                  </TouchableOpacity>

                  {teamMembers.map((m) => {
                    const isSelected = selectedAssigneeId === m.userId;
                    return (
                      <TouchableOpacity
                        key={m.userId}
                        onPress={() => {
                          setSelectedAssigneeId(m.userId);
                          setSelectedAssigneeName(m.userName || m.userEmail);
                        }}
                        style={[
                          styles.selectPillHorizontal,
                          isSelected && styles.selectPillActive,
                        ]}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name="person"
                          size={12}
                          color={isSelected ? colors.primary : colors.textSecondary}
                        />
                        <Text
                          style={[
                            styles.selectPillText,
                            isSelected && styles.selectPillTextActive,
                          ]}
                        >
                          {m.userName || m.userEmail}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            )}

            {/* STATUS Selector */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>STATUS</Text>
              <View style={styles.optionRow}>
                {statusList.map((item) => {
                  const isSelected = status === item.value;
                  return (
                    <TouchableOpacity
                      key={item.value}
                      onPress={() => setStatus(item.value)}
                      style={[
                        styles.selectPill,
                        isSelected && styles.selectPillActive,
                      ]}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.selectPillText,
                          isSelected && styles.selectPillTextActive,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* PRIORITY Selector */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>PRIORITY</Text>
              <View style={styles.optionRow}>
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
                          backgroundColor: '#FFFFFF',
                        },
                      ]}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.priorityDot, { backgroundColor: item.color }]} />
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

            {/* DUE DATE Field */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>DUE DATE</Text>
              <View style={styles.dateInputWrapper}>
                <TextInput
                  style={styles.dateInput}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.textMuted}
                  value={dueDate}
                  onChangeText={setDueDate}
                />
                <Ionicons name="calendar-outline" size={16} color={colors.textMuted} />
              </View>

              <View style={styles.quickDateRow}>
                {quickDates.map((item) => {
                  const isSelected = dueDate === item.value;
                  return (
                    <TouchableOpacity
                      key={item.label}
                      onPress={() => setDueDate(item.value)}
                      style={[
                        styles.quickDateBtn,
                        isSelected && styles.quickDateBtnActive,
                      ]}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.quickDateText,
                          isSelected && styles.quickDateTextActive,
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

          {/* Footer with Gradient-styled Create Button */}
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
              style={[styles.gradientButton, isSubmitting && styles.btnDisabled]}
              disabled={isSubmitting}
              activeOpacity={0.85}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.gradientButtonText}>
                  {isEditing ? 'Save Changes' : 'Create Task'}
                </Text>
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    width: '100%',
    maxHeight: '90%',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.lg,
  },
  gradientStripe: {
    height: 4,
    backgroundColor: colors.cyan,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.sm,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  closeBtn: {
    padding: 4,
  },
  formBody: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  formGroup: {
    gap: 4,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  asterisk: {
    color: colors.primary,
    fontWeight: '700',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: borderRadius.sm + 2,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: colors.textPrimary,
  },
  inputError: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerBg,
  },
  textArea: {
    minHeight: 60,
    paddingTop: 8,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  errorMsg: {
    fontSize: 11,
    color: colors.danger,
    fontWeight: '600',
  },
  horizontalScroll: {
    flexDirection: 'row',
    marginVertical: 2,
  },
  selectPillHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#F8FAFC',
    marginRight: 6,
    gap: 4,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 6,
  },
  selectPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#F8FAFC',
    gap: 4,
  },
  selectPillActive: {
    backgroundColor: '#EFF6FF',
    borderColor: colors.primary,
  },
  selectPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  selectPillTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dateInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: borderRadius.sm + 2,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    height: 38,
  },
  dateInput: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  quickDateRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 3,
  },
  quickDateBtn: {
    flex: 1,
    paddingVertical: 4,
    borderRadius: borderRadius.xs,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  quickDateBtnActive: {
    backgroundColor: '#EFF6FF',
  },
  quickDateText: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  quickDateTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: '#F8FAFC',
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: spacing.md,
  },
  cancelButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  gradientButton: {
    backgroundColor: colors.primary,
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: borderRadius.sm + 2,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  gradientButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
