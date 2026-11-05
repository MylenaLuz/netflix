const mongoose = require("mongoose");

function notFoundRoute(req, res) {
  res.status(404).json({ success: false, message: `Rota ${req.method} ${req.originalUrl} não existe.` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      success: false,
      message: "Dados inválidos.",
      errors: Object.values(err.errors).map((e) => ({
        field: e.path,
        message: e.name === "CastError" ? `Valor inválido para ${e.path}.` : e.message,
      })),
    });
  }
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      success: false,
      message: "Dados inválidos.",
      errors: [{ field: err.path, message: `Valor inválido para ${err.path}.` }],
    });
  }
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, message: "JSON malformado no corpo da requisição." });
  }

  console.error(err);
  const isProd = process.env.NODE_ENV === "production";
  res.status(500).json({
    success: false,
    message: "Erro interno no servidor.",
    ...(isProd ? {} : { detail: err.message }),
  });
}

module.exports = { errorHandler, notFoundRoute };
