import type { Task } from '../types/models';
import { UI_TEXT } from '../constants/app';
import { getStatusLabel } from '../constants/taskDefinitions';

// Component to display a summary card for a task when the task dialog is closed and user wants to see task details
export function TaskSummaryCard({ task, onOpen }: { task: Task; onOpen: () => void }) {
  return (
    <button className="task-card" onClick={onOpen}>
      <div className="task-card-top">
        <div className="task-type">{task.type}</div>
        <div className={`badge ${task.isClosed ? 'badge-closed' : 'badge-open'}`}>
          {task.isClosed ? UI_TEXT.closed : UI_TEXT.open}
        </div>
      </div>

      <div className="task-meta">
        <div className="task-line">
          <span className="muted">Status</span>
          <span>{getStatusLabel(task.type, task.status)} ({task.status})</span>
        </div>
        <div className="task-line">
          <span className="muted">Assigned</span>
          <span>{task.assignedUser?.name ?? '-'}</span>
        </div>
        <div className="task-line">
          <span className="muted">ID</span>
          <span>#{task.id}</span>
        </div>
      </div>
    </button>
  );
}
