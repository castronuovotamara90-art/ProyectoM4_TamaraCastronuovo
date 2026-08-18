import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import StatusPanel from "../../src/StatusPanel";
import type { Task } from "../../src/types";

const pendingTask: Task = {
  id: "task-pending",
  userId: "uid-1",
  title: "Tarea pendiente",
  assignedTo: "Sin asignar",
  createdBy: "persona@demo.com",
  priority: "alta",
  completed: false,
};

const completedTask: Task = {
  id: "task-completed",
  userId: "uid-1",
  title: "Tarea completada",
  assignedTo: "Sin asignar",
  createdBy: "persona@demo.com",
  priority: "baja",
  completed: true,
};

describe("StatusPanel (listado de tareas por estado)", () => {
  it("muestra los mensajes vacios cuando no hay tareas", () => {
    render(<StatusPanel tasks={[]} onUpdateTask={vi.fn()} onToggleComplete={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText(/no hay tareas pendientes/i)).toBeInTheDocument();
    expect(screen.getByText(/todav[ií]a no completaste ninguna tarea/i)).toBeInTheDocument();
  });

  it("agrupa las tareas en pendientes y completadas con sus contadores", () => {
    render(
      <StatusPanel tasks={[pendingTask, completedTask]} onUpdateTask={vi.fn()} onToggleComplete={vi.fn()} onDelete={vi.fn()} />
    );

    expect(screen.getByText("Tarea pendiente")).toBeInTheDocument();
    expect(screen.getByText("Tarea completada")).toBeInTheDocument();

    const counts = screen.getAllByText("1");
    expect(counts).toHaveLength(2);
  });

  it("reenvia el toggle de completado con el id correcto", async () => {
    const user = userEvent.setup();
    const onToggleComplete = vi.fn();
    render(
      <StatusPanel tasks={[pendingTask]} onUpdateTask={vi.fn()} onToggleComplete={onToggleComplete} onDelete={vi.fn()} />
    );

    await user.click(screen.getByRole("button", { name: /marcar como completada/i }));
    expect(onToggleComplete).toHaveBeenCalledWith("task-pending");
  });

  it("reenvia la eliminacion con el id correcto", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(
      <StatusPanel tasks={[completedTask]} onUpdateTask={vi.fn()} onToggleComplete={vi.fn()} onDelete={onDelete} />
    );

    await user.click(screen.getByRole("button", { name: /eliminar tarea/i }));
    expect(onDelete).toHaveBeenCalledWith("task-completed");
  });
});
