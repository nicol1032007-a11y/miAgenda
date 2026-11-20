import { useState, useEffect } from 'react';
import {
  Home,
  Calendar,
  CheckSquare,
  FileText,
  BarChart3,
  BookOpen,
  RotateCcw,
} from 'lucide-react';
import {
  AppSection,
  ClassSession,
  PriorityLevel,
  StudyNote,
  StudyTask,
} from './types/agenda';
import {
  SAMPLE_CLASSES,
  SAMPLE_NOTES,
  SAMPLE_TASKS,
  getTodayIso,
} from './data/sampleAgenda';
import { HomeView } from './components/HomeView';
import { CalendarView } from './components/CalendarView';
import { TasksView } from './components/TasksView';
import { NotesView } from './components/NotesView';
import { ProgressView } from './components/ProgressView';

const STORAGE_KEYS = {
  classes: 'mi-agenda-clases-v1',
  tasks: 'mi-agenda-tareas-v1',
  notes: 'mi-agenda-notas-v1',
};

function normalizePriority(value: unknown): PriorityLevel {
  if (value === 'Alta' || value === 'Media' || value === 'Baja') {
    return value;
  }
  return 'Media';
}

function loadTasks(todayIso: string): StudyTask[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.tasks);
    if (!raw) return SAMPLE_TASKS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => ({
        ...item,
        dueDate: item.dueDate || todayIso,
        priority: normalizePriority(item.priority),
      })) as StudyTask[];
    }
  } catch {
    // Ignore storage read errors
  }
  return SAMPLE_TASKS;
}

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as T;
  } catch {
    // Ignore storage read errors
  }
  return fallback;
}

const NAV_ITEMS: Array<{
  id: AppSection;
  label: string;
  title: string;
  icon: typeof Home;
}> = [
  { id: 'inicio', label: 'Inicio', title: 'Inicio', icon: Home },
  { id: 'calendario', label: 'Calendario', title: 'Calendario', icon: Calendar },
  { id: 'tareas', label: 'Tareas', title: 'Tareas', icon: CheckSquare },
  { id: 'notas', label: 'Notas', title: 'Notas', icon: FileText },
  { id: 'progreso', label: 'Progreso', title: 'Progreso', icon: BarChart3 },
];

export default function App() {
  const todayIso = getTodayIso();
  const [activeSection, setActiveSection] = useState<AppSection>('inicio');

  const [classes, setClasses] = useState<ClassSession[]>(() =>
    loadFromStorage(STORAGE_KEYS.classes, SAMPLE_CLASSES)
  );
  const [tasks, setTasks] = useState<StudyTask[]>(() => loadTasks(todayIso));
  const [notes, setNotes] = useState<StudyNote[]>(() =>
    loadFromStorage(STORAGE_KEYS.notes, SAMPLE_NOTES)
  );

  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.classes, JSON.stringify(classes));
    } catch {
      // Ignore storage errors
    }
  }, [classes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks));
    } catch {
      // Ignore storage errors
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(notes));
    } catch {
      // Ignore storage errors
    }
  }, [notes]);

  const handleNavigate = (section: AppSection) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Class CRUD
  const handleAddClass = (session: Omit<ClassSession, 'id'>) => {
    setClasses((prev) => [
      ...prev,
      { ...session, id: `class-${Date.now()}` },
    ]);
  };

  const handleUpdateClass = (updated: ClassSession) => {
    setClasses((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  };

  const handleDeleteClass = (id: string) => {
    setClasses((prev) => prev.filter((item) => item.id !== id));
  };

  // Task CRUD
  const handleAddTask = (task: Omit<StudyTask, 'id'>) => {
    setTasks((prev) => [{ ...task, id: `task-${Date.now()}` }, ...prev]);
  };

  const handleUpdateTask = (updated: StudyTask) => {
    setTasks((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((item) => item.id !== id));
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === 'completada' ? 'pendiente' : 'completada',
            }
          : item
      )
    );
  };

  // Note CRUD
  const handleAddNote = (note: Omit<StudyNote, 'id' | 'updatedAt'>) => {
    setNotes((prev) => [
      {
        ...note,
        id: `note-${Date.now()}`,
        updatedAt: todayIso,
      },
      ...prev,
    ]);
  };

  const handleUpdateNote = (updated: StudyNote) => {
    setNotes((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((item) => item.id !== id));
  };

  const handleResetDemo = () => {
    setClasses(SAMPLE_CLASSES);
    setTasks(SAMPLE_TASKS);
    setNotes(SAMPLE_NOTES);
  };

  const currentNav =
    NAV_ITEMS.find((item) => item.id === activeSection) ?? NAV_ITEMS[0];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {/* Contenedor exclusivo para teléfono móvil */}
      <div className="mx-auto min-h-screen w-full max-w-[430px] bg-slate-50 pb-24 sm:border-x sm:border-slate-200 sm:shadow-sm">
        {/* Barra superior de aplicación móvil */}
        <header className="border-b border-slate-200 bg-white px-4 py-3.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shrink-0">
                <BookOpen className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <span className="block text-[11px] font-medium text-slate-500 truncate">
                  Mi Agenda de Aprendizaje
                </span>
                <h1 className="truncate font-display text-lg font-bold leading-tight text-slate-900">
                  {currentNav.title}
                </h1>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetDemo}
              className="flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Restablecer
            </button>
          </div>
        </header>

        {/* Contenido principal desplazable */}
        <main className="px-4 py-4">
          {activeSection === 'inicio' && (
            <HomeView
              todayIso={todayIso}
              classes={classes}
              tasks={tasks}
              notesCount={notes.length}
              onNavigate={handleNavigate}
              onToggleTask={handleToggleTask}
              onOpenNewClass={() => {
                setActiveSection('calendario');
                setIsClassModalOpen(true);
              }}
              onOpenNewTask={() => {
                setActiveSection('tareas');
                setIsTaskModalOpen(true);
              }}
            />
          )}

          {activeSection === 'calendario' && (
            <CalendarView
              todayIso={todayIso}
              classes={classes}
              tasks={tasks}
              onAddClass={handleAddClass}
              onUpdateClass={handleUpdateClass}
              onDeleteClass={handleDeleteClass}
              onToggleTask={handleToggleTask}
              isModalOpen={isClassModalOpen}
              onOpenModal={() => setIsClassModalOpen(true)}
              onCloseModal={() => setIsClassModalOpen(false)}
            />
          )}

          {activeSection === 'tareas' && (
            <TasksView
              todayIso={todayIso}
              tasks={tasks}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onToggleTask={handleToggleTask}
              isModalOpen={isTaskModalOpen}
              onOpenModal={() => setIsTaskModalOpen(true)}
              onCloseModal={() => setIsTaskModalOpen(false)}
            />
          )}

          {activeSection === 'notas' && (
            <NotesView
              todayIso={todayIso}
              notes={notes}
              onAddNote={handleAddNote}
              onUpdateNote={handleUpdateNote}
              onDeleteNote={handleDeleteNote}
            />
          )}

          {activeSection === 'progreso' && (
            <ProgressView
              todayIso={todayIso}
              tasks={tasks}
              classes={classes}
              notesCount={notes.length}
              onNavigate={handleNavigate}
            />
          )}
        </main>

        {/* Barra inferior fija exclusiva de navegación móvil */}
        <nav
          aria-label="Navegación principal móvil"
          className="fixed bottom-0 left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2 border-t border-slate-200 bg-white/95 backdrop-blur-md"
        >
          <div className="grid h-16 grid-cols-5 items-center">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigate(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex h-full min-h-[44px] flex-col items-center justify-center px-1 transition-colors ${
                    isActive
                      ? 'text-blue-600'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`}
                    aria-hidden="true"
                  />
                  <span className="mt-1 text-[11px] font-semibold tracking-tight whitespace-nowrap">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
