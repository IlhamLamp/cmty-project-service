import { type Request, type Response, type NextFunction } from "express";
import { ProjectService } from "../service";
import { badRequestValidator } from "../middleware";
import { z } from "zod";
import { projectSchema } from "../models";
import { FiltersProjectData } from "../helper";

class ApiHandler {
  private readonly projectService: ProjectService;

  constructor() {
    this.projectService = new ProjectService();
  }

  getAllProjectsHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const filters = FiltersProjectData(req.query);
      const { data, total } = await this.projectService.getAllProjects(
        filters,
        parseInt(page as string),
        parseInt(limit as string)
      );

      const totalPage = Math.ceil(total / parseInt(limit as string));
      res.success({
        data,
        total,
        totalPage,
        curentPage: parseInt(page as string),
      });
    } catch (error) {
      next(error);
    }
  };

  getProjectByUuid = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { uuid } = badRequestValidator(
        req.params,
        z.object({ uuid: z.string() })
      );
      const project = await this.projectService.getProjectByUuid(uuid);
      res.success(project);
    } catch (error) {
      next(error);
    }
  };

  createProjectHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const payload = badRequestValidator(req.body, projectSchema);
      const project = await this.projectService.createProject(payload);
      res.success({ project: project }, "Success create projects");
    } catch (error) {
      next(error);
    }
  };

  updateProjectHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const payload = badRequestValidator(req.body, projectSchema);
      const project = await this.projectService.updateProjectByUuid(
        payload.uuid!,
        payload
      );
      res.success({ project: project }, "Success update projects");
    } catch (error) {
      next(error);
    }
  };
}

export default new ApiHandler();
