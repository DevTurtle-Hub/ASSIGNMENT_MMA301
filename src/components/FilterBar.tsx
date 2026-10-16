import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TaskFilterStatus, TaskFilterPriority, TaskStats } from '../types/task';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: TaskFilterStatus;
  onStatusChange: (status: TaskFilterStatus) => void;
  priorityFilter: TaskFilterPriority;
  onPriorityChange: (priority: TaskFilterPriority) => void;
  stats: TaskStats;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  stats,
}) => {
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const statusOptions: { label: string; value: TaskFilterStatus; count: number }[] = [
    { label: 'All', value: 'all', count: stats.total },
    { label: 'To Do', value: 'todo', count: stats.todo },
    { label: 'In Progress', value: 'in_progress', count: stats.inProgress },
    { label: 'Done', value: 'done', count: stats.done },
  ];

  const priorityOptions: {
    label: string;
    value: TaskFilterPriority;
    color: string;
    bg: string;
    sublabel: string;
  }[] = [
    {
      label: 'All Priorities',
      value: 'all',
      color: '#64748B',
      bg: '#F8FAFC',
      sublabel: 'Show all tasks regardless of priority',
    },
    {
      label: 'High Priority',
      value: 'high',
      color: '#DC2626',
      bg: '#FEF2F2',
      sublabel: 'Urgent & critical team tasks',
    },
    {
      label: 'Medium Priority',
      value: 'medium',
      color: '#D97706',
      bg: '#FFFBEB',
      sublabel: 'Regular scheduled work',
    },
    {
      label: 'Low Priority',
      value: 'low',
      color: '#64748B',
      bg: '#F1F5F9',
      sublabel: 'Minor items & backlog',
    },
  ];

  const isPriorityFiltered = priorityFilter !== 'all';

  return (
    <View style={styles.container}>
      {/* Search Input Row with Compact Filter Button */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tasks..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={onSearchChange}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {Boolean(searchQuery) && (
            <TouchableOpacity
              onPress={() => onSearchChange('')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.clearBtn}
            >
              <Ionicons name="close-circle" size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Compact Filter Button */}
        <TouchableOpacity
          style={[
            styles.filterButton,
            isPriorityFiltered && styles.filterButtonActive,
          ]}
          onPress={() => setFilterModalVisible(true)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isPriorityFiltered ? 'funnel' : 'funnel-outline'}
            size={16}
            color={isPriorityFiltered ? '#2563EB' : '#475569'}
          />
          {isPriorityFiltered && <View style={styles.filterActiveDot} />}
        </TouchableOpacity>
      </View>

      {/* Status Segmented Tabs */}
      <View style={styles.segmentedContainer}>
        {statusOptions.map((item) => {
          const isSelected = statusFilter === item.value;
          return (
            <TouchableOpacity
              key={item.value}
              onPress={() => onStatusChange(item.value)}
              style={[
                styles.segmentItem,
                isSelected && styles.segmentItemActive,
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.segmentText,
                  isSelected && styles.segmentTextActive,
                ]}
              >
                {item.label}
              </Text>
              <View
                style={[
                  styles.countPill,
                  isSelected && styles.countPillActive,
                ]}
              >
                <Text
                  style={[
                    styles.countPillText,
                    isSelected && styles.countPillTextActive,
                  ]}
                >
                  {item.count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Filter Bottom Sheet / Modal */}
      <Modal
        visible={filterModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setFilterModalVisible(false)}
        >
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <Ionicons name="funnel" size={18} color="#2563EB" />
                <Text style={styles.modalTitle}>Filter by Priority</Text>
              </View>
              {isPriorityFiltered && (
                <TouchableOpacity
                  onPress={() => {
                    onPriorityChange('all');
                    setFilterModalVisible(false);
                  }}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.resetText}>Reset</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Options List */}
            <View style={styles.optionsList}>
              {priorityOptions.map((opt) => {
                const isSelected = priorityFilter === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    style={[
                      styles.optionItem,
                      isSelected && styles.optionItemActive,
                    ]}
                    onPress={() => {
                      onPriorityChange(opt.value);
                      setFilterModalVisible(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.optionDot, { backgroundColor: opt.color }]} />
                    <View style={styles.optionTextWrap}>
                      <Text
                        style={[
                          styles.optionLabel,
                          isSelected && styles.optionLabelActive,
                        ]}
                      >
                        {opt.label}
                      </Text>
                      <Text style={styles.optionSublabel}>{opt.sublabel}</Text>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={18} color="#2563EB" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#F8FAFC',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 4,
  },
  filterButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filterButtonActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  filterActiveDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#2563EB',
  },
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  segmentItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    paddingHorizontal: 4,
    borderRadius: 9,
    gap: 4,
  },
  segmentItemActive: {
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
    elevation: 2,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  segmentTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  countPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 8,
    minWidth: 16,
    alignItems: 'center',
  },
  countPillActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  countPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  countPillTextActive: {
    color: '#FFFFFF',
  },
  // Modal Bottom Sheet Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 18,
    paddingHorizontal: 20,
    paddingBottom: 32,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  resetText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#DC2626',
  },
  optionsList: {
    gap: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  optionItemActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  optionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  optionTextWrap: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  optionLabelActive: {
    color: '#1E40AF',
    fontWeight: '700',
  },
  optionSublabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
});
