const mongoose = require("mongoose");

const STATUS = ["watchlist", "watching", "watched"];
const currentYear = new Date().getFullYear();

const urlValidator = {
  validator: (v) => !v || /^https?:\/\/\S+$/i.test(v),
  message: "Informe uma URL válida (http ou https).",
};

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "O título é obrigatório."], trim: true, maxlength: 200 },
    synopsis: { type: String, default: "", trim: true, maxlength: 2000 },
    releaseYear: {
      type: Number,
      min: [1888, "O ano deve ser a partir de 1888."],
      max: [currentYear + 5, `O ano deve ser até ${currentYear + 5}.`],
      validate: { validator: (v) => v == null || Number.isInteger(v), message: "O ano deve ser um número inteiro." },
    },
    director: { type: String, default: "", trim: true, maxlength: 120 },
    genres: { type: [{ type: String, trim: true }], default: [] },
    durationMinutes: { type: Number, min: [1, "A duração deve ser de pelo menos 1 minuto."] },
    posterUrl: { type: String, default: "", trim: true, validate: urlValidator },
    backdropUrl: { type: String, default: "", trim: true, validate: urlValidator },
    personalRating: {
      type: Number,
      min: [0, "A nota deve estar entre 0 e 10."],
      max: [10, "A nota deve estar entre 0 e 10."],
    },
    status: {
      type: String,
      enum: { values: STATUS, message: "Status inválido." },
      required: true,
      default: "watchlist",
    },
    favorite: { type: Boolean, required: true, default: false },
  },
  { timestamps: true, versionKey: false }
);

movieSchema.index({ title: 1 });

module.exports = mongoose.model("Movie", movieSchema);
module.exports.STATUS = STATUS;
