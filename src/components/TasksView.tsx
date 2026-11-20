import { useState, FormEvent, useRef } from 'react';
import {
  CheckCircle2,
  Circle,
  Calendar,
  Plus,
  Pencil,
  Trash2,
  AlertCircle,
  Search,
  X,
} from 'lucide-react';
import { PriorityLevel, StudyTask, TaskStatus } from '../types/agenda';
import { formatReadableDate } from '../utils/dateUtils';
import { PRIORITY_OPTIONS, PRIORITY_STYLES } from '../utils/priorityStyles';
import { BottomSheetModal } from './BottomSheetModal';

interface TasksViewProps {
  todayIso: string;
  tasks: StudyTask[];
  onAddTask: (task: Omit<StudyTask, 'id'>) => void;
  onUpdateTask: (task: StudyTask) => void;
  onDeleteTask: (id: string) => void;
  onToggleTask: (id: string) => void;
  isModalOpen: boolean;
  onOpenModal: () => void;
  onCloseModal: () => void;
}

type TaskFilterTab = 'todas' | 'pendientes' | 'completadas';

export function TasksView({
  todayIso,
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onToggleTask,
  isModalOpen,
  onOpenModal,
  onCloseModal,
}: TasksViewProps) {
  const [filter, setFilter] = useState<TaskFilterTab>('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTask, setEditingTask] = useState<StudyTask | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Estado del formulario (validación, fecha y prioridad)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(todayIso);
  const [priority, setPriority] = useState<PriorityLevel>('Media');
  const [status, setStatus] = useState<TaskStatus>('pendiente');
  const [titleError, setTitleError] = useState<string | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.status === 'completada').length;
  const pendingCount = totalCount - completedCount;
  const percentage =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const visibleTasks = [...tasks]
    .filter((task) => {
      if (filter === 'pendientes') return task.status === 'pendiente';
      if (filter === 'completadas') return task.status === 'completada';
      return true;
    })
    .filter((task) => {
      if (!normalizedQuery) return true;
      return task.title.toLowerCase().includes(normalizedQuery);
    })
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const openCreateModal = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setDueDate(todayIso);
    setPriority('Media');
    setStatus('pendiente');
    setTitleError(null);
    onOpenModal();
  };

  const openEditModal = (task: StudyTask) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setDueDate(task.dueDate || todayIso);
    setPriority(task.priority || 'Media');
    setStatus(task.status);
    setTitleError(null);
    onOpenModal();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setTitleError('Debes escribir el nombre de la actividad.');
      titleInputRef.current?.focus();
      return;
    }

    const effectiveDate = dueDate.trim() || todayIso;

    const payload = {
      title: cleanTitle,
      description:
        description.trim() || 'Actividad práctica del curso de Google AI Studio.',
      dueDate: effectiveDate,
      priority,
      status,
    };

    if (editingTask) {
      onUpdateTask({ ...payload, id: editingTask.id });
    } else {
      onAddTask(payload);
    }

    setEditingTask(null);
    setTitleError(null);
    onCloseModal();
  };

  // Círculo de progreso compacto
  const circleSize = 52;
  const strokeWidth = 5;
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="space-y-4">
      {/* Tarjeta compacta de resumen encima de la lista de actividades */}
      <section
        aria-label="Resumen de tareas"
        className="rounded-2xl border border-slate-200 bg-white p-4"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="relative flex shrink-0 items-center justify-center"
              style={{ width: circleSize, height: circleSize }}
              role="img"
              aria-label={`${percentage}% de tareas completadas`}
            >
              <svg
                width={circleSize}
                height={circleSize}
                viewBox={`0 0 ${circleSize} ${circleSize}`}
                className="-rotate-90"
              >
                <circle
                  cx={circleSize / 2}
                  cy={circleSize / 2}
                  r={radius}
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth={strokeWidth}
                />
                <circle
                  cx={circleSize / 2}
                  cy={circleSize / 2}
                  r={radius}
                  fill="none"
                  stroke={percentage === 100 && totalCount > 0 ? '#16a34a' : '#2563eb'}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  className="transition-[stroke-dashoffset] duration-300"
                />
              </svg>
              <span className="absolute font-mono text-xs font-bold tabular-nums text-slate-900">
                {percentage}%
              </span>
            </div>

            <div className="min-w-0">
              <h2 className="text-base font-bold text-slate-900">
                Tareas y actividades
              </h2>
              <p className="mt-0.5 text-sm text-slate-600 tabular-nums">
                {completedCount} completadas · {pendingCount} pendientes
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="flex min-h-[48px] shrink-0 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 whitespace-nowrap"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Agregar
          </button>
        </div>

        {/* Barra de progreso simple */}
        <div
          className="mt-3.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-100"
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Porcentaje de tareas completadas"
        >
          <div
            className={`h-full w-full origin-left rounded-full transition-transform duration-300 ${
              percentage === 100 && totalCount > 0 ? 'bg-emerald-600' : 'bg-blue-600'
            }`}
            style={{ transform: `scaleX(${percentage / 100})` }}
          />
        </div>
      </section>

      {/* Barra de búsqueda en tiempo real y filtros en la parte superior de la lista */}
      <div className="space-y-2.5">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar actividad por nombre..."
            aria-label="Buscar actividad por nombre"
            className="w-full min-h-[44px] rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-11 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Limpiar búsqueda"
              className="absolute right-1.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>

        <div
          className="grid grid-cols-3 gap-1 rounded-2xl border border-slate-200 bg-white p-1.5"
          role="tablist"
          aria-label="Filtrar tareas por estado"
        >
          {(
            [
              { id: 'todas', label: `Todas (${totalCount})` },
              { id: 'pendientes', label: `Pend. (${pendingCount})` },
              { id: 'completadas', label: `Listas (${completedCount})` },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={filter === tab.id}
              onClick={() => setFilter(tab.id)}
              className={`min-h-[44px] rounded-xl px-2 py-2 text-xs font-semibold transition-colors ${
                filter === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de actividades */}
      {visibleTasks.length > 0 ? (
        <ul className="space-y-3">
          {visibleTasks.map((task) => {
            const isDone = task.status === 'completada';
            const priorityStyle = PRIORITY_STYLES[task.priority || 'Media'];

            return (
              <li
                key={task.id}
                className="rounded-2xl border border-slate-200 bg-white p-4"
              >
                <div className="flex flex-col gap-3">
                  <div>
                    {/* Indicador visual de prioridad y estado */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-semibold ${priorityStyle.badgeClass}`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${priorityStyle.dotClass}`}
                          aria-hidden="true"
                        />
                        {priorityStyle.label}
                      </span>

                      <span
                        className={`text-xs font-semibold ${
                          isDone ? 'text-emerald-700' : 'text-amber-700'
                        }`}
                      >
                        {isDone ? 'Completada' : 'Pendiente'}
                      </span>
                    </div>

                    {/* Nombre de la actividad junto a su fecha */}
                    <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
                      <h3
                        className={`text-base font-bold leading-snug ${
                          isDone ? 'text-slate-400 line-through' : 'text-slate-900'
                        }`}
                      >
                        {task.title}
                      </h3>
                      <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-blue-700 tabular-nums">
                        <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                        {formatReadableDate(task.dueDate || todayIso, todayIso)}
                      </span>
                    </div>

                    <p className="mt-1 text-sm leading-relaxed text-slate-600">
                      {task.description}
                    </p>
                  </div>

                  {/* Botones grandes de acción */}
                  <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                    <button
                      type="button"
                      onClick={() => onToggleTask(task.id)}
                      className={`flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
                        isDone
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                          : 'border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100'
                      }`}
                    >
                      {isDone ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                          Reabrir
                        </>
                      ) : (
                        <>
                          <Circle className="h-4 w-4" aria-hidden="true" />
                          Completar
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => openEditModal(task)}
                      className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                      Editar
                    </button>

                    {confirmDeleteId === task.id ? (
                      <div className="flex w-full items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            onDeleteTask(task.id);
                            setConfirmDeleteId(null);
                          }}
                          className="min-h-[44px] flex-1 rounded-xl bg-rose-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-rose-700"
                        >
                          Confirmar eliminar
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="min-h-[44px] rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(task.id)}
                        className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                        Eliminar
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-10 text-center">
          <p className="text-base font-semibold text-slate-900">
            {normalizedQuery
              ? 'No se encontraron actividades con ese nombre'
              : 'No hay actividades en esta vista'}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {tasks.length === 0
              ? 'Agrega tu primera actividad del curso para comenzar.'
              : normalizedQuery
              ? 'Prueba escribiendo otro nombre o limpia la búsqueda.'
              : 'Cambia el filtro arriba o agrega una nueva actividad.'}
          </p>
          {normalizedQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="mt-4 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Limpiar búsqueda
            </button>
          ) : (
            <button
              type="button"
              onClick={openCreateModal}
              className="mt-4 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Plus className="h-5 w-5" aria-hidden="true" />
              Agregar actividad
            </button>
          )}
        </div>
      )}

      {/* Modal táctil para crear o editar actividad */}
      <BottomSheetModal
        isOpen={isModalOpen}
        title={editingTask ? 'Editar actividad' : 'Nueva actividad'}
        onClose={() => {
          setEditingTask(null);
          setTitleError(null);
          onCloseModal();
        }}
      >
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label
              htmlFor="task-title"
              className="block text-sm font-semibold text-slate-800"
            >
              Nombre de la actividad
            </label>
            <input
              id="task-title"
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim()) {
                  setTitleError(null);
                }
              }}
              aria-invalid={Boolean(titleError)}
              aria-describedby={titleError ? 'task-title-error' : undefined}
              placeholder="Ej. Probar prompt con temperatura 0.2"
              className={`mt-1.5 w-full min-h-[44px] rounded-xl border bg-white px-3.5 py-2.5 text-base text-slate-900 focus:outline-none ${
                titleError
                  ? 'border-rose-500 focus:border-rose-600'
                  : 'border-slate-300 focus:border-blue-600'
              }`}
            />
            {titleError && (
              <p
                id="task-title-error"
                role="alert"
                className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-rose-700"
              >
                <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                {titleError}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="task-desc"
              className="block text-sm font-semibold text-slate-800"
            >
              Descripción
            </label>
            <textarea
              id="task-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe brevemente qué debes hacer o entregar..."
              className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 focus:border-blue-600 focus:outline-none"
            />
          </div>

          {/* Selector de fecha (usa hoy si se deja vacío) */}
          <div>
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="task-date"
                className="block text-sm font-semibold text-slate-800"
              >
                Fecha de entrega
              </label>
              <button
                type="button"
                onClick={() => setDueDate(todayIso)}
                className="text-xs font-semibold text-blue-700 hover:underline"
              >
                Usar fecha de hoy
              </button>
            </div>
            <input
              id="task-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1.5 w-full min-h-[44px] rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 focus:border-blue-600 focus:outline-none"
            />
            <p className="mt-1 text-xs text-slate-500">
              Si no eliges una fecha, se asignará automáticamente la de hoy.
            </p>
          </div>

          {/* Selector de nivel de prioridad */}
          <div>
            <span className="block text-sm font-semibold text-slate-800">
              Nivel de prioridad
            </span>
            <div
              className="mt-1.5 grid grid-cols-3 gap-2"
              role="radiogroup"
              aria-label="Nivel de prioridad"
            >
              {PRIORITY_OPTIONS.map((option) => {
                const isSelected = priority === option;
                const styles = PRIORITY_STYLES[option];
                return (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setPriority(option)}
                    className={`flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
                      isSelected
                        ? styles.activeButtonClass
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isSelected ? 'bg-white' : styles.dotClass
                      }`}
                      aria-hidden="true"
                    />
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          {editingTask && (
            <div>
              <label
                htmlFor="task-status"
                className="block text-sm font-semibold text-slate-800"
              >
                Estado
              </label>
              <select
                id="task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="mt-1.5 w-full min-h-[44px] rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 focus:border-blue-600 focus:outline-none"
              >
                <option value="pendiente">Pendiente</option>
                <option value="completada">Completada</option>
              </select>
            </div>
          )}

          <div className="flex flex-col-reverse gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => {
                setEditingTask(null);
                setTitleError(null);
                onCloseModal();
              }}
              className="min-h-[48px] rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="min-h-[48px] rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              {editingTask ? 'Guardar cambios' : 'Agregar actividad'}
            </button>
          </div>
        </form>
      </BottomSheetModal>
    </div>
  );
}
