import { z } from "zod";

export const signupRequestSchema = z.object({
  username: z.string(),
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

export const revokeRequestSchema = z.object({
  token: z.string(),
  token_type_hint: z.enum(["refresh", "access"]),
});

export type RevokeRequest = z.infer<typeof revokeRequestSchema>;
