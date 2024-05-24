import { AccountController } from "controllers/account";
import express from "express";

export const router = express.Router();

router.get("/", (req, res, next) => {
  console.log(req.body);
  const { id, email } = req.body;
  if (!id || !email) {
    res.status(400).send("Provide an id or email");
    return;
  }
  const controller = new AccountController();
  const account = controller.get({ id, email });
  if (!account) {
    res.status(404).send("Account not found");
    return;
  }
  res.status(200).send(account);
});
