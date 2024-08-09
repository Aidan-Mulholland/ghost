import { Identity } from "common";
import { envConfig } from "configs/env";
import { RefreshTokenController } from "controllers";
import { Request } from "express";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_TTL_MINUTES } from "./constants";
import { AccessTokenCache } from "./cache";

export const generateAccessToken = (identity: Identity) => {
  const data = { scope: ["all"] };
  const accessToken = jwt.sign(data, envConfig.ACCESS_TOKEN_SECRET, {
    subject: identity.id.toString(),
    audience: "localhost",
    issuer: "localhost",
    expiresIn: ACCESS_TOKEN_TTL_MINUTES,
  });
  return accessToken;
};

export const generateRefreshToken = (identity: Identity) => {
  const data = { scope: ["all"] };
  const refreshToken = jwt.sign(data, envConfig.REFRESH_TOKEN_SECRET, {
    subject: identity.id.toString(),
    audience: "localhost",
    issuer: "localhost",
    expiresIn: "7d",
  });
  const refreshTokenController = new RefreshTokenController();
  refreshTokenController.create(refreshToken);
  return refreshToken;
};

export const generateIdentityToken = (identity: Identity) => {
  const data = { name: identity.name, email: identity.email };
  const identityToken = jwt.sign(data, envConfig.IDENTITY_TOKEN_SECRET, {
    subject: identity.id.toString(),
    expiresIn: "7d",
  });
  return identityToken;
};

export const verifyAccessToken = (
  req: Request
):
  | { valid: true; token: string; verifiedToken: string | jwt.JwtPayload }
  | { valid: false; status: number; reason: string } => {
  const { authorization } = req.headers;
  const token = authorization?.split(" ")[1];
  if (!authorization || !token) {
    return { valid: false, status: 401, reason: "Missing authorization header" };
  }
  const isBlacklisted = AccessTokenCache.get(token);
  if (isBlacklisted !== undefined) {
    return { valid: false, status: 403, reason: "Revoked token" };
  }
  try {
    const verifiedToken = jwt.verify(token, envConfig.ACCESS_TOKEN_SECRET);
    return { valid: true, token, verifiedToken };
  } catch (error) {
    return { valid: false, status: 403, reason: typeof error === "string" ? error : "Token invalid" };
  }
};
