require("dotenv").config();

const { connectDatabase } = require("./config/db");
const { createApp } = require("./app");

const port = Number(process.env.PORT || 3000);
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/port_russel";
const sessionSecret = process.env.SESSION_SECRET || "dev-secret";

async function start() {
  try {
    // On connecte Mongo avant de lancer le serveur web.
    await connectDatabase(mongoUri);
    const app = createApp({ mongoUri, sessionSecret });

    app.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

start();
