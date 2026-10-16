import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TaskStats } from '../types/task';

interface HeaderProps {
  stats: TaskStats;
  isLive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isLive = false }) => {
  return (
    <View style={styles.container}>
      {/* Top Navbar */}
      <View style={styles.navBar}>
        {/* Brand Logo & Name (Consistent with Login) */}
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Ionicons name="checkbox" size={18} color="#FFFFFF" />
          </View>
          <Text style={styles.brandName}>
            Task<Text style={styles.brandNameAccent}>Flow</Text>
          </Text>
        </View>

        {/* Live sync pill */}
        <View style={styles.statusPill}>
          <View style={[styles.statusDot, isLive ? styles.statusDotLive : styles.statusDotDemo]} />
          <Text style={styles.statusText}>{isLive ? 'Cloud Synced' : 'Offline'}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  brandNameAccent: {
    color: '#2563EB',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusDotLive: {
    backgroundColor: '#16A34A',
  },
  statusDotDemo: {
    backgroundColor: '#94A3B8',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
});
