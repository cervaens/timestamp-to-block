import express, { Request, Response, Application, Router } from "express";
// import { getBlockNumberPerTS } from "../controllers/blockNumberPerTS";

export class Routes {
  router: Router;
  constructor() {
    this.router = express.Router();
    this.router.get("/block-stats", async (req: Request, res: Response) => {
      if (!req.query.timestamp) {
        res.status(400).send(`Please define a timestamp`);
        return;
      }
      res.status(200).send(`Hi`);
    });
  }

  public getRouter() {
    return this.router;
  }
}
