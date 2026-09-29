import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '../theme';

export const TeamsScreen: React.FC = () => {
  const upcomingFeatures = [
    {
      icon: 'people' as const,
      color: '#2563EB',
      bg: '#EFF6FF',
      title: 'Team Workspaces',
      description: 'Create and organize dedicated spaces for project squads with member permissions.',
    },
    {
      icon: 'person-add' as const,
      color: '#00C5FF',
      bg: '#E0F2FE',
      title: 'Task Assignment (assigneeId)',
      description: 'Assign tasks to specific team members utilizing the pre-built assigneeId schema.',
    },
    {
      icon: 'git-branch' as const,
      color: '#EA580C',
      bg: '#FFF7ED',
      title: 'Multi-tenant Teams (teamId)',
      description: 'Filter and partition task boards by team workspaces effortlessly.',
    },
    {
      icon: 'stats-chart' as const,
      color: '#16A34A',
      bg: '#F0FDF4',
      title: 'Workload & Velocity Analytics',
      description: 'Track team sprint progress, completed milestones, and distribution in real-time.',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.badge}>
            <Ionicons name="sparkles" size={12} color="#2563EB" />
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
            <Ionicons name="hardware-chip-outline" size={17} color="#0284C7" />
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
    backgroundColor: '#FFFFFF',
  },
  container: {
    padding: spacing.lg,
    paddingBottom: 80,
    backgroundColor: colors.background,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
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
    backgroundColor: '#EFF6FF',
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  badgeText: {
    fontSize: 10,
    color: '#2563EB',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  infoCard: {
    backgroundColor: '#E0F2FE',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0284C7',
  },
  infoDescription: {
    color: colors.textPrimary,
    fontSize: 12,
    lineHeight: 18,
  },
  codeText: {
    fontWeight: '700',
    color: '#0284C7',
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  featuresList: {
    gap: spacing.sm,
  },
  featureItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: spacing.md,
    ...shadows.sm,
  },
  featureIconBox: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
});
