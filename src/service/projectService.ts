import { Project } from "../models/project";
import { ProjectCollection } from "../repository";

export class ProjectService {
  private readonly projectRepository: ProjectCollection;

  constructor() {
    this.projectRepository = new ProjectCollection();
  }

  async getAllProject() {
    return await this.projectRepository.getAll();
  }

  async getProjectById(id: number) {
    return await this.projectRepository.getById(id);
  }

  async createProject(payload: Project) {
    return await this.projectRepository.create(payload);
  }
}
