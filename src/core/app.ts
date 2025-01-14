import express, { json, urlencoded } from "express";
import cors from "cors";
import config from "../config";
import helmet from "helmet";
import morgan from "morgan";
import { initRequestId, tracer } from "../middleware/requestId";
import { middlewareResponseInit } from "../middleware/response";
import router from "../routes";
import { createLogger } from "../middleware";

const logger = createLogger({ name: "APP", env: config.NODE_ENV });
const app = express();

app.use(
  cors({
    origin: config.APP_CLIENT,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
  })
);

app.use(helmet());
app.use(initRequestId());
app.use(urlencoded({ extended: true }));
app.use(json());

app.use(
  morgan(
    (tokens, req, res) => {
      return [
        `[${tracer.id()}]`,
        `[${
          req.headers["cf-connecting-ip"] ||
          req.headers["x-forwarded-for"] ||
          req.ip
        }]`,
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        "-",
        tokens["response-time"](req, res) + "ms",
      ].join(" ");
    },
    {
      skip(req) {
        return req.url === "/health";
      },
    }
  )
);

app.use(middlewareResponseInit());
app.use(router);

export async function runApp(port: number) {
  app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
  });
}

export { app };
