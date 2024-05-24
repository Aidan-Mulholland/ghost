import { z } from "zod";

export const signupSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

export type Signup = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export type Login = z.infer<typeof loginSchema>;

export const getAccountSchema = z.object({
  id: z.string().optional(),
  email: z.string().optional(),
});

export type GetAccount = z.infer<typeof getAccountSchema>;
