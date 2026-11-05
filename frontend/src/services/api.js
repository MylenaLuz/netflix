const BASE = (import.meta.env.VITE_API_URL || "") + "/api";

export class ApiError extends Error {
  constructor(message, status, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

async function request(path, { method = "GET", body, params } = {}) {
  const query = params
    ? "?" + new URLSearchParams(Object.entries(params).filter(([, v]) => v !== "" && v != null)).toString()
    : "";

  let response;
  try {
    response = await fetch(`${BASE}${path}${query}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Sem conexão com a API. Confira se o backend está rodando na porta 5000.", 0);
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.success === false) {
    throw new ApiError(payload.message || `Erro ${response.status} na API.`, response.status, payload.errors);
  }
  return payload.data;
}

export const api = {
  listMovies: (params) => request("/movies", { params }),
  getMovie: (id) => request(`/movies/${id}`),
  createMovie: (data) => request("/movies", { method: "POST", body: data }),
  updateMovie: (id, data) => request(`/movies/${id}`, { method: "PUT", body: data }),
  deleteMovie: (id) => request(`/movies/${id}`, { method: "DELETE" }),
  listGenres: () => request("/movies/genres"),
  getStats: () => request("/stats"),
};
