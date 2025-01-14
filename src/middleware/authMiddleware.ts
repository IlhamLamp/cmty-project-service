import { type NextFunction, type Request, type Response } from "express";
import { BadRequest, InternalError, NotAuthorized } from "../error";
import jwt from "jsonwebtoken";
import config from "../config";

export function authMiddleware(level?: number) {
  return function (req: Request, _: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) throw new NotAuthorized("Access denied!");
    try {
      const verified = jwt.verify(token, config.TOKEN_API);
      if (!verified) throw new NotAuthorized("Access denied!!");
      next();
    } catch (error) {
      if (error instanceof NotAuthorized) throw error;
      if (error instanceof InternalError) throw error;

      throw new BadRequest("Invalid Token");
    }
  };
}
