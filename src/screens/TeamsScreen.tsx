import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';

export const TeamsScreen: React.FC = () => {
  const upcomingFeatures = [
    {
      icon: 'people-outline' as const,
      title: 'Team Workspaces',
      description: 'Create and manage cross-functional teams with role-based member permissions.',
    },
    {
      icon: 'person-add-outline' as const,
      title: 'Task Assignment',
      description: 'Assign tasks directly to team members using the assigneeId Firestore field.',
    },
    {
      icon: 'chatbubbles-outline' as const,
      title: 'Team Collaboration & Comments',
      description: 'Leave comments, updates, and attachments directly on assigned team tasks.',
    },
    {
      icon: 'analytics-outline' as const,
      title: 'Team Analytics & Workload',
      description: 'Track team velocity, workload distribution, and milestone completion rates.',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Section */}
        <View style={styles.heroCard}>
          <View style={styles.badge}>
            <Ionicons name="sparkles" size={13} color={colors.primaryDark} />
            <Text style={styles.badgeText}>PRACTICAL EXAM 2</Text>
          </View>

          <View style={styles.iconCircle}>
            <Ionicons name="people" size={38} color={colors.primary} />
          </View>

          <Text style={styles.heroTitle}>Teams & Collaboration</Text>
          <Text style={styles.heroSubtitle}>
            Team workspaces, member roles, and task assignment features are coming soon in Practical Exam 2!
          </Text>
        </View>

        {/* Firestore Model Integration Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="layers-outline" size={18} color={colors.primary} />
            <Text style={styles.infoTitle}>Firestore Data Model Ready</Text>
          </View>
          <Text style={styles.infoDescription}>
            The current Firestore <Text style={styles.codeText}>tasks</Text> collection schema already includes placeholder fields for{' '}
            <Text style={styles.codeText}>teamId</Text> and{' '}
            <Text style={styles.codeText}>assigneeId</Text>, ready for seamless integration.
          </Text>
        </View>

        {/* Upcoming Features Section */}
        <Text style={styles.sectionHeader}>Upcoming Features</Text>

        <View style={styles.featuresList}>
          {upcomingFeatures.map((item, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.featureIconBox}>
                <Ionicons name={item.icon} size={22} color={colors.primary} />
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
  },
  badgeText: {
    ...typography.small,
    fontSize: 10,
    color: colors.primaryDark,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  iconCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  heroTitle: {
    ...typography.h1,
    fontSize: 22,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  heroSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  infoTitle: {
    ...typography.h3,
    fontSize: 15,
    color: colors.primaryDark,
  },
  infoDescription: {
    ...typography.body,
    color: colors.textPrimary,
    fontSize: 13,
    lineHeight: 19,
  },
  codeText: {
    fontWeight: '700',
    color: colors.primaryDark,
  },
  sectionHeader: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  featuresList: {
    gap: spacing.md,
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
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceSubtle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  featureDescription: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 16,
  },
});
