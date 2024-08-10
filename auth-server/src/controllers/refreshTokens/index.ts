import { db } from "configs/db";
import { refreshToken } from "configs/schema";
import { eq } from "drizzle-orm";

export class RefreshTokenController {
  public async get(token: string): Promise<{ id: number; token: string } | undefined> {
    const data = await db.select().from(refreshToken).where(eq(refreshToken.token, token));
    if (data.length === 1) return data[0];
  }

  public async create(token: string): Promise<{ id: number; token: string } | undefined> {
    const data = await db.insert(refreshToken).values({ token: token }).returning();
    if (data.length === 1) return data[0];
  }

  public async delete(token: string) {
    const data = await db.delete(refreshToken).where(eq(refreshToken.token, token)).returning();
    if (data.length === 1) return data[0];
  }
}

export const refreshTokenController = new RefreshTokenController();
