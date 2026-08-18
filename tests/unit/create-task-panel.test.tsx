import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import CreateTaskPanel from "../../src/CreateTaskPanel";
import type { Task } from "../../src/types";

const baseTask: Task = {
  id: "task-1",
  userId: "uid-1",
  title: "Tarea existente",
  assignedTo: "Equipo QA",
  createdBy: "persona@demo.com",
  priority: "media",
  completed: false,
};

describe("CreateTaskPanel (formulario de tareas)", () => {
  it("muestra el estado vacio cuando no hay tareas", () => {
    render(
      <CreateTaskPanel tasks={[]} onAddTask={vi.fn()} onUpdateTask={vi.fn()} onToggleComplete={vi.fn()} onDelete={vi.fn()} />
    );

    expect(screen.getByText(/todav[ií]a no hay tareas/i)).toBeInTheDocument();
  });

  it("muestra un error si se intenta crear una tarea sin titulo", async () => {
    const user = userEvent.setup();
    const onAddTask = vi.fn();
    render(
      <CreateTaskPanel tasks={[]} onAddTask={onAddTask} onUpdateTask={vi.fn()} onToggleComplete={vi.fn()} onDelete={vi.fn()} />
    );

    await user.click(screen.getByRole("button", { name: /agregar tarea/i }));

    expect(screen.getByText(/completa el t[ií]tulo de la tarea/i)).toBeInTheDocument();
    expect(onAddTask).not.toHaveBeenCalled();
  });

  it("crea una tarea con valores por defecto cuando no se asigna responsable", async () => {
    const user = userEvent.setup();
    const onAddTask = vi.fn();
    render(
      <CreateTaskPanel tasks={[]} onAddTask={onAddTask} onUpdateTask={vi.fn()} onToggleComplete={vi.fn()} onDelete={vi.fn()} />
    );

    await user.type(screen.getByLabelText(/titulo de la tarea/i), "Preparar demo");
    await user.click(screen.getByRole("button", { name: /agregar tarea/i }));

    expect(onAddTask).toHaveBeenCalledWith("Preparar demo", "Sin asignar", "media");
    expect(screen.getByLabelText(/titulo de la tarea/i)).toHaveValue("");
  });

  it("crea una tarea con responsable y prioridad seleccionados", async () => {
    const user = userEvent.setup();
    const onAddTask = vi.fn();
    render(
      <CreateTaskPanel tasks={[]} onAddTask={onAddTask} onUpdateTask={vi.fn()} onToggleComplete={vi.fn()} onDelete={vi.fn()} />
    );

    await user.type(screen.getByLabelText(/titulo de la tarea/i), "Auditar accesos");
    await user.type(screen.getByLabelText(/asignar a/i), "Equipo seguridad");
    await user.selectOptions(screen.getByLabelText(/prioridad/i), "alta");
    await user.click(screen.getByRole("button", { name: /agregar tarea/i }));

    expect(onAddTask).toHaveBeenCalledWith("Auditar accesos", "Equipo seguridad", "alta");
  });

  it("lista las tareas recibidas y reenvia las acciones de cada tarjeta", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(
      <CreateTaskPanel tasks={[baseTask]} onAddTask={vi.fn()} onUpdateTask={vi.fn()} onToggleComplete={vi.fn()} onDelete={onDelete} />
    );

    expect(screen.getByText("Tarea existente")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /eliminar tarea/i }));
    expect(onDelete).toHaveBeenCalledWith("task-1");
  });
});
