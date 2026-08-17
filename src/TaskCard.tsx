import { useState } from "react";
import { Task, PRIORITY_LABELS } from "./types";

type TaskCardProps = {
  task: Task;
  onUpdateTask: (taskId: number, title: string) => void;
  onToggleComplete: (taskId: number) => void;
  onDelete: (taskId: number) => void;
};

function TaskCard({ task, onUpdateTask, onToggleComplete, onDelete }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(task.title);

  const handleSave = () => {
    onUpdateTask(task.id, draftTitle);
    setIsEditing(false);
  };

  return (
    <li className={`task-card priority-${task.priority}${task.completed ? " completed" : ""}`}>
      <div className="task-card-main">
        {isEditing ? (
          <>
            <input
              aria-label={`Editar tarea ${task.title}`}
              value={draftTitle}
              onChange={(event) => setDraftTitle(event.target.value)}
            />
            <button type="button" onClick={handleSave} aria-label="Guardar cambios">
              Guardar cambios
            </button>
          </>
        ) : (
          <>
            <label className="task-checkbox">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleComplete(task.id)}
                aria-label={`Marcar "${task.title}" como ${task.completed ? "pendiente" : "completada"}`}
              />
              <span className={task.completed ? "task-title done" : "task-title"}>{task.title}</span>
            </label>
            <button
              type="button"
              className="task-action"
              onClick={() => {
                setDraftTitle(task.title);
                setIsEditing(true);
              }}
              aria-label="Editar tarea"
            >
              Editar tarea
            </button>
            <button
              type="button"
              className="task-action"
              onClick={() => onToggleComplete(task.id)}
              aria-label={task.completed ? "Marcar como pendiente" : "Marcar como completada"}
            >
              {task.completed ? "Marcar como pendiente" : "Marcar como completada"}
            </button>
          </>
        )}
        <button
          type="button"
          className="task-delete"
          onClick={() => onDelete(task.id)}
          aria-label={`Eliminar tarea ${task.title}`}
        >
          Eliminar
        </button>
      </div>
      <div className="task-card-meta">
        <span className="task-assignee">Asignada a: {task.assignedTo}</span>
        <span className={`priority-badge priority-badge-${task.priority}`}>
          {PRIORITY_LABELS[task.priority]}
        </span>
      </div>
    </li>
  );
}

export default TaskCard;
