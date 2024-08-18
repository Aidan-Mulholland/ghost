import { accountController } from "common";
import express from "express";

export const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    console.log(req.body);
    const { id, email } = req.body;
    if (!id || !email) {
      res.status(400).send("Provide an id or email");
      return;
    }
    const account = await accountController.get(id);
    if (!account) {
      res.status(404).send("Account not found");
      return;
    }
    res.status(200).send(account);
  } catch (error) {
    next(error);
  }
});
