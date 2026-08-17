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
      <h2>Estado de las tareas</h2>

      <div className="status-section">
        <p className="status-heading">Pendientes ({pendingTasks.length})</p>
        {pendingTasks.length === 0 ? (
          <p className="empty-state">No hay tareas pendientes.</p>
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
        <p className="status-heading">Completadas ({completedTasks.length})</p>
        {completedTasks.length === 0 ? (
          <p className="empty-state">Todavía no completaste ninguna tarea.</p>
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