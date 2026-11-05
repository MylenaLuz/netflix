export const STATUS_OPTIONS = [
  { value: "watchlist", label: "Quero assistir" },
  { value: "watching", label: "Assistindo" },
  { value: "watched", label: "Assistido" },
];

export const statusLabel = (value) =>
  STATUS_OPTIONS.find((s) => s.value === value)?.label ?? value;

export function formatDuration(minutes) {
  if (!minutes) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h${m ? ` ${String(m).padStart(2, "0")}min` : ""}` : `${m}min`;
}

export const formatRating = (n) =>
  n == null ? null : Number(n).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

// Gera um par de cores estável a partir do título, para os pôsteres tipográficos.
export function posterTheme(seed = "") {
  let hash = 0;
  for (const ch of seed) hash = (hash * 31 + ch.codePointAt(0)) >>> 0;
  const hue = hash % 360;
  const shift = 25 + (hash % 50);
  return {
    "--p-a": `hsl(${hue} 55% 30%)`,
    "--p-b": `hsl(${(hue + shift) % 360} 60% 12%)`,
    "--p-ink": `hsl(${hue} 70% 88%)`,
  };
}
