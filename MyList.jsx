import { Link, useSearchParams } from "react-router-dom";
import MovieGrid from "../components/MovieGrid";
import { Loading, ErrorState, EmptyState } from "../components/StateView";
import { useAsync } from "../hooks/useAsync";
import { useCatalog } from "../hooks/useCatalog";
import { api } from "../services/api";

const TABS = {
  favoritos: { label: "Favoritos", query: { favorite: "true" }, empty: "Toque no coração de um filme para guardá-lo aqui." },
  "quero-assistir": { label: "Quero assistir", query: { status: "watchlist" }, empty: "Filmes com status “Quero assistir” aparecem aqui." },
};

export default function MyList() {
  const { version } = useCatalog();
  const [params, setParams] = useSearchParams();
  const tab = TABS[params.get("aba")] ? params.get("aba") : "favoritos";
  const { data, loading, error, reload } = useAsync(
    () => api.listMovies({ ...TABS[tab].query, sortBy: "updatedAt", order: "desc" }),
    [tab, version]
  );

  return (
    <div className="page page--pad-top">
      <header className="page__head">
        <h1 className="page__title">Minha lista</h1>
      </header>

      <div className="tabs" role="tablist" aria-label="Seções da lista">
        {Object.entries(TABS).map(([key, t]) => (
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            className={tab === key ? "is-on" : ""}
            onClick={() => setParams(key === "favoritos" ? {} : { aba: key }, { replace: true })}
          >
            {t.label}
            {tab === key && data && <span className="tabs__count">{data.length}</span>}
          </button>
        ))}
      </div>

      <div role="tabpanel">
        {error ? (
          <ErrorState error={error} onRetry={reload} />
        ) : loading && !data ? (
          <Loading />
        ) : data?.length ? (
          <MovieGrid movies={data} />
        ) : (
          <EmptyState
            title={`Nada em “${TABS[tab].label}” ainda`}
            message={TABS[tab].empty}
            action={<Link className="btn btn--ghost" to="/catalogo">Explorar o catálogo</Link>}
          />
        )}
      </div>
    </div>
  );
}
