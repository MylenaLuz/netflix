import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus } from "lucide-react";
import FilterBar from "../components/FilterBar";
import MovieGrid from "../components/MovieGrid";
import { Loading, ErrorState, EmptyState } from "../components/StateView";
import { useAsync } from "../hooks/useAsync";
import { useCatalog } from "../hooks/useCatalog";
import { useDebounced } from "../hooks/useDebounced";
import { api } from "../services/api";

const DEFAULT_SORT = "createdAt:desc";

export default function Catalog() {
  const { version, openNew } = useCatalog();
  const [params, setParams] = useSearchParams();

  const values = {
    search: params.get("search") || "",
    genre: params.get("genre") || "",
    status: params.get("status") || "",
    favorite: params.get("favorite") || "",
    sort: params.get("sort") || DEFAULT_SORT,
  };

  // A busca digitada é atualizada na hora, mas só consulta a API após uma pausa.
  const [searchInput, setSearchInput] = useState(values.search);
  useEffect(() => {
    setSearchInput(values.search);
  }, [values.search]);
  const search = useDebounced(searchInput, 300);

  const update = (key, value) => {
    if (key === "search") return setSearchInput(value);
    const next = new URLSearchParams(params);
    if (value && !(key === "sort" && value === DEFAULT_SORT)) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  useEffect(() => {
    if (search === values.search) return;
    const next = new URLSearchParams(params);
    search ? next.set("search", search) : next.delete("search");
    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const [sortBy, order] = values.sort.split(":");
  const query = { search: values.search, genre: values.genre, status: values.status, favorite: values.favorite, sortBy, order };

  const movies = useAsync(() => api.listMovies(query), [JSON.stringify(query), version]);
  const genres = useAsync(() => api.listGenres(), [version]);

  const filtered = values.search || values.genre || values.status || values.favorite;

  return (
    <div className="page page--pad-top">
      <header className="page__head">
        <div>
          <h1 className="page__title">Meu catálogo</h1>
          {movies.data && (
            <p className="page__sub">
              {movies.data.length} {movies.data.length === 1 ? "filme" : "filmes"}
              {filtered ? " com esses filtros" : " cadastrados"}
            </p>
          )}
        </div>
        <button className="btn btn--accent" onClick={openNew}>
          <Plus size={20} aria-hidden="true" /> Adicionar filme
        </button>
      </header>

      <FilterBar
        values={{ ...values, search: searchInput }}
        genres={genres.data || []}
        onChange={update}
        onClear={() => { setSearchInput(""); setParams({}, { replace: true }); }}
      />

      {movies.error ? (
        <ErrorState error={movies.error} onRetry={movies.reload} />
      ) : movies.loading && !movies.data ? (
        <Loading />
      ) : movies.data?.length ? (
        <div className={movies.loading ? "is-refreshing" : ""}>
          <MovieGrid movies={movies.data} />
        </div>
      ) : filtered ? (
        <EmptyState
          title="Nenhum filme com esses filtros"
          message="Tente outro termo de busca ou remova algum filtro."
          action={<button className="btn btn--ghost" onClick={() => { setSearchInput(""); setParams({}, { replace: true }); }}>Limpar filtros</button>}
        />
      ) : (
        <EmptyState
          title="Seu catálogo está vazio"
          message="Adicione o primeiro filme para começar."
          action={<button className="btn btn--accent" onClick={openNew}><Plus size={18} aria-hidden="true" /> Adicionar filme</button>}
        />
      )}
    </div>
  );
}
