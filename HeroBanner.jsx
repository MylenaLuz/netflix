import { Link } from "react-router-dom";
import { Info, Plus, Star } from "lucide-react";
import Poster from "./Poster";
import { useCatalog } from "../hooks/useCatalog";
import { formatDuration, formatRating, statusLabel } from "../utils/format";

export default function HeroBanner({ movie }) {
  const { openNew } = useCatalog();

  if (!movie) {
    return (
      <section className="hero hero--empty">
        <div className="hero__backdrop hero__backdrop--lamp" aria-hidden="true" />
        <div className="hero__content">
          <h1 className="hero__title">A sala está vazia</h1>
          <p className="hero__synopsis">
            Cadastre o primeiro filme e ele aparece aqui em destaque. Os filmes de demonstração entram com
            <code> npm run seed</code> no backend.
          </p>
          <div className="hero__actions">
            <button className="btn btn--light" onClick={openNew}>
              <Plus size={20} aria-hidden="true" /> Adicionar filme
            </button>
          </div>
        </div>
      </section>
    );
  }

  const meta = [movie.releaseYear, formatDuration(movie.durationMinutes), movie.genres?.slice(0, 2).join(", ")]
    .filter(Boolean);

  return (
    <section className="hero">
      <Poster movie={movie} variant="backdrop" className="hero__backdrop" />
      <div className="hero__content">
        <p className="hero__kicker">{movie.favorite ? "Um dos seus favoritos" : statusLabel(movie.status)}</p>
        <h1 className="hero__title">{movie.title}</h1>
        <p className="hero__meta">
          {movie.personalRating != null && (
            <span className="hero__rating">
              <Star size={16} fill="currentColor" aria-hidden="true" /> {formatRating(movie.personalRating)}
            </span>
          )}
          {meta.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </p>
        {movie.synopsis && <p className="hero__synopsis">{movie.synopsis}</p>}
        <div className="hero__actions">
          <Link to={`/filme/${movie._id}`} className="btn btn--light">
            <Info size={20} aria-hidden="true" /> Ver detalhes
          </Link>
          <button className="btn btn--glass" onClick={openNew}>
            <Plus size={20} aria-hidden="true" /> Adicionar filme
          </button>
        </div>
      </div>
    </section>
  );
}
