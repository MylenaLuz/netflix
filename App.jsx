import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Details from "./pages/Details";
import MyList from "./pages/MyList";
import Stats from "./pages/Stats";
import NotFound from "./pages/NotFound";

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <Navbar />
      <main id="conteudo">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalog />} />
          <Route path="/filme/:id" element={<Details />} />
          <Route path="/minha-lista" element={<MyList />} />
          <Route path="/estatisticas" element={<Stats />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="footer">
        <p>Sessão · projeto acadêmico de banco de dados NoSQL · React, Express e MongoDB Atlas</p>
      </footer>
    </>
  );
}
