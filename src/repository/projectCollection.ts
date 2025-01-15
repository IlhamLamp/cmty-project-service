import { Pool } from "mysql2/promise";
import * as mysql from "mysql2";
import db from "../config/db";
import { Project } from "../models/project";
import { v4 as uuid } from "uuid";

export class ProjectCollection {
  private readonly db: Pool;
  private readonly table: string;

  constructor(tableName: string = "projects") {
    this.db = db;
    this.table = tableName;
  }

  async getAll(): Promise<Project[]> {
    const query = `SELECT * FROM ${this.table}`;
    const [projects] = await this.db.query(query);
    return projects as Project[];
  }

  async getById(id: number): Promise<Project | null> {
    const query = `SELECT * FROM ${this.table} WHERE id = ?`;
    const [project] = await this.db.query(query, [id]);
    return (project as Project[]).length > 0 ? (project as Project[])[0] : null;
  }

  async create(payload: Project): Promise<Project> {
    const projectUuid = uuid();
    const query = `INSERT INTO ${this.table} (
        uuid, logo, owner, title, company, start_date, end_date, types, duration,
        participation, address_city, address_state, address_zip_code, address_street,
        approval, description, salary, priority, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const data = [
      projectUuid,
      payload.logo,
      payload.owner,
      payload.title,
      payload.company,
      new Date(payload.start_date).toISOString().split("T")[0],
      new Date(payload.end_date).toISOString().split("T")[0],
      payload.types,
      payload.duration,
      payload.participation,
      payload.address_city,
      payload.address_state,
      payload.address_zip_code,
      payload.address_street,
      payload.approval,
      payload.description,
      payload.salary,
      payload.priority,
      payload.status,
    ];
    const [result] = await this.db.query(query, data);
    const projectId = (result as mysql.OkPacketParams).insertId;
    return {
      ...payload,
      id: projectId,
      uuid: projectUuid,
    };
  }

  async getByFields(conditions: Partial<Project>): Promise<Project[]> {
    const keys = Object.keys(conditions) as (keyof Project)[];
    const values = keys.map((key) => conditions[key]);
    const whereClause = keys.map((key) => `${key} = ?`).join(" AND ");
    const query = `SELECT * FROM ${this.table} WHERE ${whereClause}`;
    const [rows] = await this.db.query(query, values);
    return rows as Project[];
  }
}
