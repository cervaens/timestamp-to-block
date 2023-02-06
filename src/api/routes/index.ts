import express, { Router } from "express";
import { getBlockStats } from "../controllers/blockStats";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";

/**
 * Routes class for express
 */
export class Routes {
  router: Router;
  constructor() {
    this.router = express.Router();

    this.router.use("/api-docs", swaggerUi.serve);
    this.router.get(
      "/api-docs",
      swaggerUi.setup(swaggerDocument, {
        explorer: true,
      })
    );
    this.router.get("/block-stats", getBlockStats);
  }

  public getRouter() {
    return this.router;
  }
}
