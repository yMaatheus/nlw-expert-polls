import { z } from "zod";

export function parseEnv(env: NodeJS.ProcessEnv) {
  const envSchema = z.object({
    PORT: z.coerce.number(),
    origin: z.string().url(),
  });

  const parsedEnv = envSchema.safeParse(env);

  if (!parsedEnv.success) {
    console.error(
      "Invalid environment variables ",
      parsedEnv.error.flatten().fieldErrors
    );

    throw new Error("Invalid environment variables.");
  }

  return parsedEnv.data;
}
