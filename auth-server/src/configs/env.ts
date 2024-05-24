import { z } from "zod";
import "dotenv/config";

const configSchema = z.object({
  DB_HOST: z.string(),
  DB_USER: z.string(),
  AUTH_TOKEN: z.string(),
});

export const getEnvConfig = () => {
  const parsedConfig = configSchema.parse(process.env);
  return parsedConfig;
};

export const envConfig = getEnvConfig();
