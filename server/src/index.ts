import express from "express";
import { router } from "routes/account";

const app = express();
app.use(express.json());

app.use("/account", router);
app.listen(3000, () => console.log("Server ready on port 3000"));
