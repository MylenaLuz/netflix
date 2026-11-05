import { useMemo } from "react";
import HeroBanner from "../components/HeroBanner";
import MovieCarousel from "../components/MovieCarousel";
import { Loading, ErrorState } from "../components/StateView";
import { useAsync } from "../hooks/useAsync";
import { useCatalog } from "../hooks/useCatalog";
import { api } from "../services/api";

const byRating = (a, b) => (b.personalRating ?? -1) - (a.personalRating ?? -1);
const byUpdated = (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt);

// O destaque muda a cada dia entre os favoritos (ou entre todos, se não houver favoritos).
function pickFeatured(movies) {
  const pool = movies.filter((m) => m.favorite);
  const list = pool.length ? pool : movies;
  if (!list.length) return null;
  const day = Math.floor(Date.now() / 86_400_000);
  return [...list].sort((a, b) => a._id.localeCompare(b._id))[day % list.length];
}

export default function Home() {
  const { version } = useCatalog();
  const { data, loading, error, reload } = useAsync(() => api.listMovies({ limit: 200 }), [version]);

  const rows = useMemo(() => {
    const movies = data || [];
    return {
      featured: pickFeatured(movies),
      watching: movies.filter((m) => m.status === "watching").sort(byUpdated),
      favorites: movies.filter((m) => m.favorite),
      watchlist: movies.filter((m) => m.status === "watchlist"),
      watched: movies.filter((m) => m.status === "watched").sort(byUpdated),
      topRated: movies.filter((m) => m.personalRating != null).sort(byRating).slice(0, 12),
      recent: movies.slice(0, 12),
    };
  }, [data]);

  if (loading && !data) return <div className="page page--pad-top"><Loading /></div>;
  if (error) return <div className="page page--pad-top"><ErrorState error={error} onRetry={reload} /></div>;

  return (
    <>
      <HeroBanner movie={rows.featured} />
      <div className="rows">
        <MovieCarousel title="Continuar assistindo" movies={rows.watching} seeAllTo="/catalogo?status=watching" />
        <MovieCarousel title="Meus favoritos" movies={rows.favorites} seeAllTo="/minha-lista" />
        <MovieCarousel title="Quero assistir" movies={rows.watchlist} seeAllTo="/minha-lista?aba=quero-assistir" />
        <MovieCarousel title="Mais bem avaliados" movies={rows.topRated} seeAllTo="/catalogo?sort=personalRating:desc" />
        <MovieCarousel title="Assistidos recentemente" movies={rows.watched} seeAllTo="/catalogo?status=watched" />
        <MovieCarousel title="Adicionados por último" movies={rows.recent} seeAllTo="/catalogo" />
      </div>
    </>
  );
}
