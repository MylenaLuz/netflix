import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Heart, Pencil, Trash2, Star, Clock, Calendar, Clapperboard } from "lucide-react";
import Poster from "../components/Poster";
import { Loading, ErrorState, EmptyState } from "../components/StateView";
import { useAsync } from "../hooks/useAsync";
import { useCatalog } from "../hooks/useCatalog";
import { api } from "../services/api";
import { STATUS_OPTIONS, formatDuration, formatRating, statusLabel } from "../utils/format";

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { version, openEdit, askDelete, toggleFavorite, patchMovie } = useCatalog();
  const { data: movie, loading, error, reload } = useAsync(() => api.getMovie(id), [id, version]);

  if (loading && !movie) return <div className="page page--pad-top"><Loading label="Carregando filme" /></div>;
  if (error?.status === 404 || error?.status === 400)
    return (
      <div className="page page--pad-top">
        <EmptyState title="Filme não encontrado" message="Ele pode ter sido excluído." action={<Link className="btn btn--ghost" to="/catalogo">Ir para o catálogo</Link>} />
      </div>
    );
  if (error) return <div className="page page--pad-top"><ErrorState error={error} onRetry={reload} /></div>;

  return (
    <article className="details">
      <div className="details__backdrop">
        <Poster movie={movie} variant="backdrop" />
      </div>

      <div className="details__body page">
        <button className="btn btn--ghost btn--sm details__back" onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/catalogo"))}>
          <ArrowLeft size={18} aria-hidden="true" /> Voltar
        </button>

        <div className="details__grid">
          <Poster movie={movie} className="details__poster" />

          <div className="details__info">
            <h1 className="details__title">{movie.title}</h1>

            <ul className="details__facts">
              {movie.personalRating != null && (
                <li className="details__rating"><Star size={18} fill="currentColor" aria-hidden="true" /> {formatRating(movie.personalRating)} <span>/ 10</span></li>
              )}
              {movie.releaseYear && <li><Calendar size={16} aria-hidden="true" /> {movie.releaseYear}</li>}
              {movie.durationMinutes && <li><Clock size={16} aria-hidden="true" /> {formatDuration(movie.durationMinutes)}</li>}
              {movie.director && <li><Clapperboard size={16} aria-hidden="true" /> {movie.director}</li>}
            </ul>

            {movie.genres?.length > 0 && (
              <div className="chips chips--static">
                {movie.genres.map((g) => (
                  <Link key={g} className="chip" to={`/catalogo?genre=${encodeURIComponent(g)}`}>{g}</Link>
                ))}
              </div>
            )}

            <p className="details__synopsis">{movie.synopsis || "Sem sinopse cadastrada."}</p>

            <div className="details__status">
              <span id="status-label">Status</span>
              <div className="segmented" role="radiogroup" aria-labelledby="status-label">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s.value}
                    role="radio"
                    aria-checked={movie.status === s.value}
                    className={movie.status === s.value ? "is-on" : ""}
                    onClick={() => movie.status !== s.value && patchMovie(movie, { status: s.value }, `Status alterado para “${s.label}”.`)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="details__actions">
              <button className={`btn ${movie.favorite ? "btn--accent" : "btn--ghost"}`} onClick={() => toggleFavorite(movie)} aria-pressed={movie.favorite}>
                <Heart size={18} fill={movie.favorite ? "currentColor" : "none"} aria-hidden="true" />
                {movie.favorite ? "Favorito" : "Favoritar"}
              </button>
              <button className="btn btn--ghost" onClick={() => openEdit(movie)}>
                <Pencil size={18} aria-hidden="true" /> Editar
              </button>
              <button className="btn btn--ghost btn--danger-text" onClick={() => askDelete(movie, () => navigate("/catalogo"))}>
                <Trash2 size={18} aria-hidden="true" /> Excluir
              </button>
            </div>

            <p className="details__stamp">
              Adicionado em {new Date(movie.createdAt).toLocaleDateString("pt-BR")} · {statusLabel(movie.status)}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
