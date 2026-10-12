/// <reference path="./types/express.d.ts" />
import app from "./app";
import config from "./config/envConfig";
import { initDb } from "./db/database";

const main = async () => {
  try {
    await initDb();

    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start application:", error);
    process.exit(1);
  }
};

main();
