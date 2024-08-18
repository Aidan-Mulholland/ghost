import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";
import { db } from "..";

export const refreshToken = pgTable("refresh_token", {
  id: serial("id").primaryKey(),
  token: text("token").notNull(),
});

export type RefreshTokenDB = typeof refreshToken.$inferSelect;
export type NewRefreshTokenDB = typeof refreshToken.$inferInsert;

export class RefreshTokenController {
  public async get(token: string): Promise<RefreshTokenDB | undefined> {
    const data = await db.select().from(refreshToken).where(eq(refreshToken.token, token));
    if (data.length === 1) return data[0];
  }

  public async create(token: string): Promise<RefreshTokenDB | undefined> {
    const data = await db.insert(refreshToken).values({ token: token }).returning();
    if (data.length === 1) return data[0];
  }

  public async delete(token: string) {
    const data = await db.delete(refreshToken).where(eq(refreshToken.token, token)).returning();
    if (data.length === 1) return data[0];
  }
}

export const refreshTokenController = new RefreshTokenController();
