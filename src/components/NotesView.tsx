import { useState, FormEvent, useMemo, useRef } from 'react';
import { Plus, Search, Pencil, Trash2, X, AlertCircle } from 'lucide-react';
import { StudyNote } from '../types/agenda';
import { formatReadableDate } from '../utils/dateUtils';
import { BottomSheetModal } from './BottomSheetModal';

interface NotesViewProps {
  todayIso: string;
  notes: StudyNote[];
  onAddNote: (note: Omit<StudyNote, 'id' | 'updatedAt'>) => void;
  onUpdateNote: (note: StudyNote) => void;
  onDeleteNote: (id: string) => void;
}

export function NotesView({
  todayIso,
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
}: NotesViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<StudyNote | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const topics = useMemo(() => {
    const unique = Array.from(new Set(notes.map((n) => n.topic).filter(Boolean)));
    return ['Todos', ...unique];
  }, [notes]);

  const filteredNotes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return notes.filter((note) => {
      if (selectedTopic !== 'Todos' && note.topic !== selectedTopic) {
        return false;
      }
      if (
        q &&
        !note.title.toLowerCase().includes(q) &&
        !note.content.toLowerCase().includes(q) &&
        !note.topic.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [notes, selectedTopic, searchQuery]);

  const openCreateModal = () => {
    setEditingNote(null);
    setTitle('');
    setTopic('Diseño de Prompts');
    setContent('');
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (note: StudyNote) => {
    setEditingNote(note);
    setTitle(note.title);
    setTopic(note.topic);
    setContent(note.content);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    const cleanContent = content.trim();
    if (!cleanTitle || !cleanContent) {
      setFormError('Debes escribir un título y el contenido del apunte.');
      if (!cleanTitle) titleInputRef.current?.focus();
      return;
    }

    const cleanTopic = topic.trim() || 'General del curso';

    if (editingNote) {
      onUpdateNote({
        ...editingNote,
        title: cleanTitle,
        topic: cleanTopic,
        content: cleanContent,
        updatedAt: todayIso,
      });
    } else {
      onAddNote({
        title: cleanTitle,
        topic: cleanTopic,
        content: cleanContent,
      });
    }

    setEditingNote(null);
    setFormError(null);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-900">
              Apuntes del curso
            </h2>
            <p className="mt-0.5 text-xs text-slate-600">
              Notas rápidas sobre Google AI Studio
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="flex min-h-[48px] shrink-0 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 whitespace-nowrap"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Nuevo
          </button>
        </div>

        <div className="mt-3.5 space-y-3">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar en tus apuntes..."
              aria-label="Buscar en apuntes"
              className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Limpiar búsqueda"
                className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>

          <div
            className="flex items-center gap-1.5 overflow-x-auto pb-1"
            role="group"
            aria-label="Filtrar por tema"
          >
            {topics.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setSelectedTopic(item)}
                className={`min-h-[40px] shrink-0 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                  selectedTopic === item
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      {filteredNotes.length > 0 ? (
        <div className="space-y-3">
          {filteredNotes.map((note) => (
            <article
              key={note.id}
              className="rounded-2xl border border-slate-200 bg-white p-4"
            >
              <p className="text-xs font-semibold text-blue-700">
                {note.topic}
                <span className="mx-1.5 text-slate-300" aria-hidden="true">
                  ·
                </span>
                <span className="font-normal text-slate-500 tabular-nums">
                  Actualizado {formatReadableDate(note.updatedAt, todayIso)}
                </span>
              </p>
              <h3 className="mt-1.5 text-base font-bold text-slate-900">
                {note.title}
              </h3>
              <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-slate-700">
                {note.content}
              </p>

              <div className="mt-3.5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => openEditModal(note)}
                  className="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                  Editar
                </button>

                {confirmDeleteId === note.id ? (
                  <div className="flex w-full items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        onDeleteNote(note.id);
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
                    onClick={() => setConfirmDeleteId(note.id)}
                    className="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    Eliminar
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-10 text-center">
          <p className="text-base font-semibold text-slate-900">
            No se encontraron apuntes
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {notes.length === 0
              ? 'Crea tu primer apunte para guardar lo aprendido en clase.'
              : 'Prueba con otra palabra o selecciona otro tema.'}
          </p>
          <button
            type="button"
            onClick={openCreateModal}
            className="mt-4 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" aria-hidden="true" />
            Crear apunte
          </button>
        </div>
      )}

      <BottomSheetModal
        isOpen={isModalOpen}
        title={editingNote ? 'Editar apunte' : 'Nuevo apunte'}
        onClose={() => {
          setEditingNote(null);
          setFormError(null);
          setIsModalOpen(false);
        }}
      >
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {formError && (
            <p
              role="alert"
              className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm font-medium text-rose-700"
            >
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              {formError}
            </p>
          )}

          <div>
            <label
              htmlFor="note-title"
              className="block text-sm font-semibold text-slate-800"
            >
              Título del apunte
            </label>
            <input
              id="note-title"
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim() && content.trim()) {
                  setFormError(null);
                }
              }}
              placeholder="Ej. Ejemplos few-shot en Google AI Studio"
              className="mt-1.5 w-full min-h-[44px] rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="note-topic"
              className="block text-sm font-semibold text-slate-800"
            >
              Tema del curso
            </label>
            <input
              id="note-topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ej. Diseño de Prompts"
              className="mt-1.5 w-full min-h-[44px] rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="note-content"
              className="block text-sm font-semibold text-slate-800"
            >
              Contenido del apunte
            </label>
            <textarea
              id="note-content"
              rows={5}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (title.trim() && e.target.value.trim()) {
                  setFormError(null);
                }
              }}
              placeholder="Escribe aquí tus notas de clase, ejemplos o recordatorios..."
              className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base leading-relaxed text-slate-900 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div className="flex flex-col-reverse gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => {
                setEditingNote(null);
                setFormError(null);
                setIsModalOpen(false);
              }}
              className="min-h-[48px] rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="min-h-[48px] rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              {editingNote ? 'Guardar cambios' : 'Guardar apunte'}
            </button>
          </div>
        </form>
      </BottomSheetModal>
    </div>
  );
}
