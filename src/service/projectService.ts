import { BadRequest } from "../error";
import { Project } from "../models/project";
import { ProjectCollection } from "../repository";

export class ProjectService {
  private readonly projectRepository: ProjectCollection;

  constructor() {
    this.projectRepository = new ProjectCollection();
  }

  async getAllProjects(filters: Partial<Project>, page: number, limit: number) {
    return await this.projectRepository.getAll(filters, page, limit);
  }

  async getProjectByUuid(uuid: string) {
    return await this.projectRepository.getByUuid(uuid);
  }

  async getProjectByFields(conditions: Partial<Project>) {
    return await this.projectRepository.getByFields(conditions);
  }

  async createProject(payload: Project) {
    return await this.projectRepository.create(payload);
  }

  async updateProjectByUuid(uuid: string, payload: Partial<Project>) {
    const checkProject = await this.getProjectByFields({ uuid });
    if (!checkProject.length)
      throw new BadRequest("Your don't have project, create project first");
    return await this.projectRepository.updateByUuid(uuid, payload);
  }
}
