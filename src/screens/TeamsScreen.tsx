import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';

export const TeamsScreen: React.FC = () => {
  const upcomingFeatures = [
    {
      icon: 'people' as const,
      color: colors.primary,
      bg: colors.primaryLight,
      title: 'Team Workspaces',
      description: 'Create and organize dedicated spaces for project squads with member permissions.',
    },
    {
      icon: 'person-add' as const,
      color: colors.secondary,
      bg: colors.secondaryLight,
      title: 'Task Assignment (assigneeId)',
      description: 'Assign tasks to specific team members utilizing the pre-built assigneeId schema.',
    },
    {
      icon: 'git-branch' as const,
      color: colors.accentAmber,
      bg: colors.accentAmberLight,
      title: 'Multi-tenant Teams (teamId)',
      description: 'Filter and partition task boards by team workspaces effortlessly.',
    },
    {
      icon: 'stats-chart' as const,
      color: colors.primary,
      bg: colors.primaryLight,
      title: 'Workload & Velocity Analytics',
      description: 'Track team sprint progress, completed milestones, and distribution in real-time.',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.badge}>
            <Ionicons name="sparkles" size={12} color={colors.primaryDark} />
            <Text style={styles.badgeText}>PRACTICAL EXAM 2 PREVIEW</Text>
          </View>

          <View style={styles.iconCircle}>
            <Ionicons name="people" size={36} color="#FFFFFF" />
          </View>

          <Text style={styles.heroTitle}>Teams & Collaboration</Text>
          <Text style={styles.heroSubtitle}>
            Collaborative team workspaces, member roles, and task assignment will be built in Practical Exam 2.
          </Text>
        </View>

        {/* Firestore Model Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="hardware-chip-outline" size={17} color={colors.secondaryDark} />
            <Text style={styles.infoTitle}>Firestore Schema Ready</Text>
          </View>
          <Text style={styles.infoDescription}>
            The <Text style={styles.codeText}>tasks</Text> collection in Firestore already contains schema fields for{' '}
            <Text style={styles.codeText}>teamId</Text> and{' '}
            <Text style={styles.codeText}>assigneeId</Text> for rapid Exam 2 expansion.
          </Text>
        </View>

        {/* Feature Highlights */}
        <Text style={styles.sectionHeader}>Upcoming Roadmap</Text>

        <View style={styles.featuresList}>
          {upcomingFeatures.map((item, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={[styles.featureIconBox, { backgroundColor: item.bg }]}>
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>{item.title}</Text>
                <Text style={styles.featureDescription}>{item.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.lg,
    paddingBottom: 80,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  badgeText: {
    ...typography.small,
    fontSize: 10,
    color: colors.primaryDark,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  heroTitle: {
    ...typography.h1,
    fontSize: 20,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  heroSubtitle: {
    ...typography.body,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
  },
  infoCard: {
    backgroundColor: colors.secondaryLight,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.secondaryBorder,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  infoTitle: {
    ...typography.h3,
    fontSize: 14,
    color: colors.secondaryDark,
  },
  infoDescription: {
    ...typography.body,
    color: colors.textPrimary,
    fontSize: 12,
    lineHeight: 18,
  },
  codeText: {
    fontWeight: '700',
    color: colors.secondaryDark,
  },
  sectionHeader: {
    ...typography.h3,
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  featuresList: {
    gap: spacing.sm,
  },
  featureItem: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: spacing.md,
    ...shadows.sm,
  },
  featureIconBox: {
    width: 42,
    height: 42,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    fontSize: 13,
    marginBottom: 2,
  },
  featureDescription: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
});
