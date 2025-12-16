import { Injectable } from '@nestjs/common';
import { Task } from './task.entity';
import { TaskTypeRegistry } from './task-types/task-type.registry';

// Service to manage task operations such as status changes and closure
@Injectable()
export class TaskEngineService {
  constructor(private registry: TaskTypeRegistry) {}

  // Change the status of a task with validation
  changeStatus(task: Task, newStatus: number, data: any, nextUser) {
    if (task.isClosed) throw new Error('Task is closed');
    if (newStatus > task.status + 1) throw new Error('Cannot skip status');

    const handler = this.registry.get(task.type);
    
    handler.validateStatusData(newStatus, data);

    task.status = newStatus;
    task.customData = data;
    task.assignedUser = nextUser;
  }

  // Close a task if it has reached its final status
  closeTask(task: Task) {
    const handler = this.registry.get(task.type);

    if (task.status !== handler.getFinalStatus()) {
      throw new Error('Not final status');
    }

    task.isClosed = true;
  }
}