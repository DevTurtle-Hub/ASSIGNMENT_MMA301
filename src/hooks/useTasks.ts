import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  TaskFilterStatus,
  TaskFilterPriority,
  TaskStats,
} from '../types/task';
import {
  subscribeTasks,
  createTask,
  updateTask,
  deleteTask,
  getTasks,
} from '../services/taskService';
import { isFirebaseConfigured } from '../services/firebase';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<TaskFilterStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskFilterPriority>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Subscribe to real-time updates
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeTasks(
      (newTasks) => {
        setTasks(newTasks);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('[useTasks] Subscription error:', err);
        setError(err.message || 'Failed to sync tasks with Firestore.');
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // Pull-to-refresh handler
  const refreshTasks = useCallback(async () => {
    setRefreshing(true);
    try {
      const freshTasks = await getTasks();
      setTasks(freshTasks);
      setError(null);
    } catch (err: any) {
      console.error('[useTasks] Refresh error:', err);
      setError(err.message || 'Failed to refresh tasks.');
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Filtered tasks computed property
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Status filter
      if (statusFilter !== 'all' && task.status !== statusFilter) {
        return false;
      }
      // Priority filter
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = task.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) return false;
      }
      return true;
    });
  }, [tasks, statusFilter, priorityFilter, searchQuery]);

  // Statistics
  const stats: TaskStats = useMemo(() => {
    return {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === 'todo').length,
      inProgress: tasks.filter((t) => t.status === 'in_progress').length,
      done: tasks.filter((t) => t.status === 'done').length,
    };
  }, [tasks]);

  // Create Task
  const handleCreateTask = useCallback(async (input: CreateTaskInput): Promise<boolean> => {
    try {
      await createTask(input);
      return true;
    } catch (err: any) {
      console.error('[useTasks] Create task error:', err);
      setError(err.message || 'Could not create task.');
      return false;
    }
  }, []);

  // Update Task
  const handleUpdateTask = useCallback(
    async (id: string, updates: UpdateTaskInput): Promise<boolean> => {
      try {
        await updateTask(id, updates);
        return true;
      } catch (err: any) {
        console.error('[useTasks] Update task error:', err);
        setError(err.message || 'Could not update task.');
        return false;
      }
    },
    []
  );

  // Delete Task
  const handleDeleteTask = useCallback(async (id: string): Promise<boolean> => {
    try {
      await deleteTask(id);
      return true;
    } catch (err: any) {
      console.error('[useTasks] Delete task error:', err);
      setError(err.message || 'Could not delete task.');
      return false;
    }
  }, []);

  // Toggle Status shortcut
  const handleToggleStatus = useCallback(
    async (task: Task): Promise<boolean> => {
      const nextStatusMap: Record<string, Task['status']> = {
        todo: 'in_progress',
        in_progress: 'done',
        done: 'todo',
      };
      const nextStatus = nextStatusMap[task.status] || 'todo';
      return handleUpdateTask(task.id, { status: nextStatus });
    },
    [handleUpdateTask]
  );

  return {
    tasks,
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
    isLiveFirestore: isFirebaseConfigured(),
  };
}
