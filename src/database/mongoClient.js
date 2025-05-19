const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let db = null;

async function connect() {
  try {
    if (!db) {
      await client.connect();
      db = client.db(); // usa o nome do banco que está na URI
      console.log("🔗 Conectado ao MongoDB!");
    }
    return db;
  } catch (err) {
    console.error("Erro ao conectar com o MongoDB:", err);
    throw err;
  }
}

module.exports = { connect };
