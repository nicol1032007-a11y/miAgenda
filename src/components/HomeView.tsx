import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  ArrowRight,
  Plus,
  TrendingUp,
} from 'lucide-react';
import { AppSection, ClassSession, StudyTask } from '../types/agenda';
import { formatReadableDate } from '../utils/dateUtils';
import { PRIORITY_STYLES } from '../utils/priorityStyles';

interface HomeViewProps {
  todayIso: string;
  classes: ClassSession[];
  tasks: StudyTask[];
  notesCount: number;
  onNavigate: (section: AppSection) => void;
  onToggleTask: (id: string) => void;
  onOpenNewClass: () => void;
  onOpenNewTask: () => void;
}

export function HomeView({
  todayIso,
  classes,
  tasks,
  notesCount,
  onNavigate,
  onToggleTask,
  onOpenNewClass,
  onOpenNewTask,
}: HomeViewProps) {
  const upcomingClasses = [...classes]
    .filter((c) => c.date >= todayIso)
    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
    .slice(0, 3);

  const pendingTasks = [...tasks]
    .filter((t) => t.status === 'pendiente')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const completedCount = tasks.filter((t) => t.status === 'completada').length;
  const totalTasks = tasks.length;
  const pct = totalTasks === 0 ? 0 : Math.round((completedCount / totalTasks) * 100);

  return (
    <div className="space-y-4">
      {/* Tarjeta de resumen de inicio */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-xs font-semibold text-blue-700">
          Curso de Google AI Studio
        </p>
        <h2 className="mt-1 text-xl font-bold text-slate-900">
          Resumen para hoy
        </h2>
        <p className="mt-1 text-sm text-slate-600 tabular-nums">
          {pendingTasks.length}{' '}
          {pendingTasks.length === 1 ? 'pendiente' : 'pendientes'}
          <span className="mx-1.5 text-slate-300" aria-hidden="true">
            ·
          </span>
          {upcomingClasses.length}{' '}
          {upcomingClasses.length === 1 ? 'clase próxima' : 'clases próximas'}
          <span className="mx-1.5 text-slate-300" aria-hidden="true">
            ·
          </span>
          {notesCount} {notesCount === 1 ? 'apunte' : 'apuntes'}
        </p>

        <button
          type="button"
          onClick={() => onNavigate('progreso')}
          className="mt-3.5 flex min-h-[48px] w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition-colors hover:bg-slate-100"
        >
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 shrink-0 text-blue-600" aria-hidden="true" />
            <div>
              <span className="block text-xs text-slate-500">Avance del curso</span>
              <span className="font-mono text-base font-bold tabular-nums text-slate-900">
                {pct}% completado
              </span>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
        </button>

        {/* Botones de acción grandes para teléfono */}
        <div className="mt-3.5 grid grid-cols-1 gap-2.5">
          <button
            type="button"
            onClick={onOpenNewTask}
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 active:scale-[0.99]"
          >
            <Plus className="h-5 w-5" aria-hidden="true" />
            Agregar nueva actividad
          </button>
          <button
            type="button"
            onClick={onOpenNewClass}
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 active:scale-[0.99]"
          >
            <Plus className="h-5 w-5" aria-hidden="true" />
            Agregar nueva clase
          </button>
        </div>
      </section>

      {/* Próximas clases */}
      <section
        aria-label="Próximas clases"
        className="rounded-2xl border border-slate-200 bg-white overflow-hidden"
      >
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-3.5">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" aria-hidden="true" />
            <h2 className="text-base font-bold text-slate-900">
              Próximas clases
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('calendario')}
            className="flex min-h-[44px] items-center gap-1 rounded-lg px-2 text-sm font-medium text-blue-700 hover:bg-blue-50 whitespace-nowrap"
          >
            Calendario
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {upcomingClasses.length > 0 ? (
          <ul className="divide-y divide-slate-100">
            {upcomingClasses.map((session) => (
              <li key={session.id} className="px-4 py-3.5">
                <p className="text-base font-semibold text-slate-900">
                  {session.title}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {session.module} · {session.instructorOrRoom}
                </p>
                <div className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-blue-700 tabular-nums">
                  <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>
                    {formatReadableDate(session.date, todayIso)} ·{' '}
                    {session.startTime} - {session.endTime}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-4 py-8 text-center">
            <p className="text-sm font-medium text-slate-900">
              No hay clases próximas programadas
            </p>
            <button
              type="button"
              onClick={onOpenNewClass}
              className="mt-3 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Agregar clase
            </button>
          </div>
        )}
      </section>

      {/* Tareas pendientes */}
      <section
        aria-label="Tareas pendientes"
        className="rounded-2xl border border-slate-200 bg-white overflow-hidden"
      >
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-3.5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-blue-600" aria-hidden="true" />
            <h2 className="text-base font-bold text-slate-900">
              Tareas pendientes
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('tareas')}
            className="flex min-h-[44px] items-center gap-1 rounded-lg px-2 text-sm font-medium text-blue-700 hover:bg-blue-50 whitespace-nowrap"
          >
            Ver todas
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {pendingTasks.length > 0 ? (
          <ul className="divide-y divide-slate-100">
            {pendingTasks.slice(0, 4).map((task) => {
              const priorityStyle = PRIORITY_STYLES[task.priority || 'Media'];
              return (
                <li key={task.id} className="px-4 py-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-semibold ${priorityStyle.badgeClass}`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${priorityStyle.dotClass}`}
                        aria-hidden="true"
                      />
                      {priorityStyle.label}
                    </span>
                    <span className="text-xs font-semibold text-blue-700 tabular-nums">
                      {formatReadableDate(task.dueDate || todayIso, todayIso)}
                    </span>
                  </div>

                  <p className="mt-1.5 text-base font-semibold text-slate-900">
                    {task.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                    {task.description}
                  </p>

                  <button
                    type="button"
                    onClick={() => onToggleTask(task.id)}
                    className="mt-3 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-semibold text-slate-800 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
                  >
                    <Circle className="h-4 w-4 text-slate-400" aria-hidden="true" />
                    Marcar como completada
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="px-4 py-8 text-center">
            <p className="text-base font-semibold text-emerald-700">
              ¡Todas las tareas están completadas!
            </p>
            <button
              type="button"
              onClick={onOpenNewTask}
              className="mt-3 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Agregar actividad
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
