const mongoose = require("mongoose");

module.exports = function validateObjectId(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "ID inválido." });
  }
  next();
};
