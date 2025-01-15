import { z } from "zod";

export const tagSchema = z.object({
  id: z.coerce.number().optional(),
  mongo_id: z.string(),
  name: z.string(),
});
