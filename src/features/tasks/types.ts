export type Priority = "high" | "medium" | "low";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  date?: string; // ISO string
  time?: string; // ISO string or simple time format
  createdAt: string;
  completed: boolean;
}
