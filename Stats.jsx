import StatCard from "../components/StatCard";
import { BarList, ColumnChart } from "../components/Charts";
import { Loading, ErrorState, EmptyState } from "../components/StateView";
import { useAsync } from "../hooks/useAsync";
import { useCatalog } from "../hooks/useCatalog";
import { api } from "../services/api";
import { formatRating } from "../utils/format";

export default function Stats() {
  const { version, openNew } = useCatalog();
  const { data: s, loading, error, reload } = useAsync(() => api.getStats(), [version]);

  if (loading && !s) return <div className="page page--pad-top"><Loading label="Calculando" /></div>;
  if (error) return <div className="page page--pad-top"><ErrorState error={error} onRetry={reload} /></div>;

  if (!s.total)
    return (
      <div className="page page--pad-top">
        <EmptyState title="Sem dados para calcular" message="As estatísticas aparecem quando houver filmes no catálogo."
          action={<button className="btn btn--accent" onClick={openNew}>Adicionar filme</button>} />
      </div>
    );

  const pct = (n) => `${Math.round((n / s.total) * 100)}% do catálogo`;

  return (
    <div className="page page--pad-top">
      <header className="page__head">
        <div>
          <h1 className="page__title">Estatísticas</h1>
          <p className="page__sub">Calculadas no MongoDB a partir dos {s.total} filmes cadastrados.</p>
        </div>
      </header>

      <div className="stats">
        <StatCard accent label="filmes no catálogo" value={s.total} hint={`${s.favorites} favoritos`} />
        <StatCard label="assistidos" value={s.watched} hint={pct(s.watched)} />
        <StatCard label="assistindo" value={s.watching} hint={pct(s.watching)} />
        <StatCard label="quero assistir" value={s.watchlist} hint={pct(s.watchlist)} />
        <StatCard label="nota média" value={s.averageRating != null ? formatRating(s.averageRating) : "—"} hint={`${s.rated} filmes avaliados`} />
        <StatCard label="horas assistidas" value={s.hoursWatched.toLocaleString("pt-BR")} hint="soma das durações dos assistidos" />
      </div>

      <div className="panels">
        <section className="panel">
          <h2 className="panel__title">Gêneros mais frequentes</h2>
          {s.genres.length ? <BarList items={s.genres} labelKey="genre" valueKey="count" /> : <p className="muted">Nenhum gênero cadastrado.</p>}
        </section>
        <section className="panel">
          <h2 className="panel__title">Filmes por década</h2>
          {s.decades.length ? (
            <ColumnChart items={s.decades} labelKey="decade" valueKey="count" format={(d) => `${d}s`} />
          ) : <p className="muted">Nenhum ano de lançamento cadastrado.</p>}
        </section>
      </div>
    </div>
  );
}
