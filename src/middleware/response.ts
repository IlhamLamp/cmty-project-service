import { type NextFunction, type Request, type Response } from "express";
import config from "../config";
import { tracer } from "./requestId";

export function middlewareResponseInit() {
  return function (req: Request, res: Response, next: NextFunction) {
    const shouldDebug = ["development", undefined].includes(config.NODE_ENV);
    res.success = function (
      data: unknown,
      dev: unknown,
      code = 200,
      message = "Success"
    ) {
      return res.status(code ?? 200).json({
        message,
        content: data,
        debug: shouldDebug
          ? {
              requestId: tracer.id(),
            }
          : undefined,
        dev: shouldDebug ? dev : undefined,
      });
    };
    next();
  };
}
