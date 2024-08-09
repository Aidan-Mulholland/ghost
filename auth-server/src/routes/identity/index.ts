import express from "express";
import {
  loginHandler,
  refreshTokenHandler,
  revokeTokenHandler,
  signupHandler,
  validateAccessTokenHandler,
} from "./handlers";

export const identityRouter = express.Router();

identityRouter.post("/login", loginHandler);

identityRouter.post("/signup", signupHandler);

identityRouter.post("/token", refreshTokenHandler);

identityRouter.post("/validate", validateAccessTokenHandler);

identityRouter.post("/revoke", revokeTokenHandler);
