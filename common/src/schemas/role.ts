import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const role = pgTable("role", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export type Role = typeof role.$inferSelect;
