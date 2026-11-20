export type AppSection = 'inicio' | 'calendario' | 'tareas' | 'notas' | 'progreso';

export type TaskStatus = 'pendiente' | 'completada';

export type PriorityLevel = 'Baja' | 'Media' | 'Alta';

export interface ClassSession {
  id: string;
  title: string;
  module: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  instructorOrRoom: string;
}

export interface StudyTask {
  id: string;
  title: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  status: TaskStatus;
  priority: PriorityLevel;
}

export interface StudyNote {
  id: string;
  title: string;
  topic: string;
  content: string;
  updatedAt: string; // YYYY-MM-DD
}
