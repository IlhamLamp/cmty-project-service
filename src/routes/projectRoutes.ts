import { Router } from "express";
import ApiHandler from "../controller/api";
import { authMiddleware } from "../middleware";

const router = Router()
  .get("/", authMiddleware(), ApiHandler.getAllProjectHandler)
  .get("/:id", authMiddleware(), ApiHandler.getAllProjectByIdHandler)
  .post("/create", authMiddleware(), ApiHandler.createProjectHandler);

export { router as projectRouter };
