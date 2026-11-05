import { Search, X } from "lucide-react";
import { STATUS_OPTIONS } from "../utils/format";

export const SORT_OPTIONS = [
  { value: "createdAt:desc", label: "Adicionados recentemente" },
  { value: "personalRating:desc", label: "Maior nota" },
  { value: "personalRating:asc", label: "Menor nota" },
  { value: "releaseYear:desc", label: "Mais novos" },
  { value: "releaseYear:asc", label: "Mais antigos" },
  { value: "title:asc", label: "Título (A–Z)" },
];

export default function FilterBar({ values, genres, onChange, onClear }) {
  const hasFilters = values.search || values.genre || values.status || values.favorite;

  return (
    <div className="filters">
      <div className="field field--search">
        <Search size={18} aria-hidden="true" />
        <label className="sr-only" htmlFor="f-search">Pesquisar por título</label>
        <input
          id="f-search"
          type="search"
          placeholder="Pesquisar por título"
          value={values.search}
          onChange={(e) => onChange("search", e.target.value)}
        />
      </div>

      <label className="select">
        <span className="sr-only">Gênero</span>
        <select value={values.genre} onChange={(e) => onChange("genre", e.target.value)}>
          <option value="">Todos os gêneros</option>
          {genres.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </label>

      <label className="select">
        <span className="sr-only">Status</span>
        <select value={values.status} onChange={(e) => onChange("status", e.target.value)}>
          <option value="">Qualquer status</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </label>

      <label className="select">
        <span className="sr-only">Ordenar por</span>
        <select value={values.sort} onChange={(e) => onChange("sort", e.target.value)}>
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </label>

      <label className="check">
        <input
          type="checkbox"
          checked={values.favorite === "true"}
          onChange={(e) => onChange("favorite", e.target.checked ? "true" : "")}
        />
        Só favoritos
      </label>

      {hasFilters && (
        <button className="btn btn--ghost btn--sm" onClick={onClear}>
          <X size={16} aria-hidden="true" /> Limpar filtros
        </button>
      )}
    </div>
  );
}
