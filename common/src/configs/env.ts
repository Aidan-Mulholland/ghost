import { z } from "zod";
import "dotenv/config";

export const baseConfigSchema = z.object({
  DB_HOST: z.string(),
  DB_NAME: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
});

export const getBaseConfig = () => {
  const parsedConfig = baseConfigSchema.parse(process.env);
  return parsedConfig;
};

export const baseConfig = getBaseConfig();

export const extendedConfigSchema = <T extends z.Schema>(schema: T) => {
  const compositeSchema = baseConfigSchema.and(schema);
  const getConfig = (): z.infer<typeof compositeSchema> => {
    const parsedConfig = compositeSchema.parse(process.env);
    return parsedConfig;
  };
  const config = getConfig();
  return { compositeSchema, getConfig, config };
};
