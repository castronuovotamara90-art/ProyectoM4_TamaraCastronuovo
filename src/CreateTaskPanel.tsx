import { FormEvent, useState } from "react";
import { AlertCircle, ClipboardList, ListPlus, PlusCircle, User, Flag, Inbox } from "lucide-react";
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
        <h2 className="icon-label">
          <ListPlus size={19} />
          Nueva tarea
        </h2>
        <p className="panel-hint">Completa el título y, si quieres, asigna un responsable y una prioridad.</p>

        <div className="field-group">
          <label htmlFor="taskTitle" className="icon-label">
            <ClipboardList size={15} />
            Titulo de la tarea
          </label>
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
            <label htmlFor="assignedTo" className="icon-label">
              <User size={15} />
              Asignar a
            </label>
            <input
              id="assignedTo"
              type="text"
              value={assignedTo}
              onChange={(event) => setAssignedTo(event.target.value)}
              placeholder="Nombre del empleado"
            />
          </div>

          <div className="field-group">
            <label htmlFor="priority" className="icon-label">
              <Flag size={15} />
              Prioridad
            </label>
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
            <AlertCircle size={16} />
            {formError}
          </p>
        ) : null}

        <button type="submit" className="primary-button" aria-label="Agregar tarea">
          <PlusCircle size={17} />
          Agregar tarea
        </button>
      </form>

      {tasks.length > 0 ? (
        <div className="task-list-block">
          <h3>
            <ClipboardList size={16} />
            Tareas recientes
          </h3>
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
      ) : (
        <p className="empty-state" style={{ marginTop: "1.25rem" }}>
          <Inbox size={16} />
          Todavía no hay tareas. Crea la primera arriba.
        </p>
      )}
    </div>
  );
}

export default CreateTaskPanel;
