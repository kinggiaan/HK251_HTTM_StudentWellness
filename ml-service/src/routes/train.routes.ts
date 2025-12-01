import { Express, Router } from "express";
import {
  trainModel,
  TrainValidationError,
} from "../services/training.service";

export function registerTrainRoutes(app: Express) {
  const router = Router();

  router.post("/train", async (req, res) => {
    try {
      const result = await trainModel(req.body);
      return res.json(result);
    } catch (err: any) {
      if (err instanceof TrainValidationError) {
        return res
          .status(err.statusCode)
          .json({ success: false, error: err.message });
      }

      const message = err?.message ?? "Unknown error";
      return res.status(500).json({ success: false, error: message });
    }
  });

  app.use("/", router);
}


