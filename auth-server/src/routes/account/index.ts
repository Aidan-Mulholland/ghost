import { AccountController } from "controllers/account";
import jwt from "jsonwebtoken";
import express from "express";
import { envConfig } from "configs/env";
import { loginSchema, signupSchema } from "common";
import { genSalt, compare, hash } from "bcrypt";

export const router = express.Router();

router.post("/login", async (req, res) => {
  const parsedReq = loginSchema.safeParse(req.body);
  if (!parsedReq.success) {
    return res.status(400);
  }
  const { email, password } = parsedReq.data;
  const controller = new AccountController();
  const account = await controller.get({ email });
  if (!account) {
    return res.status(404).send("Account not found");
  }
  const validPassword = await compare(password, account.password);
  if (!validPassword) {
    return res.status(403);
  }
  const identityToken = jwt.sign({ id: account.id, name: account.name, email: account.email }, envConfig.AUTH_TOKEN);
  const accessToken = jwt.sign({ id: account.id, scope: ["all"] }, envConfig.AUTH_TOKEN, { expiresIn: "10m" });
  res.status(200).json({ accessToken: acces });
});

// TODO: Implement signature header and CORS restriction to resource server url
router.post("/validate", (req, res) => {
  const { authorization } = req.headers;
  const token = authorization?.split(" ")[1];
  if (!authorization || !token) {
    return res.status(401).send("Missing authorization header");
  }
  jwt.verify(token, envConfig.AUTH_TOKEN, (err, user) => {
    if (err) return res.status(403);
    return res.status(204);
  });
});

router.post("/signup", async (req, res) => {
  const parsedReq = signupSchema.safeParse(req.body);
  if (!parsedReq.success) {
    return res.status(400);
  }
  const { name, email, password } = parsedReq.data;
  const salt = await genSalt(10);
  const hashedPassword = await hash(password, salt);
  const controller = new AccountController();
  const account = await controller.create({ name, email, password: hashedPassword });
  const user = { id: account.id, name: account.name, email: account.email, scope: ["all"] };
  const token = jwt.sign(user, envConfig.AUTH_TOKEN);
  res.status(200).json(token);
});
