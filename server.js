require("dotenv").config({ quiet: true });
const app = require("./app");
const { connectDatabase } = require("./config/db");

const PORT = Number(process.env.PORT) || 5000;

connectDatabase(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`API em http://localhost:${PORT}/api`));
  })
  .catch((err) => {
    console.error("Falha ao conectar no MongoDB:", err.message);
    process.exit(1);
  });
