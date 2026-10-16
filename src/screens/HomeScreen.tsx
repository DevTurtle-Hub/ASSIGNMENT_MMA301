import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Text,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTasks } from '../hooks/useTasks';
import { Header } from '../components/Header';
import { FilterBar } from '../components/FilterBar';
import { TaskCard } from '../components/TaskCard';
import { TaskModal } from '../components/TaskModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { EmptyState } from '../components/EmptyState';
import { Task } from '../types/task';

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

  // Delete modal states
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const openCreateModal = () => {
    setEditingTask(null);
    setModalVisible(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setModalVisible(true);
  };

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

  const renderHeader = () => (
    <View>
      {/* App Header with TF Brand, Stats & Live Connection Status */}
      <Header stats={stats} isLive={isLiveFirestore} />

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

      {/* Error Banner if any */}
      {Boolean(error) && (
        <View style={styles.errorBanner}>
          <Ionicons name="warning-outline" size={16} color="#DC2626" />
          <Text style={styles.errorBannerText}>{error}</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.container}>
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={styles.loadingText}>Syncing tasks with Cloud Firestore...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredTasks}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={renderHeader}
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
                colors={['#2563EB']}
                tintColor="#2563EB"
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

        {/* Floating Action Button (FAB) */}
        <TouchableOpacity
          style={styles.fab}
          onPress={openCreateModal}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={26} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Create / Edit Modal */}
        <TaskModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSubmitCreate={handleCreateTask}
          onSubmitUpdate={handleUpdateTask}
          taskToEdit={editingTask}
        />

        {/* Delete Modal */}
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
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  listContent: {
    paddingBottom: 110,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '500',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    marginHorizontal: 20,
    marginVertical: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  errorBannerText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
});
