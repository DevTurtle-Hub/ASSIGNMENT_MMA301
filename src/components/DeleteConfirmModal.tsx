import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '../types/task';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';

interface DeleteConfirmModalProps {
  visible: boolean;
  task: Task | null;
  onClose: () => void;
  onConfirmDelete: (id: string) => Promise<boolean>;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  visible,
  task,
  onClose,
  onConfirmDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!task) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const success = await onConfirmDelete(task.id);
      if (success) {
        onClose();
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Warning Icon */}
          <View style={styles.iconCircle}>
            <Ionicons name="trash-outline" size={28} color={colors.danger} />
          </View>

          {/* Title & Message */}
          <Text style={styles.title}>Delete Task?</Text>
          <Text style={styles.message}>
            Are you sure you want to permanently delete{' '}
            <Text style={styles.taskTitleHighlight}>"{task.title}"</Text>? This action cannot be
            undone.
          </Text>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.cancelBtn}
              disabled={isDeleting}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDelete}
              style={[styles.deleteBtn, isDeleting && styles.deleteBtnDisabled]}
              disabled={isDeleting}
              activeOpacity={0.8}
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color={colors.surface} />
              ) : (
                <Text style={styles.deleteBtnText}>Delete</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    ...shadows.lg,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.dangerBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    fontSize: 20,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 20,
  },
  taskTitleHighlight: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelBtnText: {
    ...typography.bodyBold,
    color: colors.textSecondary,
  },
  deleteBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
    backgroundColor: colors.danger,
    alignItems: 'center',
    ...shadows.sm,
  },
  deleteBtnDisabled: {
    opacity: 0.6,
  },
  deleteBtnText: {
    ...typography.bodyBold,
    color: colors.surface,
  },
});
