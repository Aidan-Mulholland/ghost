import { db } from "configs/db";
import { Identity } from "common";
import { identity } from "configs/schema";
import { eq } from "drizzle-orm";

export class IdentityController {
  public async get(options: { id?: number; email?: string }): Promise<Identity | undefined> {
    if (options.email === undefined && options.id === undefined) {
      throw Error("Id or Email must be provided");
    }
    if (options.email !== undefined) {
      const data = await db.select().from(identity).where(eq(identity.email, options.email));
      if (data.length === 1) return data[0];
    } else if (options.id !== undefined) {
      const data = await db.select().from(identity).where(eq(identity.id, options.id));
      if (data.length === 1) return data[0];
    }
  }

  public async list(): Promise<Identity[]> {
    const data = await db.select().from(identity);
    return data;
  }

  public async update(target: Identity): Promise<Identity | undefined> {
    const data = await db.update(identity).set(target).where(eq(identity.id, target.id)).returning();
    if (data.length === 1) return data[0];
  }

  public async create(target: Omit<Identity, "id">): Promise<Identity | undefined> {
    const data = await db.insert(identity).values(target).returning();
    if (data.length === 1) return data[0];
  }

  public async delete(id: number): Promise<Identity | undefined> {
    const data = await db.delete(identity).where(eq(identity.id, id)).returning();
    if (data.length === 1) return data[0];
  }
}

export const identityController = new IdentityController();
