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
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons
          name={isFiltered ? 'search-outline' : 'sparkles-outline'}
          size={36}
          color={colors.primary}
        />
      </View>

      <Text style={styles.title}>
        {isFiltered ? 'No Matching Tasks Found' : 'No Tasks Yet'}
      </Text>

      <Text style={styles.description}>
        {isFiltered
          ? 'Try adjusting your search query or filter settings to find what you are looking for.'
          : 'Get started by creating your first task. It will automatically sync with Firebase Firestore!'}
      </Text>

      <View style={styles.buttonRow}>
        {isFiltered && onClearFilter ? (
          <TouchableOpacity
            onPress={onClearFilter}
            style={styles.secondaryButton}
            activeOpacity={0.7}
          >
            <Ionicons name="refresh-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.secondaryButtonText}>Reset Filters</Text>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          onPress={onCreateTask}
          style={styles.primaryButton}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle-outline" size={18} color={colors.surface} />
          <Text style={styles.primaryButtonText}>Create Task</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xxl,
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    ...typography.bodyBold,
    color: colors.textSecondary,
    fontSize: 13,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
  },
  primaryButtonText: {
    ...typography.bodyBold,
    color: colors.surface,
    fontSize: 13,
  },
});
