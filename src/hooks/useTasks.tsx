import { useEffect, useState } from "react";
import type { Priority, Task } from "../types";
import {
  createTask,
  deleteTask as deleteTaskService,
  setTaskCompleted,
  subscribeToUserTasks,
  updateTaskTitle,
} from "../services/taskService";

export function useTasks(userId: string | null, createdBy: string | null) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) {
      setTasks([]);
      setLoading(false);
      setError("");
      return;
    }

    setLoading(true);
    setError("");

    const unsubscribe = subscribeToUserTasks(
      userId,
      (nextTasks) => {
        setTasks(nextTasks);
        setLoading(false);
      },
      (message) => {
        setError(message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [userId]);

  const addTask = async (title: string, assignedTo: string, priority: Priority) => {
    if (!userId || !createdBy) {
      return;
    }

    setError("");
    try {
      await createTask(userId, createdBy, title, assignedTo, priority);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Ocurrio un error. Intenta nuevamente.");
    }
  };

  const updateTask = async (taskId: string, title: string) => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }

    setError("");
    try {
      await updateTaskTitle(taskId, trimmedTitle);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Ocurrio un error. Intenta nuevamente.");
    }
  };

  const toggleComplete = async (taskId: string) => {
    const task = tasks.find((currentTask) => currentTask.id === taskId);
    if (!task) {
      return;
    }

    setError("");
    try {
      await setTaskCompleted(taskId, !task.completed);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Ocurrio un error. Intenta nuevamente.");
    }
  };

  const deleteTask = async (taskId: string) => {
    setError("");
    try {
      await deleteTaskService(taskId);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Ocurrio un error. Intenta nuevamente.");
    }
  };

  return { tasks, loading, error, addTask, updateTask, toggleComplete, deleteTask };
}
