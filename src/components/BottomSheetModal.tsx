import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface BottomSheetModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function BottomSheetModal({
  isOpen,
  title,
  onClose,
  children,
}: BottomSheetModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-sheet-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[430px] max-h-[90vh] overflow-y-auto rounded-t-3xl bg-white p-5 pb-7 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Indicador superior táctil para teléfono */}
        <div
          className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-slate-300"
          aria-hidden="true"
        />

        <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <h2
            id="modal-sheet-title"
            className="text-lg font-bold text-slate-900"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
