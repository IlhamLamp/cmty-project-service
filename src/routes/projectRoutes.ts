import { Router } from "express";
import ApiHandler from "../controller/api";
import { authMiddleware } from "../middleware";

const router = Router()
  .get("/", authMiddleware(), ApiHandler.getAllProjectsHandler)
  .get("/:uuid", authMiddleware(), ApiHandler.getProjectByUuid)
  .post("/create", authMiddleware(), ApiHandler.createProjectHandler)
  .put("/update/:uuid", authMiddleware(), ApiHandler.updateProjectHandler);

export { router as projectRouter };
