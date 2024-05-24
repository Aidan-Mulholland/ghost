import pg from "pg";
import { envConfig } from "./env";

const config: pg.PoolConfig = {
  host: envConfig.DB_HOST,
  user: envConfig.DB_USER,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

export const db = new pg.Pool(config);
