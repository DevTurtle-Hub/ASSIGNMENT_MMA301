export type TaskStatus = 'todo' | 'in_progress' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string;
  teamId?: string | null;
  assigneeId?: string | null;
}

export type CreateTaskInput = Omit<Task, 'id' | 'createdAt'> & {
  createdAt?: string;
};

export type UpdateTaskInput = Partial<Omit<Task, 'id' | 'createdAt'>>;

export type TaskFilterStatus = 'all' | TaskStatus;
export type TaskFilterPriority = 'all' | TaskPriority;

export interface TaskFilterOptions {
  status: TaskFilterStatus;
  priority: TaskFilterPriority;
  searchQuery: string;
}

export interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
}
