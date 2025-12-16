import { TaskType } from '../types/models';

type Definition = {
  finalStatus: number;
  labels: Record<number, string>;
  requiredFieldsByStatus: Record<number, readonly string[]>;
};

// Definitions for different task types, including final status, status labels, and required fields
// Can easily be extended for new task types in the future
export const TASK_DEFINITIONS: Record<TaskType, Definition> = {
  [TaskType.PROCUREMENT]: {
    finalStatus: 3,
    labels: {
      1: 'Created',
      2: 'Supplier offers received',
      3: 'Purchase completed',
    },
    requiredFieldsByStatus: {
      1: [],
      2: ['priceQuotes'],
      3: ['receipt'],
    },
  },
  [TaskType.DEVELOPMENT]: {
    finalStatus: 4,
    labels: {
      1: 'Created',
      2: 'Specification completed',
      3: 'Development completed',
      4: 'Distribution completed',
    },
    requiredFieldsByStatus: {
      1: [],
      2: ['spec'],
      3: ['branch'],
      4: ['version'],
    },
  },
};

// Utility functions to get task-related information based on type and status
export function getFinalStatus(type: TaskType): number {
  return TASK_DEFINITIONS[type]?.finalStatus ?? 1;
}

// Get the label for a given task type and status
export function getStatusLabel(type: TaskType, status: number): string {
  return TASK_DEFINITIONS[type]?.labels?.[status] ?? `Status ${status}`;
}

// Get the required fields for a given task type and status
export function getRequiredFields(type: TaskType, status: number): readonly string[] {
  return TASK_DEFINITIONS[type]?.requiredFieldsByStatus?.[status] ?? [];
}
