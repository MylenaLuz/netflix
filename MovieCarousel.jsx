import { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "./MovieCard";

export default function MovieCarousel({ title, movies, seeAllTo }) {
  const track = useRef(null);
  if (!movies?.length) return null;

  const scroll = (dir) => {
    const el = track.current;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <section className="row" aria-label={title}>
      <div className="row__head">
        <h2 className="row__title">{title}</h2>
        {seeAllTo && <Link to={seeAllTo} className="row__more">Ver todos</Link>}
      </div>
      <div className="row__viewport">
        <button className="row__arrow row__arrow--left" onClick={() => scroll(-1)} aria-label={`Voltar em ${title}`}>
          <ChevronLeft size={28} />
        </button>
        <div className="row__track" ref={track}>
          {movies.map((m) => (
            <MovieCard key={m._id} movie={m} />
          ))}
        </div>
        <button className="row__arrow row__arrow--right" onClick={() => scroll(1)} aria-label={`Avançar em ${title}`}>
          <ChevronRight size={28} />
        </button>
      </div>
    </section>
  );
}
