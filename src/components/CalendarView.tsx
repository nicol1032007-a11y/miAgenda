import { useState, FormEvent, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  Circle,
  Plus,
  Pencil,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { ClassSession, StudyTask } from '../types/agenda';
import {
  formatFullSpanishDate,
  formatReadableDate,
  getWeekDates,
  shiftDateByDays,
} from '../utils/dateUtils';
import { PRIORITY_STYLES } from '../utils/priorityStyles';
import { BottomSheetModal } from './BottomSheetModal';

interface CalendarViewProps {
  todayIso: string;
  classes: ClassSession[];
  tasks: StudyTask[];
  onAddClass: (session: Omit<ClassSession, 'id'>) => void;
  onUpdateClass: (session: ClassSession) => void;
  onDeleteClass: (id: string) => void;
  onToggleTask: (id: string) => void;
  isModalOpen: boolean;
  onOpenModal: () => void;
  onCloseModal: () => void;
}

type CalendarMode = 'dia' | 'semana';

export function CalendarView({
  todayIso,
  classes,
  tasks,
  onAddClass,
  onUpdateClass,
  onDeleteClass,
  onToggleTask,
  isModalOpen,
  onOpenModal,
  onCloseModal,
}: CalendarViewProps) {
  const [mode, setMode] = useState<CalendarMode>('dia');
  const [selectedDate, setSelectedDate] = useState<string>(todayIso);
  const [editingClass, setEditingClass] = useState<ClassSession | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Estado del formulario de clase
  const [title, setTitle] = useState('');
  const [moduleName, setModuleName] = useState('');
  const [date, setDate] = useState(todayIso);
  const [startTime, setStartTime] = useState('18:00');
  const [endTime, setEndTime] = useState('19:30');
  const [room, setRoom] = useState('Sesión en vivo · En línea');
  const [titleError, setTitleError] = useState<string | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const weekDays = getWeekDates(selectedDate);

  const openCreateModal = (prefillDate?: string) => {
    setEditingClass(null);
    setTitle('');
    setModuleName('Módulo de Google AI Studio');
    setDate(prefillDate || selectedDate || todayIso);
    setStartTime('18:00');
    setEndTime('19:30');
    setRoom('Sesión en vivo · En línea');
    setTitleError(null);
    onOpenModal();
  };

  const openEditModal = (session: ClassSession) => {
    setEditingClass(session);
    setTitle(session.title);
    setModuleName(session.module);
    setDate(session.date || todayIso);
    setStartTime(session.startTime);
    setEndTime(session.endTime);
    setRoom(session.instructorOrRoom);
    setTitleError(null);
    onOpenModal();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setTitleError('Debes escribir el nombre de la clase.');
      titleInputRef.current?.focus();
      return;
    }

    const effectiveDate = date.trim() || todayIso;

    const payload = {
      title: cleanTitle,
      module: moduleName.trim() || 'Curso Google AI Studio',
      date: effectiveDate,
      startTime,
      endTime,
      instructorOrRoom: room.trim() || 'En línea',
    };

    if (editingClass) {
      onUpdateClass({ ...payload, id: editingClass.id });
    } else {
      onAddClass(payload);
    }

    setEditingClass(null);
    setTitleError(null);
    setSelectedDate(effectiveDate);
    onCloseModal();
  };

  const dayClasses = classes
    .filter((c) => c.date === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
  const dayTasks = tasks.filter((t) => t.dueDate === selectedDate);

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-900">
              Calendario del curso
            </h2>
            <p className="mt-0.5 text-xs text-slate-600">
              Actividades por día y por semana
            </p>
          </div>

          <button
            type="button"
            onClick={() => openCreateModal(selectedDate)}
            className="flex min-h-[48px] shrink-0 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 whitespace-nowrap"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Clase
          </button>
        </div>

        {/* Selector Por día / Por semana */}
        <div
          className="mt-3.5 grid grid-cols-2 rounded-xl bg-slate-100 p-1"
          role="tablist"
          aria-label="Modo de calendario"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'dia'}
            onClick={() => setMode('dia')}
            className={`min-h-[44px] rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              mode === 'dia'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Por día
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'semana'}
            onClick={() => setMode('semana')}
            className={`min-h-[44px] rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              mode === 'semana'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Por semana
          </button>
        </div>

        {/* Cambio de semana */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setSelectedDate(shiftDateByDays(selectedDate, -7))}
            aria-label="Semana anterior"
            className="flex min-h-[44px] items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Anterior
          </button>
          <button
            type="button"
            onClick={() => setSelectedDate(todayIso)}
            className="min-h-[44px] rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Ir a hoy
          </button>
          <button
            type="button"
            onClick={() => setSelectedDate(shiftDateByDays(selectedDate, 7))}
            aria-label="Semana siguiente"
            className="flex min-h-[44px] items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Siguiente
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Selector de días de la semana */}
        <div
          className="mt-3 grid grid-cols-7 gap-1"
          role="group"
          aria-label="Días de la semana"
        >
          {weekDays.map((day) => {
            const isSelected = day.iso === selectedDate;
            const isToday = day.iso === todayIso;
            const hasActivity =
              classes.some((c) => c.date === day.iso) ||
              tasks.some((t) => t.dueDate === day.iso);

            return (
              <button
                key={day.iso}
                type="button"
                onClick={() => {
                  setSelectedDate(day.iso);
                  setMode('dia');
                }}
                className={`flex min-h-[58px] flex-col items-center justify-center rounded-xl border px-1 py-1.5 transition-colors ${
                  isSelected
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : isToday
                    ? 'border-blue-200 bg-blue-50 text-blue-900 hover:bg-blue-100'
                    : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                }`}
              >
                <span
                  className={`text-[11px] font-medium ${
                    isSelected ? 'text-blue-100' : 'text-slate-500'
                  }`}
                >
                  {day.shortDay}
                </span>
                <span className="mt-0.5 font-mono text-sm font-bold tabular-nums">
                  {day.dayNumber}
                </span>
                <span
                  aria-hidden="true"
                  className={`mt-1 h-1 w-3.5 rounded-full ${
                    hasActivity
                      ? isSelected
                        ? 'bg-blue-200'
                        : 'bg-blue-600'
                      : 'bg-transparent'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </section>

      {mode === 'dia' ? (
        <section
          aria-label="Actividades del día"
          className="rounded-2xl border border-slate-200 bg-white overflow-hidden"
        >
          <div className="border-b border-slate-100 px-4 py-3.5">
            <h3 className="text-base font-bold text-slate-900">
              {formatFullSpanishDate(selectedDate)}
              {selectedDate === todayIso && (
                <span className="ml-2 text-sm font-semibold text-blue-700">
                  · Hoy
                </span>
              )}
            </h3>
            <p className="mt-0.5 text-sm text-slate-600 tabular-nums">
              {dayClasses.length}{' '}
              {dayClasses.length === 1 ? 'clase' : 'clases'} · {dayTasks.length}{' '}
              {dayTasks.length === 1 ? 'entrega' : 'entregas'}
            </p>
          </div>

          {dayClasses.length === 0 && dayTasks.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <p className="text-base font-semibold text-slate-900">
                No hay actividades para este día
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Agrega una clase o elige otro día arriba.
              </p>
              <button
                type="button"
                onClick={() => openCreateModal(selectedDate)}
                className="mt-4 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                <Plus className="h-5 w-5" aria-hidden="true" />
                Agregar clase este día
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {dayClasses.map((session) => (
                <article key={session.id} className="p-4">
                  <p className="text-xs font-semibold text-blue-700">
                    Clase · {session.module}
                  </p>
                  <h4 className="mt-1 text-base font-bold text-slate-900">
                    {session.title}
                  </h4>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-600 tabular-nums">
                    <span className="inline-flex items-center gap-1.5 font-medium text-slate-800">
                      <Clock className="h-4 w-4 text-slate-500" aria-hidden="true" />
                      {session.startTime} - {session.endTime}
                    </span>
                    <span className="text-slate-300" aria-hidden="true">
                      ·
                    </span>
                    <span>{session.instructorOrRoom}</span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(session)}
                      className="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                      Editar
                    </button>

                    {confirmDeleteId === session.id ? (
                      <div className="flex w-full items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            onDeleteClass(session.id);
                            setConfirmDeleteId(null);
                          }}
                          className="min-h-[44px] flex-1 rounded-xl bg-rose-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-rose-700"
                        >
                          Confirmar eliminar
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="min-h-[44px] rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(session.id)}
                        className="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                        Eliminar
                      </button>
                    )}
                  </div>
                </article>
              ))}

              {dayTasks.map((task) => {
                const isDone = task.status === 'completada';
                const priorityStyle = PRIORITY_STYLES[task.priority || 'Media'];
                return (
                  <article key={task.id} className="p-4 bg-slate-50/40">
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
                      <span className="text-xs font-semibold text-amber-700">
                        Entrega · {isDone ? 'Completada' : 'Pendiente'}
                      </span>
                    </div>

                    <h4
                      className={`mt-2 text-base font-bold ${
                        isDone ? 'text-slate-400 line-through' : 'text-slate-900'
                      }`}
                    >
                      {task.title}
                    </h4>
                    <p className="mt-1 text-sm text-slate-600">
                      {task.description}
                    </p>

                    <button
                      type="button"
                      onClick={() => onToggleTask(task.id)}
                      className={`mt-3 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                        isDone
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                          : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      {isDone ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                          Completada
                        </>
                      ) : (
                        <>
                          <Circle className="h-4 w-4 text-slate-400" aria-hidden="true" />
                          Marcar completada
                        </>
                      )}
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      ) : (
        <section aria-label="Resumen semanal" className="space-y-3">
          {weekDays.map((day) => {
            const listClasses = classes
              .filter((c) => c.date === day.iso)
              .sort((a, b) => a.startTime.localeCompare(b.startTime));
            const listTasks = tasks.filter((t) => t.dueDate === day.iso);

            return (
              <div
                key={day.iso}
                className="rounded-2xl border border-slate-200 bg-white p-4"
              >
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {formatFullSpanishDate(day.iso)}
                    </h3>
                    <p className="text-xs text-slate-500 tabular-nums">
                      {day.iso === todayIso ? 'Hoy · ' : ''}
                      {listClasses.length}{' '}
                      {listClasses.length === 1 ? 'clase' : 'clases'} ·{' '}
                      {listTasks.length}{' '}
                      {listTasks.length === 1 ? 'tarea' : 'tareas'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDate(day.iso);
                      setMode('dia');
                    }}
                    className="min-h-[44px] rounded-xl px-3 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                  >
                    Ver día
                  </button>
                </div>

                {listClasses.length === 0 && listTasks.length === 0 ? (
                  <p className="pt-3 text-sm text-slate-400">
                    Sin actividades programadas.
                  </p>
                ) : (
                  <ul className="mt-3 space-y-2">
                    {listClasses.map((session) => (
                      <li
                        key={session.id}
                        className="rounded-xl bg-slate-50 px-3.5 py-2.5"
                      >
                        <p className="text-xs font-semibold text-blue-700 tabular-nums">
                          Clase · {session.startTime} - {session.endTime}
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-slate-900">
                          {session.title}
                        </p>
                      </li>
                    ))}
                    {listTasks.map((task) => {
                      const priorityStyle = PRIORITY_STYLES[task.priority || 'Media'];
                      return (
                        <li
                          key={task.id}
                          className="rounded-xl bg-slate-50 px-3.5 py-2.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p
                              className={`text-xs font-semibold ${
                                task.status === 'completada'
                                  ? 'text-emerald-700'
                                  : 'text-amber-700'
                              }`}
                            >
                              Entrega ·{' '}
                              {task.status === 'completada'
                                ? 'Completada'
                                : 'Pendiente'}
                            </p>
                            <span
                              className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-semibold border ${priorityStyle.badgeClass}`}
                            >
                              {task.priority || 'Media'}
                            </span>
                          </div>
                          <p
                            className={`mt-0.5 text-sm font-semibold ${
                              task.status === 'completada'
                                ? 'text-slate-400 line-through'
                                : 'text-slate-900'
                            }`}
                          >
                            {task.title}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </section>
      )}

      {/* Modal para agregar o editar clase */}
      <BottomSheetModal
        isOpen={isModalOpen}
        title={editingClass ? 'Editar clase' : 'Agregar nueva clase'}
        onClose={() => {
          setEditingClass(null);
          setTitleError(null);
          onCloseModal();
        }}
      >
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label
              htmlFor="class-title"
              className="block text-sm font-semibold text-slate-800"
            >
              Nombre de la clase
            </label>
            <input
              id="class-title"
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
              aria-describedby={titleError ? 'class-title-error' : undefined}
              placeholder="Ej. Práctica con System Instructions"
              className={`mt-1.5 w-full min-h-[44px] rounded-xl border bg-white px-3.5 py-2.5 text-base text-slate-900 focus:outline-none ${
                titleError
                  ? 'border-rose-500 focus:border-rose-600'
                  : 'border-slate-300 focus:border-blue-600'
              }`}
            />
            {titleError && (
              <p
                id="class-title-error"
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
              htmlFor="class-module"
              className="block text-sm font-semibold text-slate-800"
            >
              Módulo o tema
            </label>
            <input
              id="class-module"
              type="text"
              value={moduleName}
              onChange={(e) => setModuleName(e.target.value)}
              placeholder="Ej. Módulo 2 · Ingeniería de Prompts"
              className="mt-1.5 w-full min-h-[44px] rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="class-date"
              className="block text-sm font-semibold text-slate-800"
            >
              Fecha
            </label>
            <input
              id="class-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1.5 w-full min-h-[44px] rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 focus:border-blue-600 focus:outline-none"
            />
            <p className="mt-1 text-xs text-slate-500">
              Si no eliges una fecha, se usará la de hoy ({formatReadableDate(todayIso)}).
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="class-start"
                className="block text-sm font-semibold text-slate-800"
              >
                Hora inicio
              </label>
              <input
                id="class-start"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-1.5 w-full min-h-[44px] rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="class-end"
                className="block text-sm font-semibold text-slate-800"
              >
                Hora fin
              </label>
              <input
                id="class-end"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="mt-1.5 w-full min-h-[44px] rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="class-room"
              className="block text-sm font-semibold text-slate-800"
            >
              Modalidad o sala
            </label>
            <input
              id="class-room"
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="Ej. Sesión en vivo · Sala A"
              className="mt-1.5 w-full min-h-[44px] rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div className="flex flex-col-reverse gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => {
                setEditingClass(null);
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
              {editingClass ? 'Guardar cambios' : 'Guardar clase'}
            </button>
          </div>
        </form>
      </BottomSheetModal>
    </div>
  );
}
