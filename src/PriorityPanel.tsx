import { BarChart3, Flag, Inbox } from "lucide-react";
import { PRIORITY_LABELS, PRIORITY_ORDER } from "./types";
import type { Task } from "./types";
import TaskCard from "./TaskCard";

type PriorityPanelProps = {
  tasks: Task[];
  onUpdateTask: (taskId: number, title: string) => void;
  onToggleComplete: (taskId: number) => void;
  onDelete: (taskId: number) => void;
};

export function PriorityPanel({ tasks, onUpdateTask, onToggleComplete, onDelete }: PriorityPanelProps) {
  return (
    <div className="panel-card">
      <h2 className="icon-label">
        <BarChart3 size={19} />
        Tareas por prioridad
      </h2>
      <p className="panel-hint">Las tareas se agrupan de mayor a menor urgencia.</p>
      <div className="priority-columns">
        {PRIORITY_ORDER.map((priority) => {
          const tasksForPriority = tasks.filter((task) => task.priority === priority);

          return (
            <div key={priority} className="priority-column">
              <p className={`priority-badge priority-badge-${priority} priority-column-heading`}>
                <Flag size={13} />
                {PRIORITY_LABELS[priority]}
              </p>
              {tasksForPriority.length === 0 ? (
                <p className="empty-state">
                  <Inbox size={15} />
                  Sin tareas en esta prioridad.
                </p>
              ) : (
                <ul className="task-card-list">
                  {tasksForPriority.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onUpdateTask={onUpdateTask}
                      onToggleComplete={onToggleComplete}
                      onDelete={onDelete}
                    />
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PriorityPanel;