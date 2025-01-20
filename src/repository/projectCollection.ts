import { Pool } from "mysql2/promise";
import * as mysql from "mysql2";
import { v4 as uuid } from "uuid";
import db from "../config/db";
import { Project } from "../models/project";
import { InsertProjectData } from "../helper";

interface IProject {
  data: Project[];
  total: number;
}

export class ProjectCollection {
  private readonly db: Pool;
  private readonly table: string;

  constructor(tableName: string = "projects") {
    this.db = db;
    this.table = tableName;
  }

  async getAll(
    filters: Partial<Project> = {},
    page: number = 1,
    limit: number = 5
  ): Promise<IProject> {
    const whereClauses: string[] = [];
    const values: any[] = [];

    for (const [key, value] of Object.entries(filters)) {
      if (Array.isArray(value)) {
        whereClauses.push(`${key} IN ?`);
        values.push(value);
      } else {
        whereClauses.push(`${key} = ?`);
        values.push(value);
      }
    }

    const whereQuery = whereClauses.length
      ? `WHERE ${whereClauses.join(" AND ")}`
      : "";

    const offset = (page - 1) * limit;

    const query = `
      SELECT * FROM ${this.table}
      ${whereQuery}
      LIMIT ? OFFSET ?
    `;

    values.push(limit, offset);

    const [rows] = await this.db.query(query, values);

    const countQuery = `SELECT COUNT (*) as total FROM ${this.table} ${whereQuery}`;
    const [countResult] = await this.db.query(
      countQuery,
      values.slice(0, values.length - 2)
    );
    const total = (countResult as mysql.RowDataPacket[])[0].total;

    return {
      data: rows as Project[],
      total,
    };
  }

  async getByUuid(uuid: string): Promise<Project | null> {
    const query = `SELECT * FROM ${this.table} WHERE uuid = ?`;
    const [project] = await this.db.query(query, [uuid]);
    return (project as Project[]).length > 0 ? (project as Project[])[0] : null;
  }

  async create(payload: Project): Promise<Project> {
    const projectUUID = uuid();
    const query = `INSERT INTO ${this.table} (
        user_id, uuid, logo, owner, title, company, start_date, end_date, types, duration,
        participation, address_city, address_state, address_zip_code, address_street,
        approval, description, salary, priority, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const data = InsertProjectData(payload, projectUUID);
    const [result] = await this.db.query(query, data);
    const projectId = (result as mysql.OkPacketParams).insertId;
    return {
      ...payload,
      id: projectId,
      uuid: projectUUID,
    };
  }

  async updateByUuid(
    uuid: string,
    payload: Partial<Project>
  ): Promise<Project | null> {
    const project = await this.getByFields({ uuid });
    if (!project) return null;

    const updateQuery = `
      UPDATE ${this.table}
      SET ${Object.keys(payload)
        .map((key) => `${key} = ?`)
        .join(", ")}
        WHERE uuid = ?`;

    const values = [...Object.values(payload), uuid];
    await this.db.query(updateQuery, values);

    const updatedProject = await this.getByFields({ uuid });
    return updatedProject.length > 0 ? updatedProject[0] : null;
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
