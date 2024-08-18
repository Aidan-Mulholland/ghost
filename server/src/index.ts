import express from "express";
import { router } from "routes/account";

const app = express();
app.use(express.json());

app.use("/account", router);

app.listen(3000, () => {
  console.log("Resource server ready on port 3000");
  let route: any;
  let routes: Array<string> = [];
  app._router.stack.forEach(function (middleware: any) {
    if (middleware.route) {
      // routes registered directly on the app
      routes.push(middleware.route.path);
    } else if (middleware.name === "router") {
      // router middleware
      middleware.handle.stack.forEach(function (handler: any) {
        route = handler.route;
        route && routes.push(route);
      });
    }
  });
  console.table(routes);
});
