export default function StatCard({ label, value, hint, accent = false }) {
  return (
    <div className={`stat ${accent ? "stat--accent" : ""}`}>
      <span className="stat__value">{value}</span>
      <span className="stat__label">{label}</span>
      {hint && <span className="stat__hint">{hint}</span>}
    </div>
  );
}
