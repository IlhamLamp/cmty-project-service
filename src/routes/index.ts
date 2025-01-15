import { Router } from "express";
import { projectRouter } from "./projectRoutes";
import { errorHandler } from "../error/handler";

const router = Router();
router.use("/api/v1/project", projectRouter);

router.use(errorHandler);

router.use("*", (req, res) => {
  console.log(`${req.method} ${req.baseUrl}`);
  res.status(404).json({
    message: "Routes not found",
    url: req.originalUrl,
  });
});

export default router;
