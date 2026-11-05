import Modal from "./Modal";

export default function ConfirmDialog({ title, message, confirmLabel, busy, onConfirm, onCancel }) {
  return (
    <Modal title={title} onClose={busy ? () => {} : onCancel} size="sm" labelledBy="confirm-title">
      <p className="modal__text">{message}</p>
      <div className="modal__foot">
        <button className="btn btn--ghost" onClick={onCancel} disabled={busy} data-autofocus>
          Cancelar
        </button>
        <button className="btn btn--danger" onClick={onConfirm} disabled={busy}>
          {busy ? "Excluindo…" : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
