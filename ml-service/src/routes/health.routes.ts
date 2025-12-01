import { Express, Router } from "express";

export function registerHealthRoutes(app: Express) {
  const router = Router();

  router.get("/", (_req, res) => {
    res.json({
      message:
        "ML local service up. Use POST /train with datasetPath or GET /health.",
    });
  });

  router.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use("/", router);
}


