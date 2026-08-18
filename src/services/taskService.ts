import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type FirestoreError,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Priority, Task } from "../types";

const TASKS_COLLECTION = "tasks";

function toErrorMessage(error: unknown): string {
  const code = (error as FirestoreError | null)?.code;

  if (code === "permission-denied") {
    return "No tienes permiso para acceder a esta tarea.";
  }

  return "Ocurrio un error al comunicarse con la base de datos. Intenta nuevamente.";
}

export function subscribeToUserTasks(
  userId: string,
  onChange: (tasks: Task[]) => void,
  onError: (message: string) => void
) {
  const tasksQuery = query(
    collection(db, TASKS_COLLECTION),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    tasksQuery,
    (snapshot) => {
      const tasks = snapshot.docs.map((docSnapshot) => ({
        id: docSnapshot.id,
        ...docSnapshot.data(),
      })) as Task[];
      onChange(tasks);
    },
    (error) => onError(toErrorMessage(error))
  );
}

export async function createTask(
  userId: string,
  createdBy: string,
  title: string,
  assignedTo: string,
  priority: Priority
): Promise<void> {
  try {
    await addDoc(collection(db, TASKS_COLLECTION), {
      userId,
      createdBy,
      title,
      assignedTo,
      priority,
      completed: false,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    throw new Error(toErrorMessage(error));
  }
}

export async function updateTaskTitle(taskId: string, title: string): Promise<void> {
  try {
    await updateDoc(doc(db, TASKS_COLLECTION, taskId), { title });
  } catch (error) {
    throw new Error(toErrorMessage(error));
  }
}

export async function setTaskCompleted(taskId: string, completed: boolean): Promise<void> {
  try {
    await updateDoc(doc(db, TASKS_COLLECTION, taskId), { completed });
  } catch (error) {
    throw new Error(toErrorMessage(error));
  }
}

export async function deleteTask(taskId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, TASKS_COLLECTION, taskId));
  } catch (error) {
    throw new Error(toErrorMessage(error));
  }
}
