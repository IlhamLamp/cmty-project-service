import { z } from "zod";
import { BadRequest } from "../error";

export function badRequestValidator<TSchema extends z.ZodTypeAny>(
  data: unknown,
  schema: TSchema,
  message: string | null = "Invalid validation, please check your input!"
) {
  const validated = schema.safeParse(data);
  if (!validated.success)
    throw new BadRequest(message, null, { context: validated.error });
  return validated.data as z.infer<typeof schema>;
}
