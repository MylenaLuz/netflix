const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const movieRoutes = require("./routes/movieRoutes");
const statsRoutes = require("./routes/statsRoutes");
const { errorHandler, notFoundRoute } = require("./middlewares/errorHandler");

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "100kb" }));

app.get("/api/health", (req, res) => {
  const states = ["desconectado", "conectado", "conectando", "desconectando"];
  res.json({ success: true, database: states[mongoose.connection.readyState] || "desconhecido" });
});

app.use("/api/movies", movieRoutes);
app.use("/api/stats", statsRoutes);

app.use("/api", notFoundRoute);
app.use(errorHandler);

module.exports = app;
