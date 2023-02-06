import express, { Application, Request, Response, NextFunction } from "express";
import { Routes } from "./api/routes";

/**
 * Main express class
 */
class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.config();
    this.app.use(new Routes().getRouter());
  }

  private config(): void {
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS,PUT");
      res.header("Access-Control-Allow-Headers", "*");
      next();
    });
    // No need for now, but always good to have.
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }
}

export default new App().app;
