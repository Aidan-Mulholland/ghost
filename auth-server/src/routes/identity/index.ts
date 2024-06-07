import { IdentityController, RefreshTokenController } from "controllers";
import jwt from "jsonwebtoken";
import express from "express";
import { envConfig } from "configs/env";
import { loginRequestSchema, signupRequestSchema, refreshTokenRequestSchema, RefreshToken } from "common";
import { genSalt, compare, hash } from "bcrypt";
import { generateAccessToken, generateIdentityToken, generateRefreshToken } from "util/jwt";
import { randomUUID } from "crypto";

export const router = express.Router();

router.post("/login", async (req, res) => {
  console.log(req.body);
  const parsedReq = loginRequestSchema.safeParse(req.body);
  if (!parsedReq.success) {
    console.error(parsedReq.error);
    return res.status(400).end();
  }
  const { email, password } = parsedReq.data;

  const controller = new IdentityController();
  const identity = await controller.get({ email });
  if (!identity) {
    return res.status(404).send("Account not found");
  }

  const validPassword = await compare(password, identity.password);
  if (!validPassword) {
    return res.status(403);
  }

  const accessToken = generateAccessToken(identity);
  const refreshToken = generateRefreshToken(identity);
  const identityToken = generateIdentityToken(identity);

  res.status(200).json({ accessToken, refreshToken, identityToken });
});

router.post("/signup", async (req, res) => {
  const parsedReq = signupRequestSchema.safeParse(req.body);
  if (!parsedReq.success) {
    return res.status(400).end();
  }
  const { name, email, password } = parsedReq.data;

  const salt = await genSalt(10);
  const hashedPassword = await hash(password, salt);
  const controller = new IdentityController();
  const identity = await controller.create({ id: randomUUID(), name, email, password: hashedPassword });
  console.log(identity);

  const accessToken = generateAccessToken(identity);
  const refreshToken = generateRefreshToken(identity);
  const identityToken = generateIdentityToken(identity);

  res.status(200).json({ accessToken, refreshToken, identityToken });
});

router.post("/token", async (req, res) => {
  const parsedReq = refreshTokenRequestSchema.safeParse(req.body);
  if (!parsedReq.success) {
    return res.status(400).end();
  }
  const { token } = parsedReq.data;
  const refreshTokenController = new RefreshTokenController();
  const data = await refreshTokenController.get(token);
  if (!data) {
    return res.status(403).end();
  }
  jwt.verify(token, envConfig.REFRESH_TOKEN_SECRET, async (err, refreshToken) => {
    if (err) {
      return res.status(403).send(err).end();
    }
    const identityController = new IdentityController();
    const identity = await identityController.get({ id: (refreshToken as RefreshToken).sub });
    if (!identity) {
      return res.status(404).send("Account does not exist").end();
    }
    console.log(identity);
    const accessToken = generateAccessToken(identity);
    res.json({ accessToken });
  });
});

// TODO: Implement signature header and CORS restriction to resource server url
router.post("/validate", (req, res) => {
  const { authorization } = req.headers;
  const token = authorization?.split(" ")[1];
  if (!authorization || !token) {
    return res.status(401).send("Missing authorization header").end();
  }
  jwt.verify(token, envConfig.ACCESS_TOKEN_SECRET, (err, identity) => {
    if (err) {
      return res.status(403).send(err).end();
    }

    return res.status(204).end();
  });
});
