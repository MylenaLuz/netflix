# Sessão — catálogo de filmes

Aplicação web full-stack para cadastrar, organizar e avaliar filmes, com interface no estilo das plataformas de streaming (tema escuro, destaque cinematográfico, carrosséis). Projeto acadêmico da disciplina de Banco de Dados NoSQL.

**Stack:** React 18 + Vite · React Router · Lucide · Node.js + Express · Mongoose · MongoDB Atlas

## Funcionalidades

- **Início:** filme em destaque (rotaciona diariamente entre os favoritos) e carrosséis: Continuar assistindo, Meus favoritos, Quero assistir, Mais bem avaliados, Assistidos recentemente e Adicionados por último.
- **Meu catálogo:** grade com busca por título, filtros por gênero, status e favoritos, e ordenação por nota, ano, título ou data de cadastro. Os filtros ficam na URL, então dá para compartilhar ou recarregar sem perder.
- **Detalhes:** dados completos, troca de status, favoritar, editar e excluir (com confirmação).
- **Minha lista:** abas de Favoritos e Quero assistir.
- **Estatísticas:** totais por status, nota média, horas assistidas, gêneros mais frequentes e filmes por década, todos calculados no MongoDB com `aggregate`.
- CRUD completo com persistência real no Atlas, validação no front e no back, estados de carregamento, erro e lista vazia, avisos de sucesso/erro, layout responsivo e navegação por teclado.
- Filmes sem imagem ganham um pôster tipográfico gerado a partir do título; se uma URL de imagem quebrar, o mesmo pôster aparece no lugar.

## Estrutura

```
sessao/
├── backend/
│   ├── scripts/seed.js            # dados de demonstração (idempotente)
│   └── src/
│       ├── config/db.js           # conexão com o MongoDB
│       ├── models/Movie.js        # schema Mongoose
│       ├── services/movieService.js  # consultas, filtros, agregações
│       ├── controllers/           # montam as respostas HTTP
│       ├── routes/                # /api/movies e /api/stats
│       ├── middlewares/           # validação de ID e tratamento de erros
│       ├── app.js                 # configuração do Express
│       └── server.js              # ponto de entrada
└── frontend/
    └── src/
        ├── components/            # Navbar, HeroBanner, MovieCard, MovieCarousel, MovieForm…
        ├── pages/                 # Home, Catalog, Details, MyList, Stats
        ├── hooks/                 # useAsync, useCatalog (estado global), useToast
        ├── services/api.js        # chamadas HTTP
        ├── utils/format.js
        └── styles/global.css
```

## Configurando o MongoDB Atlas

1. Crie um cluster gratuito (M0) em <https://cloud.mongodb.com>.
2. **Database Access:** crie um usuário de banco com permissão *Read and write to any database* (ou restrita ao banco `sessao`).
3. **Network Access:** libere o seu IP (ou `0.0.0.0/0` só durante o desenvolvimento).
4. **Database > Connect > Drivers:** copie a *connection string*. Ela começa com `mongodb+srv://`.

> A "chave de API" que aparece em outras telas do Atlas (por exemplo, a chave de modelos de IA em `ai.mongodb.com`, que começa com `al-`) **não** serve para conectar ao banco. O backend precisa da connection string.

## Como rodar

Pré-requisito: Node.js 18 ou superior.

```bash
# 1. Backend
cd backend
npm install
cp .env.example .env        # no Windows: copy .env.example .env
# edite o .env e cole sua connection string em MONGODB_URI
npm run seed                # opcional: 12 filmes de demonstração
npm run dev                 # API em http://localhost:5000/api

# 2. Frontend (outro terminal)
cd frontend
npm install
npm run dev                 # app em http://localhost:5173
```

O Vite encaminha as chamadas `/api` para o backend, então não é preciso configurar nada no frontend.

`npm run seed` pode ser rodado várias vezes sem duplicar (usa o título como chave). Para recomeçar do zero: `npm run seed -- --reset`.

### Variáveis de ambiente (`backend/.env`)

| Variável | Descrição |
| --- | --- |
| `MONGODB_URI` | Connection string do Atlas, incluindo o nome do banco (ex.: `.../sessao?retryWrites=true&w=majority`) |
| `PORT` | Porta da API (padrão 5000) |
| `CLIENT_ORIGIN` | Origem liberada no CORS (padrão `http://localhost:5173`) |

O `.env` está no `.gitignore`. Nunca suba ele para o repositório nem o inclua no zip de entrega.

## Modelo de dados

Coleção `movies`:

| Campo | Tipo | Regra |
| --- | --- | --- |
| `title` | String | obrigatório |
| `synopsis` | String | até 2000 caracteres |
| `releaseYear` | Number | inteiro, de 1888 até o ano atual + 5 |
| `director` | String | |
| `genres` | [String] | sem repetição |
| `durationMinutes` | Number | ≥ 1 |
| `posterUrl`, `backdropUrl` | String | URL http(s) quando informada |
| `personalRating` | Number | 0 a 10 |
| `status` | String | `watchlist`, `watching` ou `watched` |
| `favorite` | Boolean | padrão `false` |
| `createdAt`, `updatedAt` | Date | automáticos |

Índice em `title` para a busca.

## API

Todas as respostas seguem `{ success, data }` ou `{ success: false, message, errors? }`.

| Método | Rota | Descrição | Sucesso |
| --- | --- | --- | --- |
| GET | `/api/movies` | Lista filmes | 200 |
| GET | `/api/movies/:id` | Um filme | 200 |
| POST | `/api/movies` | Cria | 201 |
| PUT | `/api/movies/:id` | Atualiza (parcial) | 200 |
| DELETE | `/api/movies/:id` | Exclui | 200 |
| GET | `/api/movies/genres` | Gêneros cadastrados | 200 |
| GET | `/api/stats` | Estatísticas | 200 |
| GET | `/api/health` | Status da conexão | 200 |

Parâmetros de `GET /api/movies`: `search`, `genre`, `status`, `favorite=true|false`, `sortBy` (`personalRating`, `releaseYear`, `title`, `createdAt`, `updatedAt`), `order` (`asc`/`desc`), `limit`.

Erros: `400` para ID ou dados inválidos (com a lista `errors` por campo), `404` para filme inexistente.

```bash
curl "http://localhost:5000/api/movies?genre=Drama&sortBy=personalRating&order=desc"

curl -X POST http://localhost:5000/api/movies \
  -H "Content-Type: application/json" \
  -d '{"title":"Central do Brasil","releaseYear":1998,"genres":["Drama"],"status":"watched","personalRating":9}'
```

## Testes realizados

O fluxo foi verificado de ponta a ponta: cadastro (incluindo a validação de título vazio), persistência após recarregar, busca, troca de status, edição, exclusão com confirmação, estados vazios, ID inválido e layout em celular. Na API, também foram testados JSON malformado, nota fora do intervalo, status inválido e rota inexistente.
