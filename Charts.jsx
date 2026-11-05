// Gráficos simples em CSS: barras horizontais (gêneros) e colunas (décadas).

export function BarList({ items, labelKey, valueKey }) {
  const max = Math.max(...items.map((i) => i[valueKey]), 1);
  return (
    <ul className="barlist">
      {items.map((item) => (
        <li key={item[labelKey]}>
          <span className="barlist__label">{item[labelKey]}</span>
          <span className="barlist__track">
            <span className="barlist__bar" style={{ width: `${(item[valueKey] / max) * 100}%` }} />
          </span>
          <span className="barlist__value">{item[valueKey]}</span>
        </li>
      ))}
    </ul>
  );
}

export function ColumnChart({ items, labelKey, valueKey, format = (v) => v }) {
  const max = Math.max(...items.map((i) => i[valueKey]), 1);
  return (
    <div className="columns" role="list">
      {items.map((item) => (
        <div className="columns__item" role="listitem" key={item[labelKey]}
          aria-label={`${format(item[labelKey])}: ${item[valueKey]} filme(s)`}>
          <span className="columns__value">{item[valueKey]}</span>
          <span className="columns__bar" style={{ height: `${(item[valueKey] / max) * 100}%` }} />
          <span className="columns__label">{format(item[labelKey])}</span>
        </div>
      ))}
    </div>
  );
}
