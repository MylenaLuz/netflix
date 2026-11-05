import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { Search, Plus, Menu, X } from "lucide-react";
import { useCatalog } from "../hooks/useCatalog";

const LINKS = [
  { to: "/", label: "Início", end: true },
  { to: "/catalogo", label: "Meu catálogo" },
  { to: "/minha-lista", label: "Minha lista" },
  { to: "/estatisticas", label: "Estatísticas" },
];

export default function Navbar() {
  const { openNew } = useCatalog();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [term, setTerm] = useState(params.get("search") || "");

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    setMenuOpen(false);
    navigate(term.trim() ? `/catalogo?search=${encodeURIComponent(term.trim())}` : "/catalogo");
  };

  return (
    <header className={`nav ${solid || menuOpen ? "nav--solid" : ""}`}>
      <div className="nav__inner">
        <Link to="/" className="brand" aria-label="Sessão, página inicial">
          <span className="brand__lamp" aria-hidden="true" />
          sessão
        </Link>

        <nav className={`nav__links ${menuOpen ? "is-open" : ""}`} aria-label="Principal">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} onClick={() => setMenuOpen(false)}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav__actions">
          <form className="nav__search" onSubmit={submit} role="search">
            <Search size={18} aria-hidden="true" />
            <label className="sr-only" htmlFor="nav-search">Buscar filme por título</label>
            <input
              id="nav-search"
              type="search"
              placeholder="Buscar título"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
          </form>
          <button className="btn btn--accent btn--sm" onClick={openNew}>
            <Plus size={18} aria-hidden="true" />
            <span className="hide-sm">Adicionar filme</span>
          </button>
          <button
            className="icon-btn nav__burger"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}
