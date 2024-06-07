import { Identity } from "common";
import { envConfig } from "configs/env";
import { RefreshTokenController } from "controllers";
import jwt from "jsonwebtoken";

export const generateAccessToken = (identity: Identity) => {
  const data = { scope: ["all"] };
  const accessToken = jwt.sign(data, envConfig.ACCESS_TOKEN_SECRET, {
    subject: identity.id,
    expiresIn: "10m",
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
