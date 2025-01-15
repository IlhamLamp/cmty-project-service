import { z } from "zod";

export const memberSchema = z.object({
  id: z.coerce.number().optional(),
  project_id: z.number(),
  profile_id: z.string(),
  role: z.string(),
  experience: z.enum(["no_experience", "less_than_year", "more_than_year"]),
});
