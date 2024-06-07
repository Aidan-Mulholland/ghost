import { db } from "configs/db";
import { Identity } from "common";

export class IdentityController {
  public async get(options: { id?: string; email?: string }): Promise<Identity | undefined> {
    if (options.email === undefined && options.id === undefined) {
      throw Error("Id or Email must be provided");
    }
    if (options.email !== undefined) {
      const query = {
        text: "SELECT * FROM identity WHERE email = $1",
        values: [options.email],
      };
      const data = await db.query<Identity>(query);
      console.log(data.rows);
      if (data.rowCount === 1) return data.rows[0];
    } else if (options.id !== undefined) {
      const query = {
        text: "SELECT * FROM identity WHERE id = $1",
        values: [options.id],
      };
      const data = await db.query<Identity>(query);
      if (data.rowCount === 1) return data.rows[0];
    }
  }

  public async list(): Promise<Identity[]> {
    const query = {
      text: "SELECT * FROM identity",
    };
    const data = await db.query<Identity>(query);
    return data.rows;
  }

  public async update(identity: Identity): Promise<Identity | undefined> {
    const query = {
      text: `UPDATE identity SET ${Object.keys(identity).map((field, index) => {
        if (field !== "id") `${field} = $${index + 1}`;
      })} WHERE id = $${Object.keys(identity).length}`,
      values: Object.values(identity),
    };
    const data = await db.query<Identity>(query);
    if (data.rowCount === 1) return data.rows[0];
  }

  public async create(identity: Identity): Promise<Identity> {
    const query = {
      text: `INSERT INTO identity(${Object.keys(identity)}) VALUES(${Object.keys(identity).map(
        (field, index) => `$${index + 1}`
      )}) RETURNING *`,
      values: Object.values(identity),
    };
    const data = await db.query<Identity>(query);
    return data.rows[0];
  }

  public async delete(id: number): Promise<Identity> {
    const query = {
      text: "DELETE FROM identity WHERE id = $1",
      values: [id],
    };
    const data = await db.query<Identity>(query);
    return data.rows[0];
  }
}
