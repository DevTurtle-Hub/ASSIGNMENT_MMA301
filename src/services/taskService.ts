import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
  orderBy,
  Unsubscribe,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { Task, CreateTaskInput, UpdateTaskInput } from '../types/task';
import { getTodayString } from '../utils/dateUtils';

const COLLECTION_NAME = 'tasks';

/**
 * Subscribes to real-time updates for the tasks collection directly from Cloud Firestore.
 */
export const subscribeTasks = (
  onNext: (tasks: Task[]) => void,
  onError?: (error: Error) => void
): Unsubscribe => {
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
            teamName: data.teamName ?? null,
            assigneeName: data.assigneeName ?? null,
          });
        });
        onNext(tasks);
      },
      (error) => {
        console.error('[taskService] Firestore onSnapshot error:', error);
        if (onError) onError(error);
      }
    );

    return unsubscribe;
  } catch (err: any) {
    console.error('[taskService] Failed to establish onSnapshot listener:', err);
    if (onError) onError(err);
    return () => {};
  }
};

/**
 * Subscribes to tasks belonging to a specific team
 */
export const subscribeTeamTasks = (
  teamId: string,
  onNext: (tasks: Task[]) => void,
  onError?: (error: Error) => void
): Unsubscribe => {
  try {
    const tasksRef = collection(db, COLLECTION_NAME);
    // Note: To avoid requiring a composite index in Firestore (where + orderBy),
    // we query by teamId and sort by createdAt descending in memory.
    const q = query(
      tasksRef,
      where('teamId', '==', teamId)
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const tasks: Task[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
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
            teamName: data.teamName ?? null,
            assigneeName: data.assigneeName ?? null,
          };
        });
        tasks.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        onNext(tasks);
      },
      (err) => {
        console.error('[taskService] subscribeTeamTasks error:', err);
        if (onError) onError(err);
      }
    );
  } catch (err: any) {
    console.error('[taskService] Exception in subscribeTeamTasks:', err);
    if (onError) onError(err);
    return () => {};
  }
};

/**
 * Creates a new task directly in Cloud Firestore.
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
    teamName: input.teamName ?? null,
    assigneeName: input.assigneeName ?? null,
  };

  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), newTaskData);
    console.log('[taskService] Task successfully created in Firestore with ID:', docRef.id);
    return {
      id: docRef.id,
      ...newTaskData,
    };
  } catch (err) {
    console.error('[taskService] Error adding document to Firestore:', err);
    throw err;
  }
};

/**
 * Updates an existing task by document ID in Cloud Firestore.
 */
export const updateTask = async (id: string, updates: UpdateTaskInput): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { ...updates });
    console.log('[taskService] Task successfully updated in Firestore:', id);
  } catch (err) {
    console.error('[taskService] Error updating document in Firestore:', err);
    throw err;
  }
};

/**
 * Deletes a task by document ID from Cloud Firestore.
 */
export const deleteTask = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    console.log('[taskService] Task successfully deleted from Firestore:', id);
  } catch (err) {
    console.error('[taskService] Error deleting document from Firestore:', err);
    throw err;
  }
};

/**
 * Retrieves all tasks directly from Cloud Firestore (one-time fetch).
 */
export const getTasks = async (): Promise<Task[]> => {
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
    throw err;
  }
};
