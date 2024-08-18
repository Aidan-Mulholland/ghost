import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { baseConfig } from "./env";

const config: pg.PoolConfig = {
  host: baseConfig.DB_HOST,
  user: baseConfig.DB_USER,
  password: baseConfig.DB_PASSWORD,
  database: baseConfig.DB_NAME,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

export const pool = new pg.Pool(config);
export const db = drizzle(pool);
