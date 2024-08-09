import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const identity = pgTable("identity", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  picture: text("picture"),
});

export const role = pgTable("role", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const identityRole = pgTable("identity_role", {
  role_id: serial("role_id").primaryKey(),
  identity_id: serial("identity_id").primaryKey(),
});

export const refreshToken = pgTable("refresh_token", {
  id: serial("id").primaryKey(),
  value: text("value").notNull(),
});
