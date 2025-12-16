import { TaskType } from '../task.entity';
import { TaskTypeHandler } from './task-type-handler';

// Handler for DEVELOPMENT task type
export class DevelopmentTaskHandler implements TaskTypeHandler {
  type = TaskType.DEVELOPMENT;

  // Final status for DEVELOPMENT tasks
  getFinalStatus() {
    return 4;
  }

  validateStatusData(status: number, data: any) {
    if (status === 2 && typeof data?.spec !== 'string') throw new Error('Spec required');
    if (status === 3 && typeof data?.branch !== 'string') throw new Error('Branch required');
    if (status === 4 && typeof data?.version !== 'string') throw new Error('Version required');
  }
}