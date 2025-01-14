import { config as dotenvConfig } from "dotenv";
import { z } from "zod";

dotenvConfig();

const nodeEnvSchema = z.enum(["development", "staging", "production", "test"]);

const {
  APP_PORT,
  APP_NAME,
  APP_CLIENT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_HOST,
  TOKEN_API,
  NODE_ENV,
} = process.env;
const config = {
  APP_PORT: z.coerce.number().parse(APP_PORT),
  APP_NAME: z.string().parse(APP_NAME),
  APP_CLIENT: z.string().parse(APP_CLIENT),
  DB_USER: z.string().parse(DB_USER),
  DB_PASSWORD: z.string().parse(DB_PASSWORD),
  DB_NAME: z.string().parse(DB_NAME),
  DB_HOST: z.string().parse(DB_HOST),
  TOKEN_API: z.string().parse(TOKEN_API),
  NODE_ENV: nodeEnvSchema.parse(NODE_ENV),
};

console.log(config);
export default config;
