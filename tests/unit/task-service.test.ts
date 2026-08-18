import type { User } from "firebase/auth";
import { toSession, type Task } from "../../src/types";
import {
  createTask,
  deleteTask,
  setTaskCompleted,
  subscribeToUserTasks,
  updateTaskTitle,
} from "../../src/services/taskService";

describe("toSession", () => {
  it("detecta el proveedor de Google", () => {
    const user = { email: "persona@demo.com", providerData: [{ providerId: "google.com" }] } as unknown as User;
    expect(toSession(user)).toEqual({ email: "persona@demo.com", provider: "google" });
  });

  it("detecta el proveedor de email/password por defecto", () => {
    const user = { email: "persona@demo.com", providerData: [{ providerId: "password" }] } as unknown as User;
    expect(toSession(user)).toEqual({ email: "persona@demo.com", provider: "email" });
  });

  it("usa string vacio si el usuario no tiene email", () => {
    const user = { email: null, providerData: [] } as unknown as User;
    expect(toSession(user).email).toBe("");
  });
});

describe("taskService", () => {
  it("crea una tarea y la entrega via subscribeToUserTasks", async () => {
    const received: Task[][] = [];
    const unsubscribe = subscribeToUserTasks(
      "uid-1",
      (tasks) => received.push(tasks),
      () => {}
    );

    await createTask("uid-1", "persona@demo.com", "Preparar demo", "Equipo QA", "alta");

    const latest = received[received.length - 1];
    expect(latest).toHaveLength(1);
    expect(latest[0]).toMatchObject({
      userId: "uid-1",
      createdBy: "persona@demo.com",
      title: "Preparar demo",
      assignedTo: "Equipo QA",
      priority: "alta",
      completed: false,
    });

    unsubscribe();
  });

  it("edita el titulo, marca como completada y elimina la tarea", async () => {
    const received: Task[][] = [];
    const unsubscribe = subscribeToUserTasks(
      "uid-2",
      (tasks) => received.push(tasks),
      () => {}
    );

    await createTask("uid-2", "persona@demo.com", "Titulo original", "Sin asignar", "media");
    const taskId = received[received.length - 1][0].id;

    await updateTaskTitle(taskId, "Titulo editado");
    expect(received[received.length - 1][0].title).toBe("Titulo editado");

    await setTaskCompleted(taskId, true);
    expect(received[received.length - 1][0].completed).toBe(true);

    await deleteTask(taskId);
    expect(received[received.length - 1]).toHaveLength(0);

    unsubscribe();
  });

  it("propaga un error legible si la operacion falla", async () => {
    await expect(updateTaskTitle("id-inexistente", "Nuevo titulo")).rejects.toThrow(/error/i);
  });

  it("aisla las tareas por usuario en la suscripcion", async () => {
    const receivedA: Task[][] = [];
    const receivedB: Task[][] = [];
    const unsubA = subscribeToUserTasks(
      "uid-a",
      (tasks) => receivedA.push(tasks),
      () => {}
    );
    const unsubB = subscribeToUserTasks(
      "uid-b",
      (tasks) => receivedB.push(tasks),
      () => {}
    );

    await createTask("uid-a", "a@demo.com", "Tarea A", "Sin asignar", "baja");

    expect(receivedA[receivedA.length - 1]).toHaveLength(1);
    expect(receivedB[receivedB.length - 1]).toHaveLength(0);

    unsubA();
    unsubB();
  });
});
