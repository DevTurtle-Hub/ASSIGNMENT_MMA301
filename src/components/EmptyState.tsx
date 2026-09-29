import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../theme';

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
      {/* Soft Blue Rounded Square Icon */}
      <View style={styles.iconBox}>
        <Ionicons
          name={isFiltered ? 'search-outline' : 'clipboard-outline'}
          size={24}
          color="#2563EB"
        />
      </View>

      <Text style={styles.title}>
        {isFiltered ? 'No matching tasks' : 'No tasks found'}
      </Text>

      <Text style={styles.description}>
        {isFiltered
          ? 'Try adjusting your search keywords or switching filters to see other tasks.'
          : 'Get started by creating your first task using the form.'}
      </Text>

      <View style={styles.actions}>
        {isFiltered && onClearFilter ? (
          <TouchableOpacity
            onPress={onClearFilter}
            style={styles.btnSecondary}
            activeOpacity={0.7}
          >
            <Text style={styles.btnSecondaryText}>Reset Filters</Text>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          onPress={onCreateTask}
          style={styles.btnPrimary}
          activeOpacity={0.85}
        >
          <Text style={styles.btnPrimaryText}>Create Task</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4,
    textAlign: 'center',
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 18,
    maxWidth: 290,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  btnSecondary: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: borderRadius.sm,
    backgroundColor: '#F1F5F9',
  },
  btnSecondaryText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  btnPrimary: {
    backgroundColor: '#2563EB',
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: borderRadius.sm,
  },
  btnPrimaryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
