import express, { Router } from "express";
import { getBlockStats } from "../controllers/blockStats";

export class Routes {
  router: Router;
  constructor() {
    this.router = express.Router();
    this.router.get("/block-stats", getBlockStats);
  }

  public getRouter() {
    return this.router;
  }
}
