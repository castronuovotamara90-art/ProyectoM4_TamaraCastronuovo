import type { User } from "firebase/auth";

export type Priority = "alta" | "media" | "baja";

export type Session = {
  email: string;
  provider: "email" | "google";
};

export function toSession(user: User): Session {
  const isGoogle = user.providerData.some((provider) => provider.providerId === "google.com");

  return {
    email: user.email ?? "",
    provider: isGoogle ? "google" : "email",
  };
}

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