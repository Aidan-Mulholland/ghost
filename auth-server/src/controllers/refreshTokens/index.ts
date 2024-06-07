import { db } from "configs/db";

export class RefreshTokenController {
  public async get(token: string): Promise<string | undefined> {
    const query = {
      text: "SELECT token FROM refresh_token WHERE token = $1",
      values: [token],
    };
    const res = await db.query(query);
    if (res.rowCount === 1) return res.rows[0];
  }

  public async create(token: string): Promise<string> {
    const query = {
      text: "INSERT INTO refresh_token (token) VALUES($1)",
      values: [token],
    };
    const res = await db.query(query);
    return res.rows[0];
  }
}
