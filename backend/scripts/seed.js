/**
 * Popula o catálogo com filmes de demonstração.
 * Idempotente: usa o título como chave (upsert), então rodar várias vezes não duplica.
 * Use `npm run seed -- --reset` para apagar a coleção antes de inserir.
 */
require("dotenv").config({ quiet: true });
const mongoose = require("mongoose");
const Movie = require("../src/models/Movie");
const { connectDatabase } = require("../src/config/db");

const movies = [
  {
    title: "Interestelar",
    synopsis: "Com a Terra à beira do colapso agrícola, um ex-piloto deixa os filhos para cruzar um buraco de minhoca em busca de um novo lar para a humanidade.",
    releaseYear: 2014, director: "Christopher Nolan", genres: ["Ficção científica", "Drama"],
    durationMinutes: 169, personalRating: 9.5, status: "watched", favorite: true,
  },
  {
    title: "O Poderoso Chefão",
    synopsis: "O patriarca de uma família mafiosa nova-iorquina vê o filho mais novo, que queria distância dos negócios, assumir aos poucos o comando do clã.",
    releaseYear: 1972, director: "Francis Ford Coppola", genres: ["Crime", "Drama"],
    durationMinutes: 175, personalRating: 10, status: "watched", favorite: true,
  },
  {
    title: "Clube da Luta",
    synopsis: "Um funcionário insone e um vendedor de sabonetes carismático criam um clube clandestino de brigas que cresce até virar algo muito maior.",
    releaseYear: 1999, director: "David Fincher", genres: ["Drama", "Suspense"],
    durationMinutes: 139, personalRating: 8.5, status: "watched", favorite: false,
  },
  {
    title: "Orgulho e Preconceito",
    synopsis: "Na Inglaterra rural do século XIX, Elizabeth Bennet e o reservado Sr. Darcy precisam superar as primeiras impressões que têm um do outro.",
    releaseYear: 2005, director: "Joe Wright", genres: ["Romance", "Drama"],
    durationMinutes: 129, status: "watchlist", favorite: false,
  },
  {
    title: "A Origem",
    synopsis: "Um ladrão especializado em invadir sonhos recebe a missão inversa: plantar uma ideia na mente de um herdeiro sem que ele perceba.",
    releaseYear: 2010, director: "Christopher Nolan", genres: ["Ficção científica", "Ação"],
    durationMinutes: 148, personalRating: 9, status: "watched", favorite: true,
  },
  {
    title: "O Show de Truman",
    synopsis: "Truman leva uma vida pacata numa cidade litorânea, até começar a desconfiar que tudo ao seu redor é cenário de um programa de TV.",
    releaseYear: 1998, director: "Peter Weir", genres: ["Comédia", "Drama"],
    durationMinutes: 103, personalRating: 8.8, status: "watching", favorite: false,
  },
  {
    title: "La La Land",
    synopsis: "Uma aspirante a atriz e um pianista de jazz se apaixonam em Los Angeles enquanto tentam não abrir mão dos próprios sonhos.",
    releaseYear: 2016, director: "Damien Chazelle", genres: ["Musical", "Romance"],
    durationMinutes: 128, status: "watchlist", favorite: true,
  },
  {
    title: "Parasita",
    synopsis: "Uma família pobre de Seul se infiltra, um por um, como funcionários na casa de uma família rica, até que um segredo escondido no porão muda tudo.",
    releaseYear: 2019, director: "Bong Joon-ho", genres: ["Suspense", "Drama"],
    durationMinutes: 132, personalRating: 9.2, status: "watched", favorite: true,
  },
  {
    title: "Cidade de Deus",
    synopsis: "Buscapé, um jovem que sonha ser fotógrafo, acompanha por duas décadas a escalada do crime numa comunidade do Rio de Janeiro.",
    releaseYear: 2002, director: "Fernando Meirelles", genres: ["Crime", "Drama"],
    durationMinutes: 130, personalRating: 9.4, status: "watched", favorite: true,
  },
  {
    title: "Duna: Parte Dois",
    synopsis: "Paul Atreides se une aos Fremen no deserto de Arrakis enquanto tenta evitar o futuro sombrio que enxerga em suas visões.",
    releaseYear: 2024, director: "Denis Villeneuve", genres: ["Ficção científica", "Aventura"],
    durationMinutes: 166, status: "watchlist", favorite: false,
  },
  {
    title: "A Viagem de Chihiro",
    synopsis: "Ao se mudar com os pais, Chihiro atravessa um túnel e vai parar num mundo de espíritos, onde precisa trabalhar numa casa de banhos para salvá-los.",
    releaseYear: 2001, director: "Hayao Miyazaki", genres: ["Animação", "Fantasia"],
    durationMinutes: 125, personalRating: 9.6, status: "watched", favorite: true,
  },
  {
    title: "Ainda Estou Aqui",
    synopsis: "No Rio dos anos 1970, Eunice Paiva reconstrói a vida da família depois que o marido é levado por agentes da ditadura e não volta.",
    releaseYear: 2024, director: "Walter Salles", genres: ["Drama"],
    durationMinutes: 137, status: "watching", favorite: false,
  },
];

async function run() {
  await connectDatabase(process.env.MONGODB_URI);

  if (process.argv.includes("--reset")) {
    const { deletedCount } = await Movie.deleteMany({});
    console.log(`Coleção limpa (${deletedCount} documentos removidos).`);
  }

  let inserted = 0;
  for (const movie of movies) {
    const result = await Movie.updateOne(
      { title: movie.title },
      { $setOnInsert: movie },
      { upsert: true, runValidators: true }
    );
    if (result.upsertedCount) inserted += 1;
  }

  const total = await Movie.countDocuments();
  console.log(`Seed concluído: ${inserted} novos, ${movies.length - inserted} já existiam. Total na coleção: ${total}.`);
}

run()
  .catch((err) => {
    console.error("Erro no seed:", err.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
