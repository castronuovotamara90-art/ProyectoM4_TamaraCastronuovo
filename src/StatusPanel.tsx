import { CircleDashed, CircleCheckBig, Inbox, ListChecks } from "lucide-react";
import type { Task } from "./types";
import TaskCard from "./TaskCard";

type StatusPanelProps = {
  tasks: Task[];
  onUpdateTask: (taskId: number, title: string) => void;
  onToggleComplete: (taskId: number) => void;
  onDelete: (taskId: number) => void;
};

export function StatusPanel({ tasks, onUpdateTask, onToggleComplete, onDelete }: StatusPanelProps) {
  const pendingTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className="panel-card">
      <h2 className="icon-label">
        <ListChecks size={19} />
        Estado de las tareas
      </h2>
      <p className="panel-hint">Revisa qué está pendiente y qué ya terminaste.</p>

      <div className="status-section">
        <p className="status-heading">
          <CircleDashed size={16} />
          Pendientes <span className="count-pill">{pendingTasks.length}</span>
        </p>
        {pendingTasks.length === 0 ? (
          <p className="empty-state">
            <Inbox size={15} />
            No hay tareas pendientes.
          </p>
        ) : (
          <ul className="task-card-list">
            {pendingTasks.map((task) => (
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

      <div className="status-section">
        <p className="status-heading">
          <CircleCheckBig size={16} />
          Completadas <span className="count-pill">{completedTasks.length}</span>
        </p>
        {completedTasks.length === 0 ? (
          <p className="empty-state">
            <Inbox size={15} />
            Todavía no completaste ninguna tarea.
          </p>
        ) : (
          <ul className="task-card-list">
            {completedTasks.map((task) => (
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
    </div>
  );
}

export default StatusPanel;