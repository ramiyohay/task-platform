export const APP_TITLE = 'Task Platform';

// Base URL for API requests, configurable via environment variable
export const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL ?? 'http://localhost:3000';

export const QUERY_KEYS = {
  users: ['users'] as const,
  userTasks: (userId: number) => ['userTasks', userId] as const,
} as const;

export const UI_TEXT = {
  selectUser: 'User',
  createTask: 'Create task',
  editTask: 'Edit task',
  type: 'Type',
  assignedUser: 'Assigned user',
  nextUser: 'Next user',
  save: 'Save',
  forward: 'Forward',
  back: 'Back',
  close: 'Close',
  cancel: 'Cancel',
  open: 'Open',
  closed: 'Closed',
} as const;
