import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";
import { db, identity } from "..";

export const account = pgTable("account", {
  id: serial("id").primaryKey(),
  identityId: integer("identity_id").references(() => identity.id),
  username: text("username").notNull(),
  bio: text("bio").notNull(),
  picture: text("picture"),
});

export type Account = typeof account.$inferSelect;
export type NewAccount = typeof account.$inferInsert;

export class AccountController {
  public async get(id: number): Promise<Account | undefined> {
    const data = await db.select().from(account).where(eq(account.id, id));
    if (data.length === 1) return data[0];
  }

  public async list(): Promise<Account[]> {
    const data = await db.select().from(account);
    return data;
  }

  public async update(target: Account): Promise<Account | undefined> {
    const data = await db.update(account).set(target).where(eq(account.id, target.id)).returning();
    if (data.length === 1) return data[0];
  }

  public async create(target: Omit<Account, "id">): Promise<Account | undefined> {
    const data = await db.insert(account).values(target).returning();
    if (data.length === 1) return data[0];
  }

  public async delete(id: number): Promise<Account | undefined> {
    const data = await db.delete(account).where(eq(account.id, id)).returning();
    if (data.length === 1) return data[0];
  }
}

export const accountController = new AccountController();
