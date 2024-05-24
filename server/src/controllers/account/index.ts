import { db } from "configs/db";
import { Account } from "common";

export class AccountController {
  public async get(options: { id?: number; email?: string }): Promise<Account | undefined> {
    if (options.email === undefined && options.id === undefined) {
      throw Error("Id or Email must be provided");
    }
    if (options.email !== undefined) {
      const query = {
        text: "SELECT name, email FROM account WHERE email = $1,",
        values: [options.email],
      };
      const data = await db.query<Account>(query);
      if (data.rowCount === 1) return data.rows[0];
    } else if (options.id !== undefined) {
      const query = {
        text: "SELECT name, email FROM account WHERE id = $1",
        values: [options.id],
      };
      const data = await db.query<Account>(query);
      if (data.rowCount === 1) return data.rows[0];
    }
  }

  public async list(): Promise<Account[]> {
    const query = {
      text: "SELECT name, email FROM account",
    };
    const data = await db.query<Account>(query);
    return data.rows;
  }

  public async update(account: Account): Promise<Account | undefined> {
    const query = {
      text: `UPDATE account SET ${Object.keys(account).map((field, index) => {
        if (field !== "id") `${field} = $${index + 1}`;
      })} WHERE id = $${Object.keys(account).length}`,
      values: Object.values(account),
    };
    const data = await db.query<Account>(query);
    if (data.rowCount === 1) return data.rows[0];
  }

  public async create(account: Omit<Account, "id">): Promise<Account> {
    const query = {
      text: `INSERT INTO account(name, email) VALUES(${Object.keys(account).map((field, index) => {
        if (field !== "id") `${field} = $${index + 1}`;
      })})`,
      values: Object.values(account),
    };
    const data = await db.query<Account>(query);
    return data.rows[0];
  }

  public async delete(id: number): Promise<Account> {
    const query = {
      text: "DELETE FROM account WHERE id = $1",
      values: [id],
    };
    const data = await db.query<Account>(query);
    return data.rows[0];
  }
}
