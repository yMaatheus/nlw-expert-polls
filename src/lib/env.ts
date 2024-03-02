import { z } from "zod";

export function parseEnv(env: NodeJS.ProcessEnv) {
  const envSchema = z.object({
    HOST: z.string(),
    PORT: z.coerce.number(),
    REDIS_HOST: z.string(),
    REDIS_PORT: z.coerce.number(),
    REDIS_PASSWORD: z.string(),
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
