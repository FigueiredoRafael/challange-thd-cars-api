import { Application } from "express";
import CarsController from "./controllers/CarsController";
import { Router } from "./helpers/Router";

export function setupRoutes(app: Application) {
  const router = new Router(app);

  router.group("/api", (router) => {
    router.group("/v1", (router) => {
      router.get("/", (req, res) => {
        res.status(200).json({ status: "ok", message: "Working!" });
      });
    });
  });

  router.group("/cars", (router) => {
    router.get("/", CarsController.index);
    router.get("/:id", CarsController.show);
    router.post("/", CarsController.create);
  });
}
