import { TaskType } from '../task.entity';

// Interface for handling different task types
// Each task type handler must implement these methods
// In this way, we can ensure consistent behavior across different task types and can easily
// add new types in the future
export interface TaskTypeHandler {
  type: TaskType;
  getFinalStatus(): number;
  validateStatusData(status: number, data: any): void;
}