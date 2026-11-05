import { createContext, useCallback, useContext, useState } from "react";
import { api } from "../services/api";
import { useToast } from "./useToast";
import MovieForm from "../components/MovieForm";
import ConfirmDialog from "../components/ConfirmDialog";

/*
 * Estado compartilhado do catálogo:
 * - `version` muda a cada alteração, e as páginas a usam para recarregar os dados;
 * - abre o formulário (criar/editar) e a confirmação de exclusão de qualquer lugar.
 */
const CatalogContext = createContext(null);

export function CatalogProvider({ children }) {
  const notify = useToast();
  const [version, setVersion] = useState(0);
  const [editing, setEditing] = useState(null); // null | {} (novo) | movie
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  const saveMovie = async (data) => {
    const isNew = !editing?._id;
    const saved = isNew ? await api.createMovie(data) : await api.updateMovie(editing._id, data);
    notify(isNew ? `“${saved.title}” adicionado ao catálogo.` : `“${saved.title}” atualizado.`);
    setEditing(null);
    refresh();
    return saved;
  };

  const patchMovie = useCallback(
    async (movie, changes, message) => {
      try {
        await api.updateMovie(movie._id, changes);
        if (message) notify(message);
        refresh();
      } catch (err) {
        notify(err.message, "error");
      }
    },
    [notify, refresh]
  );

  const toggleFavorite = useCallback(
    (movie) =>
      patchMovie(
        movie,
        { favorite: !movie.favorite },
        movie.favorite ? `“${movie.title}” saiu dos favoritos.` : `“${movie.title}” agora é favorito.`
      ),
    [patchMovie]
  );

  const confirmDelete = async () => {
    setBusy(true);
    try {
      await api.deleteMovie(deleting._id);
      notify(`“${deleting.title}” excluído.`);
      deleting.onDeleted?.();
      setDeleting(null);
      refresh();
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setBusy(false);
    }
  };

  const value = {
    version,
    refresh,
    openNew: () => setEditing({}),
    openEdit: (movie) => setEditing(movie),
    askDelete: (movie, onDeleted) => setDeleting({ ...movie, onDeleted }),
    toggleFavorite,
    patchMovie,
  };

  return (
    <CatalogContext.Provider value={value}>
      {children}
      {editing && <MovieForm movie={editing} onSubmit={saveMovie} onClose={() => setEditing(null)} />}
      {deleting && (
        <ConfirmDialog
          title="Excluir filme?"
          message={`“${deleting.title}” será removido do catálogo. Essa ação não pode ser desfeita.`}
          confirmLabel="Excluir filme"
          busy={busy}
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </CatalogContext.Provider>
  );
}

export const useCatalog = () => useContext(CatalogContext);
