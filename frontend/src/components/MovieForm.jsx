import { useState } from "react";
import Modal from "./Modal";
import Poster from "./Poster";
import { STATUS_OPTIONS } from "../utils/format";

const PRESET_GENRES = [
  "Ação", "Animação", "Aventura", "Comédia", "Crime", "Documentário", "Drama",
  "Fantasia", "Ficção científica", "Musical", "Romance", "Suspense", "Terror",
];

const MAX_YEAR = new Date().getFullYear() + 5;
const isUrl = (v) => /^https?:\/\/\S+$/i.test(v);

function toForm(movie) {
  return {
    title: movie.title ?? "",
    synopsis: movie.synopsis ?? "",
    releaseYear: movie.releaseYear ?? "",
    director: movie.director ?? "",
    genres: movie.genres ?? [],
    durationMinutes: movie.durationMinutes ?? "",
    posterUrl: movie.posterUrl ?? "",
    backdropUrl: movie.backdropUrl ?? "",
    personalRating: movie.personalRating ?? "",
    status: movie.status ?? "watchlist",
    favorite: movie.favorite ?? false,
  };
}

function validate(f) {
  const e = {};
  if (!f.title.trim()) e.title = "O título é obrigatório.";
  if (f.releaseYear !== "" && (!Number.isInteger(+f.releaseYear) || +f.releaseYear < 1888 || +f.releaseYear > MAX_YEAR))
    e.releaseYear = `Use um ano entre 1888 e ${MAX_YEAR}.`;
  if (f.durationMinutes !== "" && (!Number.isFinite(+f.durationMinutes) || +f.durationMinutes < 1))
    e.durationMinutes = "Informe a duração em minutos.";
  if (f.personalRating !== "" && (+f.personalRating < 0 || +f.personalRating > 10 || !Number.isFinite(+f.personalRating)))
    e.personalRating = "A nota vai de 0 a 10.";
  if (f.posterUrl && !isUrl(f.posterUrl)) e.posterUrl = "A URL precisa começar com http:// ou https://.";
  if (f.backdropUrl && !isUrl(f.backdropUrl)) e.backdropUrl = "A URL precisa começar com http:// ou https://.";
  return e;
}

export default function MovieForm({ movie, onSubmit, onClose }) {
  const isNew = !movie._id;
  const [form, setForm] = useState(() => toForm(movie));
  const [errors, setErrors] = useState({});
  const [customGenre, setCustomGenre] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const set = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const toggleGenre = (g) =>
    setForm((f) => ({ ...f, genres: f.genres.includes(g) ? f.genres.filter((x) => x !== g) : [...f.genres, g] }));

  const addCustomGenre = () => {
    const g = customGenre.trim();
    if (g && !form.genres.includes(g)) setForm((f) => ({ ...f, genres: [...f.genres, g] }));
    setCustomGenre("");
  };

  const submit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(`mf-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      await onSubmit({ ...form, title: form.title.trim() });
    } catch (err) {
      const fieldErrors = Object.fromEntries((err.errors || []).map((x) => [x.field, x.message]));
      setErrors(fieldErrors);
      setFormError(err.message);
      setSaving(false);
    }
  };

  const allGenres = [...new Set([...PRESET_GENRES, ...form.genres])];

  const Field = ({ name, label, children, hint }) => (
    <div className={`form__field ${errors[name] ? "has-error" : ""}`}>
      <label htmlFor={`mf-${name}`}>{label}</label>
      {children}
      {errors[name] ? (
        <span className="form__error" id={`mf-${name}-err`}>{errors[name]}</span>
      ) : hint ? (
        <span className="form__hint">{hint}</span>
      ) : null}
    </div>
  );

  const inputProps = (name) => ({
    id: `mf-${name}`,
    value: form[name],
    onChange: set(name),
    "aria-invalid": !!errors[name],
    "aria-describedby": errors[name] ? `mf-${name}-err` : undefined,
  });

  return (
    <Modal title={isNew ? "Adicionar filme" : `Editar “${movie.title}”`} onClose={saving ? () => {} : onClose} size="lg" labelledBy="form-title">
      <form className="form" onSubmit={submit} noValidate>
        <div className="form__layout">
          <div className="form__preview" aria-hidden="true">
            <Poster movie={{ ...form, title: form.title || "Sem título", posterUrl: isUrl(form.posterUrl) ? form.posterUrl : "" }} key={form.posterUrl} />
          </div>

          <div className="form__fields">
            {Field({ name: "title", label: "Título *", children: <input {...inputProps("title")} data-autofocus maxLength={200} /> })}

            <div className="form__row">
              {Field({ name: "releaseYear", label: "Ano", children: <input {...inputProps("releaseYear")} type="number" inputMode="numeric" min="1888" max={MAX_YEAR} /> })}
              {Field({ name: "durationMinutes", label: "Duração (min)", children: <input {...inputProps("durationMinutes")} type="number" inputMode="numeric" min="1" /> })}
              {Field({ name: "personalRating", label: "Sua nota (0–10)", children: <input {...inputProps("personalRating")} type="number" inputMode="decimal" min="0" max="10" step="0.5" /> })}
            </div>

            {Field({ name: "director", label: "Direção", children: <input {...inputProps("director")} maxLength={120} /> })}

            {Field({ name: "synopsis", label: "Sinopse", children: <textarea {...inputProps("synopsis")} rows={3} maxLength={2000} /> })}

            <fieldset className="form__field">
              <legend>Gêneros</legend>
              <div className="chips">
                {allGenres.map((g) => (
                  <button
                    type="button"
                    key={g}
                    className={`chip ${form.genres.includes(g) ? "is-on" : ""}`}
                    aria-pressed={form.genres.includes(g)}
                    onClick={() => toggleGenre(g)}
                  >
                    {g}
                  </button>
                ))}
              </div>
              <div className="form__inline">
                <label className="sr-only" htmlFor="mf-custom-genre">Outro gênero</label>
                <input
                  id="mf-custom-genre"
                  placeholder="Outro gênero"
                  value={customGenre}
                  onChange={(e) => setCustomGenre(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomGenre())}
                />
                <button type="button" className="btn btn--ghost btn--sm" onClick={addCustomGenre}>Incluir</button>
              </div>
            </fieldset>

            <fieldset className="form__field">
              <legend>Status</legend>
              <div className="segmented">
                {STATUS_OPTIONS.map((s) => (
                  <label key={s.value} className={form.status === s.value ? "is-on" : ""}>
                    <input type="radio" name="status" value={s.value} checked={form.status === s.value} onChange={set("status")} />
                    {s.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="check">
              <input type="checkbox" checked={form.favorite} onChange={set("favorite")} />
              Marcar como favorito
            </label>

            {Field({ name: "posterUrl", label: "URL do pôster", hint: "Sem imagem, o Sessão desenha um pôster com o título.", children: <input {...inputProps("posterUrl")} type="url" placeholder="https://" /> })}
            {Field({ name: "backdropUrl", label: "URL da imagem de capa", hint: "Imagem horizontal usada no destaque e nos detalhes.", children: <input {...inputProps("backdropUrl")} type="url" placeholder="https://" /> })}
          </div>
        </div>

        {formError && <p className="form__banner" role="alert">{formError}</p>}

        <div className="modal__foot">
          <button type="button" className="btn btn--ghost" onClick={onClose} disabled={saving}>Cancelar</button>
          <button type="submit" className="btn btn--accent" disabled={saving}>
            {saving ? "Salvando…" : isNew ? "Adicionar filme" : "Salvar alterações"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
