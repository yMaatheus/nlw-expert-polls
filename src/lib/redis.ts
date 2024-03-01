import { Redis } from "ioredis";
import { parseEnv } from "./env";

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = parseEnv(process.env)

export const redis = new Redis({
  port: REDIS_PORT,
  host: REDIS_HOST,
  password: REDIS_PASSWORD
})