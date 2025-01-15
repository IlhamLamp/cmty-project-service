import { type Request, type Response, type NextFunction } from "express";
import { ProjectService } from "../service";
import { badRequestValidator } from "../middleware";
import { z } from "zod";

class ApiHandler {
  private readonly projectService: ProjectService;

  constructor() {
    this.projectService = new ProjectService();
  }

  getAllProjectHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const projects = await this.projectService.getAllProject();
      res.success(projects);
    } catch (error) {
      next(error);
    }
  };

  getAllProjectByIdHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = badRequestValidator(
        req.params,
        z.object({ id: z.coerce.number() })
      );
      const projects = await this.projectService.getProjectById(id);
      res.success(projects);
    } catch (error) {
      next(error);
    }
  };
}

export default new ApiHandler();
