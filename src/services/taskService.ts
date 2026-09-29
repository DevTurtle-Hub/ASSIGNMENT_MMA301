import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  Unsubscribe,
  Timestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { Task, CreateTaskInput, UpdateTaskInput } from '../types/task';
import { getTodayString, getFutureDateString } from '../utils/dateUtils';

const COLLECTION_NAME = 'tasks';

// Initial sample tasks for first-time use or demo preview
const INITIAL_DEMO_TASKS: Task[] = [
  {
    id: 'demo-task-1',
    title: 'Initialize Expo React Native Project',
    description: 'Scaffold project with TypeScript, configure ESLint, Prettier and folder structure.',
    status: 'done',
    priority: 'high',
    dueDate: getTodayString(),
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    teamId: null,
    assigneeId: null,
  },
  {
    id: 'demo-task-2',
    title: 'Configure Cloud Firestore Connection',
    description: 'Set up Firebase project, enable Firestore in test mode and configure service layer.',
    status: 'in_progress',
    priority: 'high',
    dueDate: getFutureDateString(1),
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    teamId: null,
    assigneeId: null,
  },
  {
    id: 'demo-task-3',
    title: 'Implement Task CRUD & Real-time Listeners',
    description: 'Build create, read, update, delete operations with onSnapshot live sync and modal forms.',
    status: 'in_progress',
    priority: 'medium',
    dueDate: getFutureDateString(3),
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    teamId: null,
    assigneeId: null,
  },
  {
    id: 'demo-task-4',
    title: 'Design Bottom Navigation & Placeholder Screens',
    description: 'Set up React Navigation tabs for Home, Teams (Exam 2) and Profile.',
    status: 'todo',
    priority: 'low',
    dueDate: getFutureDateString(5),
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    teamId: null,
    assigneeId: null,
  },
  {
    id: 'demo-task-5',
    title: 'Prepare Exam 1 Submission Report',
    description: 'Capture 11 full-screen screenshots, document ERD schema and push to GitHub repository.',
    status: 'todo',
    priority: 'high',
    dueDate: getFutureDateString(7),
    createdAt: new Date().toISOString(),
    teamId: null,
    assigneeId: null,
  },
];

// In-memory store used when Firestore is not configured or in fallback mode
let localMemoryTasks: Task[] = [...INITIAL_DEMO_TASKS];
const memoryListeners: Set<(tasks: Task[]) => void> = new Set();

const notifyMemoryListeners = () => {
  const sorted = [...localMemoryTasks].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  memoryListeners.forEach((listener) => listener(sorted));
};

/**
 * Subscribes to real-time updates for the tasks collection.
 * Uses Firestore `onSnapshot` when connected, or memory listener when in demo mode.
 */
export const subscribeTasks = (
  onNext: (tasks: Task[]) => void,
  onError?: (error: Error) => void
): Unsubscribe => {
  if (isFirebaseConfigured() && db) {
    try {
      const tasksRef = collection(db, COLLECTION_NAME);
      const q = query(tasksRef, orderBy('createdAt', 'desc'));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const tasks: Task[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            tasks.push({
              id: docSnap.id,
              title: data.title || '',
              description: data.description || '',
              status: data.status || 'todo',
              priority: data.priority || 'medium',
              dueDate: data.dueDate || '',
              createdAt:
                data.createdAt instanceof Timestamp
                  ? data.createdAt.toDate().toISOString()
                  : data.createdAt || new Date().toISOString(),
              teamId: data.teamId ?? null,
              assigneeId: data.assigneeId ?? null,
            });
          });
          onNext(tasks);
        },
        (error) => {
          console.error('[taskService] Firestore onSnapshot error:', error);
          if (onError) onError(error);
          // Graceful fallback to memory tasks on error
          onNext(localMemoryTasks);
        }
      );

      return unsubscribe;
    } catch (err) {
      console.warn('[taskService] Falling back to memory subscriber due to error:', err);
    }
  }

  // Fallback to local memory listener
  memoryListeners.add(onNext);
  onNext([...localMemoryTasks]);

  return () => {
    memoryListeners.delete(onNext);
  };
};

/**
 * Creates a new task in Firestore or memory store.
 */
export const createTask = async (input: CreateTaskInput): Promise<Task> => {
  const nowIso = new Date().toISOString();
  const newTaskData = {
    title: input.title.trim(),
    description: (input.description || '').trim(),
    status: input.status || 'todo',
    priority: input.priority || 'medium',
    dueDate: input.dueDate || getTodayString(),
    createdAt: input.createdAt || nowIso,
    teamId: input.teamId ?? null,
    assigneeId: input.assigneeId ?? null,
  };

  if (isFirebaseConfigured() && db) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), newTaskData);
      return {
        id: docRef.id,
        ...newTaskData,
      };
    } catch (err) {
      console.error('[taskService] Error adding document to Firestore:', err);
      throw err;
    }
  }

  // Memory mode
  const generatedId = `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const createdTask: Task = {
    id: generatedId,
    ...newTaskData,
  };
  localMemoryTasks.unshift(createdTask);
  notifyMemoryListeners();
  return createdTask;
};

/**
 * Updates an existing task by document ID.
 */
export const updateTask = async (id: string, updates: UpdateTaskInput): Promise<void> => {
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, { ...updates });
      return;
    } catch (err) {
      console.error('[taskService] Error updating document in Firestore:', err);
      throw err;
    }
  }

  // Memory mode
  const index = localMemoryTasks.findIndex((t) => t.id === id);
  if (index !== -1) {
    localMemoryTasks[index] = {
      ...localMemoryTasks[index],
      ...updates,
    };
    notifyMemoryListeners();
  }
};

/**
 * Deletes a task by document ID.
 */
export const deleteTask = async (id: string): Promise<void> => {
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
      return;
    } catch (err) {
      console.error('[taskService] Error deleting document from Firestore:', err);
      throw err;
    }
  }

  // Memory mode
  localMemoryTasks = localMemoryTasks.filter((t) => t.id !== id);
  notifyMemoryListeners();
};

/**
 * Retrieves all tasks (one-time fetch).
 */
export const getTasks = async (): Promise<Task[]> => {
  if (isFirebaseConfigured() && db) {
    try {
      const snapshot = await getDocs(
        query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'))
      );
      return snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Task, 'id'>),
      }));
    } catch (err) {
      console.error('[taskService] Error getting tasks from Firestore:', err);
      return localMemoryTasks;
    }
  }

  return [...localMemoryTasks];
};
