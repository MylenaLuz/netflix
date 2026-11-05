import { AlertTriangle, Film, RotateCcw } from "lucide-react";

export function Loading({ label = "Carregando filmes" }) {
  return (
    <div className="state" role="status">
      <span className="spinner" aria-hidden="true" />
      <p>{label}…</p>
    </div>
  );
}

export function ErrorState({ error, onRetry }) {
  return (
    <div className="state state--error" role="alert">
      <AlertTriangle size={36} aria-hidden="true" />
      <h2>Não deu para carregar</h2>
      <p>{error?.message || "A API não respondeu."}</p>
      {onRetry && (
        <button className="btn btn--ghost" onClick={onRetry}>
          <RotateCcw size={18} aria-hidden="true" /> Tentar de novo
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, message, action }) {
  return (
    <div className="state">
      <Film size={36} aria-hidden="true" />
      <h2>{title}</h2>
      {message && <p>{message}</p>}
      {action}
    </div>
  );
}
