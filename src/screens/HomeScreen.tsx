import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Text,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTasks } from '../hooks/useTasks';
import { Header } from '../components/Header';
import { FilterBar } from '../components/FilterBar';
import { TaskCard } from '../components/TaskCard';
import { TaskModal } from '../components/TaskModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { EmptyState } from '../components/EmptyState';
import { Task } from '../types/task';
import { colors, spacing, borderRadius, shadows } from '../theme';

export const HomeScreen: React.FC = () => {
  const {
    filteredTasks,
    stats,
    loading,
    refreshing,
    error,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    searchQuery,
    setSearchQuery,
    refreshTasks,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask,
    handleToggleStatus,
    isLiveFirestore,
  } = useTasks();

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Delete confirmation states
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // Open Create Modal
  const openCreateModal = () => {
    setEditingTask(null);
    setModalVisible(true);
  };

  // Open Edit Modal
  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setModalVisible(true);
  };

  // Open Delete Confirmation
  const openDeleteModal = (task: Task) => {
    setTaskToDelete(task);
    setDeleteModalVisible(true);
  };

  const isFiltered =
    statusFilter !== 'all' || priorityFilter !== 'all' || searchQuery.trim().length > 0;

  const handleResetFilters = () => {
    setStatusFilter('all');
    setPriorityFilter('all');
    setSearchQuery('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <View style={styles.container}>
        {/* Header with App Info & Statistics */}
        <Header stats={stats} isLiveFirestore={isLiveFirestore} />

        {/* Search & Filter Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          priorityFilter={priorityFilter}
          onPriorityChange={setPriorityFilter}
          stats={stats}
        />

        {/* Error Notification Banner if any */}
        {Boolean(error) && (
          <View style={styles.errorBanner}>
            <Ionicons name="warning-outline" size={16} color={colors.danger} />
            <Text style={styles.errorBannerText}>{error}</Text>
          </View>
        )}

        {/* Task List */}
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Syncing tasks with Firestore...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredTasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TaskCard
                task={item}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
                onToggleStatus={handleToggleStatus}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={refreshTasks}
                colors={[colors.primary]}
                tintColor={colors.primary}
              />
            }
            ListEmptyComponent={
              <EmptyState
                isFiltered={isFiltered}
                onClearFilter={handleResetFilters}
                onCreateTask={openCreateModal}
              />
            }
          />
        )}

        {/* Floating Action Button (FAB) to Add Task */}
        <TouchableOpacity
          style={styles.fab}
          onPress={openCreateModal}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={28} color={colors.surface} />
        </TouchableOpacity>

        {/* Create / Edit Task Modal */}
        <TaskModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSubmitCreate={handleCreateTask}
          onSubmitUpdate={handleUpdateTask}
          taskToEdit={editingTask}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          visible={deleteModalVisible}
          task={taskToDelete}
          onClose={() => {
            setDeleteModalVisible(false);
            setTaskToDelete(null);
          }}
          onConfirmDelete={handleDeleteTask}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingTop: spacing.xs,
    paddingBottom: 90, // Extra space for FAB and Bottom Bar
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dangerBg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  errorBannerText: {
    color: colors.dangerDark,
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: spacing.xl,
    bottom: spacing.xxl,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.lg,
  },
});
