import express, { Express, Request, Response, NextFunction } from "express";
import { registerHealthRoutes } from "./routes/health.routes";
import { registerTrainRoutes } from "./routes/train.routes";

/**
 * Simple per-request logger middleware for the ML service.
 * Keeps the same behavior as the original inline logger in index.ts.
 */
function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  console.log(`[ML] -> ${req.method} ${req.url}`);

  const done = () => {
    const ms = Date.now() - start;
    console.log(`[ML] <- ${req.method} ${req.url} (${ms}ms)`);
  };

  res.on("finish", done);
  res.on("close", done);

  next();
}

export function createMlApp(): Express {
  const app = express();

  app.use(express.json());
  app.use(requestLogger);

  // Route registration
  registerHealthRoutes(app);
  registerTrainRoutes(app);

  return app;
}


