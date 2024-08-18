import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken, generateIdentityToken, verifyAccessToken } from "util/jwt";
import { NextFunction, Request, Response } from "express";
import { compare, genSalt, hash } from "bcrypt";
import { config } from "configs/env";
import { AccessTokenCache } from "util/cache";
import {
  loginRequestSchema,
  refreshTokenRequestSchema,
  revokeRequestSchema,
  signupRequestSchema,
  identityController,
  refreshTokenController,
} from "common";
import type { RefreshToken } from "common";

export const loginHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedReq = loginRequestSchema.safeParse(req.body);
    if (!parsedReq.success) {
      console.error(parsedReq.error);
      return res.status(400).end();
    }
    const { email, password } = parsedReq.data;

    const identity = await identityController.get({ email });
    if (!identity) {
      return res.status(404).send("Account not found").end();
    }

    const validPassword = await compare(password, identity.password);
    if (!validPassword) {
      return res.status(403).end();
    }

    const accessToken = generateAccessToken(identity);
    const refreshToken = generateRefreshToken(identity);
    const identityToken = generateIdentityToken(identity);

    // Store refresh token in database
    await refreshTokenController.create(refreshToken);

    res.status(200);
    res.cookie("accessToken", accessToken, {
      sameSite: "lax",
      secure: true,
      httpOnly: true,
      path: "/",
    });
    res.cookie("refreshToken", refreshToken, {
      sameSite: "lax",
      secure: true,
      httpOnly: true,
      path: "/",
    });
    res.cookie("identityToken", identityToken, {
      sameSite: "lax",
      secure: true,
      httpOnly: false,
      path: "/",
    });
    res.end();
  } catch (error) {
    return next(error);
  }
};

export const signupHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedReq = signupRequestSchema.safeParse(req.body);
    if (!parsedReq.success) {
      return res.status(400).end();
    }
    const { username, email, password } = parsedReq.data;

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);
    const identity = await identityController.create({ email, password: hashedPassword });
    if (!identity) {
      return res.status(500).send("Failed to create account").end();
    }
    const accessToken = generateAccessToken(identity);
    const refreshToken = generateRefreshToken(identity);
    const identityToken = generateIdentityToken(identity);

    // Store refresh token in database
    await refreshTokenController.create(refreshToken);

    res.status(200);
    res.cookie("accessToken", accessToken, {
      sameSite: "lax",
      secure: true,
      httpOnly: true,
      path: "/",
    });
    res.cookie("refreshToken", refreshToken, {
      sameSite: "lax",
      secure: true,
      httpOnly: true,
      path: "/",
    });
    res.cookie("identityToken", identityToken, {
      sameSite: "lax",
      secure: true,
      httpOnly: false,
      path: "/",
    });
    res.end();
  } catch (error) {
    return next(error);
  }
};

export const refreshTokenHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedReq = refreshTokenRequestSchema.safeParse(req.body);
    if (!parsedReq.success) {
      return res.status(400).end();
    }
    const { token } = parsedReq.data;
    const data = await refreshTokenController.get(token);
    if (!data) {
      return res.status(403).end();
    }
    jwt.verify(token, config.REFRESH_TOKEN_SECRET, async (err, refreshToken) => {
      if (err) {
        return res.status(403).send(err).end();
      }
      const identity = await identityController.get({ email: (refreshToken as RefreshToken).sub });
      if (!identity) {
        return res.status(404).send("Account does not exist").end();
      }
      console.log(identity);
      const accessToken = generateAccessToken(identity);
      res.json({ accessToken });
    });
  } catch (error) {
    return next(error);
  }
};

// TODO: Implement signature header and CORS restriction to resource server url
export const validateAccessTokenHandler = (req: Request, res: Response) => {
  const verifiedToken = verifyAccessToken(req);
  if (!verifiedToken.valid) {
    const { status, reason } = verifiedToken;
    return res.status(status).send(reason).end();
  }
  return res.status(204).end();
};

export const revokeTokenHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Verify incoming access token
    const verifiedToken = verifyAccessToken(req);
    if (!verifiedToken.valid) {
      const { status, reason } = verifiedToken;
      return res.status(status).send(reason).end();
    }

    // Zod parse the body
    const parsedRequest = revokeRequestSchema.safeParse(req.body);
    if (!parsedRequest.success) {
      return res.status(400).end();
    }

    const { token, token_type_hint } = parsedRequest.data;
    if (token_type_hint === "access") {
      // Add to memory cache, key: token; value: ""
      // TODO: For scaling, this should be upgraded to a redis cache
      // Attempt to set the cache maximum of 5 times
      let attempts = 0;
      let success = false;
      while (!success && attempts < 5) {
        success = AccessTokenCache.set(token, "");
      }
      if (!success) {
        return res.status(500).send("Failed to revoke Access Token").end();
      } else {
        return res.status(200).end();
      }
    } else if (token_type_hint === "refresh") {
      // Add to memory cache, key: token; value: ""
      // TODO: For scaling, this should be upgraded to a redis cache
      // Attempt to set the cache maximum of 5 times
      let attempts = 0;
      let success: undefined | boolean | { id: number; token: string } = false;
      while (!success && attempts < 5) {
        success = AccessTokenCache.set(token, "");
      }
      if (!success) {
        return res.status(500).send("Failed to revoke Access Token").end();
      }

      // Remove refresh token from table
      // The /token endpoint checks this table for the existence of the refresh token before issuing a new access token
      // This revokes this refresh token
      attempts = 0;
      success = undefined;
      while (!success && attempts < 5) {
        success = await refreshTokenController.delete(verifiedToken.token);
      }
      if (!success) {
        return res.status(500).send("Failed to revoke Refresh Token").end();
      } else {
        return res.status(200).end();
      }
    }
  } catch (error) {
    return next(error);
  }
};
