import config from "../config";
import db from "../config/db";
import { createLogger } from "../middleware";
import { runApp } from "./app";

const logger = createLogger({ name: "SERVER", env: config.NODE_ENV });

async function healthCheck() {
  try {
    await db.query("SELECT 1");
    logger.info("Database connected");
    await db.end();
  } catch (error) {
    logger.error("Database health check failed:", error);
    process.exit(1);
  }
}

healthCheck().then(() => {
  runApp(config.APP_PORT);
});
