const Movie = require("../models/Movie");

const SORTABLE = ["personalRating", "releaseYear", "title", "createdAt", "updatedAt"];
const ALLOWED_FIELDS = [
  "title", "synopsis", "releaseYear", "director", "genres", "durationMinutes",
  "posterUrl", "backdropUrl", "personalRating", "status", "favorite",
];
const NUMERIC = ["releaseYear", "durationMinutes", "personalRating"];

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Normaliza o corpo recebido: só campos conhecidos; número vazio vira null ("sem valor").
function sanitize(body = {}) {
  const data = {};
  for (const field of ALLOWED_FIELDS) {
    if (body[field] === undefined) continue;
    let value = body[field];
    if (NUMERIC.includes(field)) {
      value = value === "" || value === null ? null : Number(value);
    }
    if (field === "genres") {
      value = (Array.isArray(value) ? value : String(value).split(","))
        .map((g) => String(g).trim())
        .filter(Boolean);
      value = [...new Set(value)];
    }
    if (field === "favorite" && typeof value === "string") value = value === "true";
    data[field] = value;
  }
  return data;
}

function buildQuery({ search, genre, status, favorite }) {
  const filter = {};
  if (search) filter.title = { $regex: escapeRegex(String(search).trim()), $options: "i" };
  if (genre) filter.genres = String(genre);
  if (status) filter.status = String(status);
  if (favorite === "true" || favorite === "false") filter.favorite = favorite === "true";
  return filter;
}

async function list(query) {
  const sortBy = SORTABLE.includes(query.sortBy) ? query.sortBy : "createdAt";
  const order = query.order === "asc" ? 1 : -1;
  const limit = Math.min(Number(query.limit) || 0, 200);
  let cursor = Movie.find(buildQuery(query)).sort({ [sortBy]: order, _id: -1 });
  if (limit > 0) cursor = cursor.limit(limit);
  return cursor.lean();
}

const findById = (id) => Movie.findById(id).lean();

const create = (body) => {
  const data = sanitize(body);
  for (const key of NUMERIC) if (data[key] === null) delete data[key];
  return Movie.create(data);
};

const update = (id, body) => {
  const data = sanitize(body);
  const unset = {};
  for (const [key, value] of Object.entries(data)) {
    if (value === null) { unset[key] = ""; delete data[key]; }
  }
  const op = { $set: data };
  if (Object.keys(unset).length) op.$unset = unset;
  return Movie.findByIdAndUpdate(id, op, { new: true, runValidators: true }).lean();
};

const remove = (id) => Movie.findByIdAndDelete(id).lean();

async function stats() {
  const [result] = await Movie.aggregate([
    {
      $facet: {
        totals: [
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              watched: { $sum: { $cond: [{ $eq: ["$status", "watched"] }, 1, 0] } },
              watching: { $sum: { $cond: [{ $eq: ["$status", "watching"] }, 1, 0] } },
              watchlist: { $sum: { $cond: [{ $eq: ["$status", "watchlist"] }, 1, 0] } },
              favorites: { $sum: { $cond: ["$favorite", 1, 0] } },
              averageRating: { $avg: "$personalRating" },
              rated: { $sum: { $cond: [{ $isNumber: "$personalRating" }, 1, 0] } },
              minutesWatched: {
                $sum: { $cond: [{ $eq: ["$status", "watched"] }, { $ifNull: ["$durationMinutes", 0] }, 0] },
              },
            },
          },
        ],
        genres: [
          { $unwind: "$genres" },
          { $group: { _id: "$genres", count: { $sum: 1 } } },
          { $sort: { count: -1, _id: 1 } },
          { $limit: 8 },
          { $project: { _id: 0, genre: "$_id", count: 1 } },
        ],
        decades: [
          { $match: { releaseYear: { $type: "number" } } },
          {
            $group: {
              _id: { $multiply: [{ $floor: { $divide: ["$releaseYear", 10] } }, 10] },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
          { $project: { _id: 0, decade: "$_id", count: 1 } },
        ],
      },
    },
  ]);

  const t = result.totals[0] || {};
  return {
    total: t.total || 0,
    watched: t.watched || 0,
    watching: t.watching || 0,
    watchlist: t.watchlist || 0,
    favorites: t.favorites || 0,
    rated: t.rated || 0,
    averageRating: t.averageRating != null ? Math.round(t.averageRating * 10) / 10 : null,
    hoursWatched: Math.round(((t.minutesWatched || 0) / 60) * 10) / 10,
    genres: result.genres,
    decades: result.decades,
  };
}

async function genres() {
  const values = await Movie.distinct("genres");
  return values.filter(Boolean).sort((a, b) => a.localeCompare(b, "pt-BR"));
}

module.exports = { list, findById, create, update, remove, stats, genres };
