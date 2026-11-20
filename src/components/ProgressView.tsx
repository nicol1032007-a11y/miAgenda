import { CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { AppSection, ClassSession, StudyTask } from '../types/agenda';
import { formatReadableDate } from '../utils/dateUtils';
import { PRIORITY_STYLES } from '../utils/priorityStyles';

interface ProgressViewProps {
  todayIso: string;
  tasks: StudyTask[];
  classes: ClassSession[];
  notesCount: number;
  onNavigate: (section: AppSection) => void;
}

export function ProgressView({
  todayIso,
  tasks,
  classes,
  notesCount,
  onNavigate,
}: ProgressViewProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completada');
  const pendingTasks = tasks.filter((t) => t.status === 'pendiente');

  const completedCount = completedTasks.length;
  const pendingCount = pendingTasks.length;

  const completedPct =
    totalTasks === 0 ? 0 : Math.round((completedCount / totalTasks) * 100);
  const pendingPct = totalTasks === 0 ? 0 : 100 - completedPct;

  const size = 112;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (completedPct / 100) * circumference;

  const isAllDone = totalTasks > 0 && completedCount === totalTasks;

  return (
    <div className="space-y-4">
      <section
        aria-label="Resumen visual de progreso"
        className="rounded-2xl border border-slate-200 bg-white p-4"
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <div
            className="relative flex shrink-0 items-center justify-center"
            style={{ width: size, height: size }}
            role="img"
            aria-label={`${completedPct}% de las tareas completadas`}
          >
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              className="-rotate-90"
            >
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth={strokeWidth}
              />
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={isAllDone ? '#16a34a' : '#2563eb'}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                className="transition-[stroke-dashoffset] duration-300"
              />
            </svg>
            <div className="absolute text-center">
              <span className="block font-mono text-2xl font-bold tabular-nums text-slate-900">
                {completedPct}%
              </span>
              <span className="block text-[11px] font-medium text-slate-500">
                completado
              </span>
            </div>
          </div>

          <div className="w-full space-y-3 text-left">
            <div className="text-center">
              <h2 className="text-lg font-bold text-slate-900">
                Tu avance en el curso
              </h2>
              <p className="mt-0.5 text-sm text-slate-600 tabular-nums">
                {totalTasks === 0
                  ? 'Agrega actividades para empezar a medir tu progreso.'
                  : `Has completado ${completedCount} de ${totalTasks} ${
                      totalTasks === 1 ? 'actividad' : 'actividades'
                    }.`}
              </p>
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-semibold text-emerald-700">
                    Completadas
                  </span>
                  <span className="font-mono font-semibold tabular-nums text-slate-800">
                    {completedCount} ({completedPct}%)
                  </span>
                </div>
                <div
                  className="h-3 w-full overflow-hidden rounded-full bg-slate-100"
                  role="progressbar"
                  aria-valuenow={completedPct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Porcentaje de tareas completadas"
                >
                  <div
                    className="h-full w-full origin-left rounded-full bg-emerald-600 transition-transform duration-300"
                    style={{ transform: `scaleX(${completedPct / 100})` }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-semibold text-amber-700">
                    Pendientes
                  </span>
                  <span className="font-mono font-semibold tabular-nums text-slate-800">
                    {pendingCount} ({pendingPct}%)
                  </span>
                </div>
                <div
                  className="h-3 w-full overflow-hidden rounded-full bg-slate-100"
                  role="progressbar"
                  aria-valuenow={pendingPct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Porcentaje de tareas pendientes"
                >
                  <div
                    className="h-full w-full origin-left rounded-full bg-amber-500 transition-transform duration-300"
                    style={{ transform: `scaleX(${pendingPct / 100})` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium text-slate-500">Completadas</p>
          <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-emerald-700">
            {completedCount}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium text-slate-500">Pendientes</p>
          <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-amber-700">
            {pendingCount}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium text-slate-500">Clases</p>
          <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-slate-900">
            {classes.length}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium text-slate-500">Apuntes</p>
          <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-slate-900">
            {notesCount}
          </p>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-3.5">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-600" aria-hidden="true" />
            <h3 className="text-base font-bold text-slate-900">
              Por completar ({pendingCount})
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('tareas')}
            className="flex min-h-[44px] items-center gap-1 rounded-lg px-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
          >
            Ir a Tareas
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {pendingTasks.length > 0 ? (
          <ul className="divide-y divide-slate-100">
            {pendingTasks.map((task) => {
              const priorityStyle = PRIORITY_STYLES[task.priority || 'Media'];
              return (
                <li key={task.id} className="px-4 py-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold ${priorityStyle.badgeClass}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${priorityStyle.dotClass}`}
                        aria-hidden="true"
                      />
                      {task.priority || 'Media'}
                    </span>
                    <span className="text-xs font-medium text-slate-500 tabular-nums">
                      {formatReadableDate(task.dueDate || todayIso, todayIso)}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm font-semibold text-slate-900">
                    {task.title}
                  </p>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="px-4 py-6 text-sm text-slate-500">
            No tienes tareas pendientes en este momento.
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-3.5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden="true" />
            <h3 className="text-base font-bold text-slate-900">
              Completadas ({completedCount})
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('tareas')}
            className="flex min-h-[44px] items-center gap-1 rounded-lg px-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
          >
            Revisar
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {completedTasks.length > 0 ? (
          <ul className="divide-y divide-slate-100">
            {completedTasks.map((task) => (
              <li key={task.id} className="px-4 py-3.5">
                <p className="text-sm font-medium text-slate-600 line-through">
                  {task.title}
                </p>
                <p className="mt-0.5 text-xs text-emerald-700 tabular-nums">
                  Completada · {formatReadableDate(task.dueDate || todayIso, todayIso)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-4 py-6 text-sm text-slate-500">
            Aún no has completado ninguna tarea.
          </p>
        )}
      </section>
    </div>
  );
}
