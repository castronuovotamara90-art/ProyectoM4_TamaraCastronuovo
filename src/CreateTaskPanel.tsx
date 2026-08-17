import { FormEvent, useState } from "react";
import type { Priority, Task } from "./types";
import TaskCard from "./TaskCard";

type CreateTaskPanelProps = {
  tasks: Task[];
  onAddTask: (title: string, assignedTo: string, priority: Priority) => void;
  onUpdateTask: (taskId: number, title: string) => void;
  onToggleComplete: (taskId: number) => void;
  onDelete: (taskId: number) => void;
};

export function CreateTaskPanel({
  tasks,
  onAddTask,
  onUpdateTask,
  onToggleComplete,
  onDelete,
}: CreateTaskPanelProps) {
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState<Priority>("media");
  const [formError, setFormError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setFormError("Completa el título de la tarea.");
      return;
    }

    const finalAssignedTo = assignedTo.trim() || "Sin asignar";

    onAddTask(title.trim(), finalAssignedTo, priority);
    setTitle("");
    setAssignedTo("");
    setPriority("media");
    setFormError("");
  };

  return (
    <div className="panel-card">
      <form onSubmit={handleSubmit} className="task-form">
        <h2>Nueva tarea</h2>

        <div className="field-group">
          <label htmlFor="taskTitle">Titulo de la tarea</label>
          <input
            id="taskTitle"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Escribe una tarea"
          />
        </div>

        <div className="field-row">
          <div className="field-group">
            <label htmlFor="assignedTo">Asignar a</label>
            <input
              id="assignedTo"
              type="text"
              value={assignedTo}
              onChange={(event) => setAssignedTo(event.target.value)}
              placeholder="Nombre del empleado"
            />
          </div>

          <div className="field-group">
            <label htmlFor="priority">Prioridad</label>
            <select
              id="priority"
              value={priority}
              onChange={(event) => setPriority(event.target.value as Priority)}
            >
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>
        </div>

        {formError ? (
          <p className="error-message" aria-live="polite">
            {formError}
          </p>
        ) : null}

        <button type="submit" className="primary-button" aria-label="Agregar tarea">
          Agregar tarea
        </button>
      </form>

      {tasks.length > 0 ? (
        <div className="task-list-block">
          <h3>Tareas recientes</h3>
          <ul className="task-card-list">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdateTask={onUpdateTask}
                onToggleComplete={onToggleComplete}
                onDelete={onDelete}
              />
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export default CreateTaskPanel;