import { TaskType } from '../task.entity';
import { TaskTypeHandler } from './task-type-handler';

// Handler for PROCUREMENT task type
export class ProcurementTaskHandler implements TaskTypeHandler {
  type = TaskType.PROCUREMENT;

  getFinalStatus() {
    return 3;
  }

  validateStatusData(status: number, data: any) {
    if (status === 2 && (!Array.isArray(data?.priceQuotes) || data.priceQuotes.length !== 2)) {
      throw new Error('Status 2 requires exactly 2 price quotes');
    }
    if (status === 3 && typeof data?.receipt !== 'string') {
      throw new Error('Receipt required');
    }
  }
}