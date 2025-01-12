import { type NextFunction, type Request, type Response } from "express";
import { tracer } from "../middleware/requestId";
import config from "../config";
import { createLogger } from "../middleware";

const logger = createLogger({
  name: "ERROR",
  env: config.NODE_ENV,
});

export async function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  let message = "Unhandled error";
  let status = 500;
  let error: unknown = undefined;
  let stack: unknown = undefined;
  let context: unknown = undefined;
  let code: number | undefined = undefined;
  let rawError: unknown = null;

  if (err instanceof ResponseError) {
    message = err.getErrorMessage();
    error = err.serviceName;
    stack = err.stack;
    status = err.status;
    context = err.getErrorCtx();
    code = err.getErrorCode();
    if (err instanceof BadRequest) {
      rawError = err.rawError;
    }
  } else if (err instanceof Error) {
    message = err.message;
    error = err.cause;
    stack = err.stack;
    status = 500;
  } else {
    message = err;
  }

  logger.error({
    url: req.url,
    method: req.method,
    body: JSON.stringify(req.body),
    headers: JSON.stringify(req.rawHeaders),
    message,
    code,
    error,
    stack,
    context: JSON.stringify(context),
    rawError,
  });

  res.status(status).json({
    message,
    code,
    error,
    context,
    debug: {
      rawError,
      stack,
      requestId: tracer.id(),
    },
  });
}
