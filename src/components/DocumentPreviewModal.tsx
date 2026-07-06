import { X, Download, ExternalLink } from "lucide-react";
import { useEffect } from "react";

export function DocumentPreviewModal({ open, onClose, name, type }: {
  open: boolean; onClose: () => void; name: string; type: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  const url = "/sample-document.pdf";
  return (
    <div className="fixed inset-0 z-[80] bg-black/60 flex items-center justify-center p-6 animate-fade-in" onClick={onClose}>
      <div className="bg-card rounded-[12px] shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-5 h-14 border-b border-line-card">
          <div className="min-w-0 flex-1">
            <div className="text-[13.5px] font-bold text-ink-body truncate">{name}</div>
            <div className="text-[11px] text-ink-muted uppercase tracking-wide">{type}</div>
          </div>
          <a href={url} target="_blank" rel="noopener noreferrer"
             className="h-8 px-3 rounded-md border border-line-card text-[12px] font-semibold text-ink-body flex items-center gap-1.5 hover:bg-surface-input">
            <ExternalLink className="w-3.5 h-3.5" /> Open
          </a>
          <a href={url} download={`${name}.pdf`}
             className="h-8 px-3 rounded-md bg-brand-blue text-white text-[12px] font-semibold flex items-center gap-1.5 hover:brightness-110">
            <Download className="w-3.5 h-3.5" /> Download
          </a>
          <button onClick={onClose} className="w-8 h-8 grid place-items-center rounded hover:bg-surface-input text-ink-muted">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 bg-surface-subtle">
          <iframe src={url} title={name} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}
