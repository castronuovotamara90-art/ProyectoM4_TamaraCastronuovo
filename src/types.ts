export type Priority = "alta" | "media" | "baja";

export type Session = {
  email: string;
  provider: "email" | "google";
};

export type Task = {
  id: number;
  title: string;
  assignedTo: string;
  createdBy: string;
  priority: Priority;
  completed: boolean;
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  alta: "Alta",
  media: "Media",
  baja: "Baja",
};

export const PRIORITY_ORDER: Priority[] = ["alta", "media", "baja"];
