import express from "express";
import { identityRouter } from "routes/identity";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors({ credentials: true, exposedHeaders: ["Set-Cookie"], origin: "http://localhost:3000" }));

app.use("/", identityRouter);
app.listen(3001, () => {
  console.log("Server ready on port 3001");
  let route: any;
  let routes: any = [];
  app._router.stack.forEach(function (middleware: any) {
    if (middleware.route) {
      // routes registered directly on the app
      routes.push(middleware.route.path);
    } else if (middleware.name === "router") {
      // router middleware
      middleware.handle.stack.forEach(function (handler: any) {
        route = handler.route.path;
        route && routes.push(route);
      });
    }
  });
  console.log(routes);
});
