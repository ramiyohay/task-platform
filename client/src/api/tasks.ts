import { api } from './http';
import type { Task, TaskType } from '../types/models';

// Fetch tasks assigned to a specific user
export function fetchUserTasks(userId: number) {
  return api<Task[]>(`/users/${userId}/tasks`);
}

// create a new task with specified type and assigned user
export function createTask(type: TaskType, userId: number) {
  return api<Task>('/tasks', {
    method: 'POST',
    body: JSON.stringify({ type, userId }),
  });
}

// change the status of a task with provided data and next user assignment
export function changeStatus(taskId: number, status: number, data: Record<string, any>, nextUserId: number) {
  return api<Task>(`/tasks/${taskId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, data, nextUserId }),
  });
}

// close a task by its ID
export function closeTask(taskId: number) {
  return api<Task>(`/tasks/${taskId}/close`, { method: 'POST' });
}
