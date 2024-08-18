import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";
import { db, IdentityTable } from "..";

export const AccountTable = pgTable("account", {
  id: serial("id").primaryKey(),
  identityId: integer("identity_id").references(() => IdentityTable.id),
  username: text("username").notNull(),
  bio: text("bio"),
  picture: text("picture"),
});

export type Account = typeof AccountTable.$inferSelect;
export type NewAccount = typeof AccountTable.$inferInsert;

export class AccountController {
  public async get({ id, identityId }: { id?: number; identityId?: number }): Promise<Account> {
    if (id) {
      const [account] = await db.select().from(AccountTable).where(eq(AccountTable.id, id));
      return account;
    } else if (identityId) {
      const [account] = await db.select().from(AccountTable).where(eq(AccountTable.identityId, identityId));
      return account;
    } else {
      throw Error("No id provided");
    }
  }

  public async list(): Promise<Account[]> {
    const data = await db.select().from(AccountTable);
    return data;
  }

  /**
   * This should not be used as a standalone function except in exceptional circumstances. Instead use the "newUser" transaction function
   */
  public async create(target: Omit<Account, "id">): Promise<Account> {
    const [account] = await db.insert(AccountTable).values(target).returning();
    return account;
  }

  public async update(target: Account): Promise<Account> {
    const [account] = await db.update(AccountTable).set(target).where(eq(AccountTable.id, target.id)).returning();
    return account;
  }

  public async delete(id: number): Promise<Account> {
    const [account] = await db.delete(AccountTable).where(eq(AccountTable.id, id)).returning();
    return account;
  }
}

export const accountController = new AccountController();
