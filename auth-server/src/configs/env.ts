import { z } from "zod";
import { extendedConfigSchema } from "common";
import "dotenv/config";

export const { compositeSchema, config, getConfig } = extendedConfigSchema(
  z.object({
    ACCESS_TOKEN_SECRET: z.string(),
    REFRESH_TOKEN_SECRET: z.string(),
    IDENTITY_TOKEN_SECRET: z.string(),
  })
);
