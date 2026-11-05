import { useState } from "react";
import { posterTheme } from "../utils/format";

/*
 * Mostra o pôster pela URL cadastrada. Sem URL, ou se a imagem falhar,
 * desenha um pôster tipográfico com cores derivadas do título.
 */
export default function Poster({ movie, variant = "poster", className = "" }) {
  const url = variant === "backdrop" ? movie.backdropUrl || movie.posterUrl : movie.posterUrl;
  const [failed, setFailed] = useState(false);

  if (url && !failed) {
    return (
      <img
        className={`poster poster--${variant} ${className}`}
        src={url}
        alt={variant === "poster" ? `Pôster de ${movie.title}` : ""}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div
      className={`poster poster--${variant} poster--generated ${className}`}
      style={posterTheme(movie.title)}
      role={variant === "poster" ? "img" : undefined}
      aria-label={variant === "poster" ? `Pôster de ${movie.title}` : undefined}
      aria-hidden={variant === "poster" ? undefined : true}
    >
      {variant === "poster" && (
        <>
          <span className="poster__title">{movie.title}</span>
          {(movie.releaseYear || movie.director) && (
            <span className="poster__credit">
              {[movie.releaseYear, movie.director].filter(Boolean).join(" · ")}
            </span>
          )}
        </>
      )}
    </div>
  );
}
