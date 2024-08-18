import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";
import { db } from "..";

export const IdentityTable = pgTable("identity", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  password: text("password").notNull(),
});

export type Identity = typeof IdentityTable.$inferSelect;
export type NewIdentity = typeof IdentityTable.$inferInsert;

export class IdentityController {
  public async get(options: { id?: number; email?: string }): Promise<Identity | undefined> {
    if (options.email === undefined && options.id === undefined) {
      throw Error("Id or Email must be provided");
    }
    if (options.email !== undefined) {
      const data = await db.select().from(IdentityTable).where(eq(IdentityTable.email, options.email));
      if (data.length === 1) return data[0];
    } else if (options.id !== undefined) {
      const data = await db.select().from(IdentityTable).where(eq(IdentityTable.id, options.id));
      if (data.length === 1) return data[0];
    }
  }

  public async list(): Promise<Identity[]> {
    const data = await db.select().from(IdentityTable);
    return data;
  }

  /**
   * This should not be used as a standalone function except in exceptional circumstances. Instead use the "newUser" transaction function
   */
  public async create(target: Omit<Identity, "id">): Promise<Identity | undefined> {
    const data = await db.insert(IdentityTable).values(target).returning();
    if (data.length === 1) return data[0];
  }

  public async update(target: Identity): Promise<Identity | undefined> {
    const data = await db.update(IdentityTable).set(target).where(eq(IdentityTable.id, target.id)).returning();
    if (data.length === 1) return data[0];
  }

  public async delete(id: number): Promise<Identity | undefined> {
    const data = await db.delete(IdentityTable).where(eq(IdentityTable.id, id)).returning();
    if (data.length === 1) return data[0];
  }
}

export const identityController = new IdentityController();
