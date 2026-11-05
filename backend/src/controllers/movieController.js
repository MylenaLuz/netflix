const service = require("../services/movieService");

const notFound = (res) =>
  res.status(404).json({ success: false, message: "Filme não encontrado." });

exports.list = async (req, res, next) => {
  try {
    const data = await service.list(req.query);
    res.json({ success: true, count: data.length, data });
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const movie = await service.findById(req.params.id);
    if (!movie) return notFound(res);
    res.json({ success: true, data: movie });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const movie = await service.create(req.body);
    res.status(201).json({ success: true, data: movie });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const movie = await service.update(req.params.id, req.body);
    if (!movie) return notFound(res);
    res.json({ success: true, data: movie });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const movie = await service.remove(req.params.id);
    if (!movie) return notFound(res);
    res.json({ success: true, message: "Filme excluído.", data: { _id: movie._id } });
  } catch (err) { next(err); }
};

exports.genres = async (req, res, next) => {
  try {
    res.json({ success: true, data: await service.genres() });
  } catch (err) { next(err); }
};
