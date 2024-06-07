import { z } from "zod";
import "dotenv/config";

const configSchema = z.object({
  DB_HOST: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  IDENTITY_TOKEN_SECRET: z.string(),
});

export const getEnvConfig = () => {
  const parsedConfig = configSchema.parse(process.env);
  return parsedConfig;
};

export const envConfig = getEnvConfig();
