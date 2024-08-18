import { z } from "zod";
import "dotenv/config";
import { baseConfigSchema } from "common";

const configSchema = baseConfigSchema;

export const getEnvConfig = () => {
  const parsedConfig = configSchema.parse(process.env);
  return parsedConfig;
};

export const envConfig = getEnvConfig();
