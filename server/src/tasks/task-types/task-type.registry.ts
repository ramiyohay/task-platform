import { Injectable } from '@nestjs/common';
import { TaskType } from '../task.entity';
import { TaskTypeHandler } from './task-type-handler';
import { ProcurementTaskHandler } from './procurement.handler';
import { DevelopmentTaskHandler } from './development.handler';

// Registry to manage different task type handlers
// This allows for easy retrieval of the appropriate handler based on task type
@Injectable()
export class TaskTypeRegistry {
  private handlers = new Map<TaskType, TaskTypeHandler>();

  constructor() {
    [new ProcurementTaskHandler(), new DevelopmentTaskHandler()].forEach((h) =>
      this.handlers.set(h.type, h),
    );
  }

  get(type: TaskType): TaskTypeHandler {
    const handler = this.handlers.get(type);
    if (!handler) throw new Error('Unknown task type');
    return handler;
  }
}
