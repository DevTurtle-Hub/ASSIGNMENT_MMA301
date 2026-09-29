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
      if (success) onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.dialogCard}>
          <View style={styles.iconCircle}>
            <Ionicons name="trash" size={26} color={colors.danger} />
          </View>

          <Text style={styles.dialogTitle}>Delete Task?</Text>
          <Text style={styles.dialogMessage}>
            Are you sure you want to delete{' '}
            <Text style={styles.highlightText}>"{task.title}"</Text>? This action will remove the
            document from Cloud Firestore.
          </Text>

          <View style={styles.btnRow}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.btnCancel}
              disabled={isDeleting}
            >
              <Text style={styles.btnCancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDelete}
              style={[styles.btnDelete, isDeleting && styles.btnDeleteDisabled]}
              disabled={isDeleting}
              activeOpacity={0.8}
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.btnDeleteText}>Delete</Text>
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
  dialogCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    ...shadows.lg,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.dangerBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
  },
  dialogTitle: {
    ...typography.h2,
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  dialogMessage: {
    ...typography.body,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 19,
  },
  highlightText: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  btnRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    width: '100%',
  },
  btnCancel: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnCancelText: {
    ...typography.bodyBold,
    color: colors.textSecondary,
    fontSize: 13,
  },
  btnDelete: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: borderRadius.md,
    backgroundColor: colors.danger,
    alignItems: 'center',
  },
  btnDeleteDisabled: {
    opacity: 0.6,
  },
  btnDeleteText: {
    ...typography.bodyBold,
    color: '#FFFFFF',
    fontSize: 13,
  },
});
