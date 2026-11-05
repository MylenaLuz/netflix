const mongoose = require("mongoose");

async function connectDatabase(uri) {
  if (!uri) {
    throw new Error(
      "MONGODB_URI não definida. Copie .env.example para .env e preencha a connection string do Atlas."
    );
  }
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
  console.log(`MongoDB conectado: ${mongoose.connection.host}/${mongoose.connection.name}`);
}

module.exports = { connectDatabase };
