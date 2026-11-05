const service = require("../services/movieService");

exports.get = async (req, res, next) => {
  try {
    res.json({ success: true, data: await service.stats() });
  } catch (err) { next(err); }
};
