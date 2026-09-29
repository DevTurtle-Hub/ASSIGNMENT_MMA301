import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../theme';
import { TaskStats } from '../types/task';

interface HeaderProps {
  stats: TaskStats;
}

// Letter-by-letter smooth Blue to Electric Cyan gradient mapping matching the reference image
const GRADIENT_MANAGEMENT = [
  { char: 'M', color: '#2563EB' },
  { char: 'a', color: '#246EF0' },
  { char: 'n', color: '#1D7DF4' },
  { char: 'a', color: '#128DF9' },
  { char: 'g', color: '#079CFD' },
  { char: 'e', color: '#00ABFF' },
  { char: 'm', color: '#00BAFF' },
  { char: 'e', color: '#00C8FF' },
  { char: 'n', color: '#00D6FF' },
  { char: 't', color: '#00E5FF' },
];

export const Header: React.FC<HeaderProps> = ({ stats }) => {
  return (
    <View style={styles.container}>
      {/* Top Navbar */}
      <View style={styles.navBar}>
        {/* Logo: TF Task Flow */}
        <View style={styles.brandRow}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>TF</Text>
          </View>
          <Text style={styles.brandTask}>
            Task <Text style={styles.brandFlow}>Flow</Text>
          </Text>
        </View>

        {/* Right side: Clean Home Pill */}
        <View style={styles.homePill}>
          <Text style={styles.homePillText}>Home</Text>
        </View>
      </View>

      {/* Hero Banner Section */}
      <View style={styles.heroSection}>
        {/* Pill Tag */}
        <View style={styles.tagPill}>
          <View style={styles.tagDot} />
          <Text style={styles.tagText}>Technical Foundation • Assignment 1</Text>
        </View>

        {/* Big Heading: Task & Team Management with Smooth Gradient */}
        <Text style={styles.heroHeadline}>
          Task & Team{' '}
          {GRADIENT_MANAGEMENT.map((item, index) => (
            <Text key={index} style={{ color: item.color }}>
              {item.char}
            </Text>
          ))}
        </Text>

        {/* Subtitle */}
        <Text style={styles.heroSubtitle}>
          Orchestrate workflows with ease. Powered by Expo React Native, TypeScript, and Firebase Cloud Firestore.
        </Text>
      </View>

      {/* 3 Stats Cards Row (Matching Reference UI) */}
      <View style={styles.statsContainer}>
        {/* TO DO Card */}
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>TO DO</Text>
          <Text style={[styles.statCount, { color: colors.statTodo }]}>{stats.todo}</Text>
        </View>

        {/* IN PROGRESS Card */}
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>IN PROGRESS</Text>
          <Text style={[styles.statCount, { color: colors.statInProgress }]}>
            {stats.inProgress}
          </Text>
        </View>

        {/* COMPLETED Card */}
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>COMPLETED</Text>
          <Text style={[styles.statCount, { color: colors.statCompleted }]}>{stats.done}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.md + 2,
    paddingTop: spacing.xs,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm + 2,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  logoBox: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm + 2,
    borderWidth: 1.5,
    borderColor: '#93C5FD',
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2563EB',
    letterSpacing: -0.5,
  },
  brandTask: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  brandFlow: {
    color: '#00C5FF',
  },
  homePill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: borderRadius.md,
    backgroundColor: '#EFF6FF',
  },
  homePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  heroSection: {
    marginBottom: spacing.sm + 2,
  },
  tagPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    marginBottom: 4,
    gap: 5,
  },
  tagDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#00C5FF',
  },
  tagText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#2563EB',
  },
  heroHeadline: {
    fontSize: 21,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  heroSubtitle: {
    fontSize: 11.5,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.xs + 2,
    marginTop: 2,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.md,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  statTitle: {
    fontSize: 9.5,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.4,
    marginBottom: 1,
  },
  statCount: {
    fontSize: 20,
    fontWeight: '800',
  },
});
