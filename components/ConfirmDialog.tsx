"use client";

import { useEffect, useId, useRef } from "react";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  cancelLabel?: string;
  confirmLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
};

export function ConfirmDialog({
  open,
  title,
  description,
  cancelLabel = "Cancelar",
  confirmLabel = "Confirmar",
  destructive = false,
  loading = false,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const cancelButton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const cancelAction = useRef(onCancel);

  useEffect(() => {
    cancelAction.current = onCancel;
  }, [onCancel]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    cancelButton.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) cancelAction.current();
      if (event.key === "Tab") {
        const controls = panel.current?.querySelectorAll<HTMLElement>(
          "button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex='-1'])",
        );
        if (!controls?.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [loading, open]);

  if (!open) return null;

  return (
    <div
      className="dialog-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) onCancel();
      }}
    >
      <div
        ref={panel}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="dialog-panel"
      >
        <h2 id={titleId} className="text-lg font-bold text-slate-900">
          {title}
        </h2>
        <p id={descriptionId} className="mt-2 text-sm leading-6 text-slate-500">
          {description}
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            ref={cancelButton}
            type="button"
            className="button-secondary min-w-0"
            disabled={loading}
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`${destructive ? "button-danger" : "button-primary"} min-w-0 disabled:cursor-not-allowed disabled:opacity-60`}
            disabled={loading}
            onClick={() => void onConfirm()}
          >
            {loading ? "A eliminar…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
