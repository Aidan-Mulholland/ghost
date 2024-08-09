import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { envConfig } from "./env";

const config: pg.PoolConfig = {
  host: envConfig.DB_HOST,
  user: envConfig.DB_USER,
  password: envConfig.DB_PASSWORD,
  database: envConfig.DB_NAME,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

export const pool = new pg.Pool(config);
export const db = drizzle(pool);
