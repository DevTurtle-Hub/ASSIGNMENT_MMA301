import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../theme';

interface EmptyStateProps {
  isFiltered: boolean;
  onClearFilter?: () => void;
  onCreateTask: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  isFiltered,
  onClearFilter,
  onCreateTask,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.iconCircle}>
        <Ionicons
          name={isFiltered ? 'search' : 'sparkles'}
          size={32}
          color={colors.primary}
        />
      </View>

      <Text style={styles.title}>
        {isFiltered ? 'No matching tasks' : 'No tasks in this view'}
      </Text>

      <Text style={styles.description}>
        {isFiltered
          ? 'Try adjusting your search keywords or switching filters to see other tasks.'
          : 'Create your first task to start organizing your workflow with Cloud Firestore!'}
      </Text>

      <View style={styles.actions}>
        {isFiltered && onClearFilter ? (
          <TouchableOpacity
            onPress={onClearFilter}
            style={styles.btnSecondary}
            activeOpacity={0.7}
          >
            <Ionicons name="refresh" size={15} color={colors.textSecondary} />
            <Text style={styles.btnSecondaryText}>Reset Filters</Text>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          onPress={onCreateTask}
          style={styles.btnPrimary}
          activeOpacity={0.85}
        >
          <Ionicons name="add-circle" size={17} color="#FFFFFF" />
          <Text style={styles.btnPrimaryText}>Add Task</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  title: {
    ...typography.h3,
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 4,
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 18,
    maxWidth: 280,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  btnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 9,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnSecondaryText: {
    ...typography.bodyBold,
    color: colors.textSecondary,
    fontSize: 12,
  },
  btnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingVertical: 9,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
  },
  btnPrimaryText: {
    ...typography.bodyBold,
    color: '#FFFFFF',
    fontSize: 12,
  },
});
