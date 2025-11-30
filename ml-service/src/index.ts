import express from "express";
import { createReadStream } from "fs";
import { parse } from "csv-parse";

const app = express();
app.use(express.json());

// Simple request logger
app.use((req, _res, next) => {
  const start = Date.now();
  console.log(`[ML] -> ${req.method} ${req.url}`);
  const done = () => {
    const ms = Date.now() - start;
    console.log(`[ML] <- ${req.method} ${req.url} (${ms}ms)`);
  };
  _res.on('finish', done);
  _res.on('close', done);
  next();
});

app.get("/", (_req, res) => {
  res.json({
    message: "ML local service up. Use POST /train with datasetPath or GET /health."
  });
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/train", async (req, res) => {
  try {
    const {
      modelId,
      datasetPath,
      algorithm,
      hyperparameters,
      features,
      targetVariable,
      trainTestSplit
    } = req.body ?? {};

    console.log("[ML] /train payload", {
      modelId,
      datasetPath,
      algorithm,
      featuresCount: Array.isArray(features) ? features.length : 0,
      targetVariable,
      trainTestSplit
    });

    // Light validation
    if (!modelId || !datasetPath) {
      return res.status(400).json({ success: false, error: "modelId and datasetPath are required" });
    }

    // Parse CSV to collect basic info; if parsing fails, still return mocked metrics
    let totalRows = 0;
    let parsedOk = true;
    try {
      await new Promise<void>((resolve, reject) => {
        const stream = createReadStream(datasetPath).pipe(
          parse({ columns: true, relaxColumnCount: true, skipEmptyLines: true })
        );
        stream.on("data", () => {
          totalRows += 1;
        });
        stream.on("end", () => resolve());
        stream.on("error", (e: any) => {
          parsedOk = false;
          resolve(); // resolve anyway to not block
        });
      });
    } catch {
      parsedOk = false;
    }

    // Produce simple deterministic mock metrics (based on row count) to make local testing stable
    const base = Math.max(10, Math.min(90, Math.floor((totalRows % 50) + 40)));
    const accuracy = Number((base / 100).toFixed(2));
    const precision = Number(((base - 2) / 100).toFixed(2));
    const recall = Number(((base - 1) / 100).toFixed(2));
    const f1Score = Number((((precision + recall) / 2)).toFixed(2));

    return res.json({
      success: true,
      modelId,
      status: "trained",
      accuracy,
      precision,
      recall,
      f1Score,
      trainingSamples: Math.floor((totalRows || 100) * (trainTestSplit ?? 0.8)),
      testingSamples: Math.ceil((totalRows || 100) * (1 - (trainTestSplit ?? 0.8))),
      parsedOk
    });
  } catch (e: any) {
    return res.status(500).json({ success: false, error: e?.message ?? "Unknown error" });
  }
});

const PORT = Number(process.env.PORT || 5001);
app.listen(PORT, () => {
  console.log(`🧪 ML service listening on http://localhost:${PORT}`);
});


