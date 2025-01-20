import { z } from "zod";

export const projectSchema = z.object({
  id: z.coerce.number().optional(),
  uuid: z.string().optional(),
  user_id: z.number(),
  logo: z.string(),
  owner: z.string(),
  title: z.string(),
  company: z.string(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  types: z.enum(["project", "event", "group"]),
  duration: z.enum(["day", "month", "year"]),
  participation: z.enum(["remote", "onsite", "hybrid"]),
  address_city: z.string().optional(),
  address_state: z.string().optional(),
  address_zip_code: z.coerce.number(),
  address_street: z.string().optional(),
  approval: z.enum(["no", "yes"]),
  description: z.string().optional(),
  salary: z.coerce.number(),
  priority: z.enum(["high", "medium", "low"]),
  status: z.enum(["pending", "approved", "rejected"]),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type Project = z.infer<typeof projectSchema>;
