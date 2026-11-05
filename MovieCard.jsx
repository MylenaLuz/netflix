import { Link } from "react-router-dom";
import { Heart, Pencil, Star } from "lucide-react";
import Poster from "./Poster";
import { useCatalog } from "../hooks/useCatalog";
import { formatRating, statusLabel } from "../utils/format";

export default function MovieCard({ movie }) {
  const { toggleFavorite, openEdit } = useCatalog();

  return (
    <article className="card">
      <Link to={`/filme/${movie._id}`} className="card__link">
        <Poster movie={movie} />
        <div className="card__info">
          <h3 className="card__title">{movie.title}</h3>
          <p className="card__meta">
            {movie.releaseYear && <span>{movie.releaseYear}</span>}
            <span className={`status-dot status-dot--${movie.status}`}>{statusLabel(movie.status)}</span>
          </p>
        </div>
      </Link>

      {movie.personalRating != null && (
        <span className="card__rating" aria-label={`Nota ${formatRating(movie.personalRating)}`}>
          <Star size={12} fill="currentColor" aria-hidden="true" /> {formatRating(movie.personalRating)}
        </span>
      )}

      <div className="card__actions">
        <button
          className={`icon-btn ${movie.favorite ? "is-active" : ""}`}
          onClick={() => toggleFavorite(movie)}
          aria-pressed={movie.favorite}
          aria-label={movie.favorite ? `Tirar ${movie.title} dos favoritos` : `Favoritar ${movie.title}`}
        >
          <Heart size={16} fill={movie.favorite ? "currentColor" : "none"} />
        </button>
        <button className="icon-btn" onClick={() => openEdit(movie)} aria-label={`Editar ${movie.title}`}>
          <Pencil size={16} />
        </button>
      </div>
    </article>
  );
}
