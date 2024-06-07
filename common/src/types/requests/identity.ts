import { z } from "zod";

export const signupRequestSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

export type SignupRequest = z.infer<typeof signupRequestSchema>;

export const loginRequestSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;

export const refreshTokenRequestSchema = z.object({
  token: z.string(),
});

export type RefreshTokenRequest = z.infer<typeof refreshTokenRequestSchema>;
