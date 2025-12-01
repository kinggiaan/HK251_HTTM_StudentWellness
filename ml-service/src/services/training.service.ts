import { readDatasetCsv } from "../utils/csvReader";
import { computeMockMetrics } from "../utils/metrics";

export interface TrainRequestPayload {
  modelId?: string;
  datasetPath?: string;
  algorithm?: string;
  hyperparameters?: Record<string, unknown>;
  features?: string[];
  targetVariable?: string;
  trainTestSplit?: number;
}

export interface TrainResult {
  success: boolean;
  modelId: string;
  status: "trained";
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  trainingSamples: number;
  testingSamples: number;
  parsedOk: boolean;
}

export class TrainValidationError extends Error {
  statusCode = 400;
}

export async function trainModel(
  payload: TrainRequestPayload | null | undefined
): Promise<TrainResult> {
  const {
    modelId,
    datasetPath,
    algorithm,
    hyperparameters,
    features,
    targetVariable,
    trainTestSplit,
  } = payload ?? {};

  console.log("[ML] /train payload", {
    modelId,
    datasetPath,
    algorithm,
    featuresCount: Array.isArray(features) ? features.length : 0,
    targetVariable,
    trainTestSplit,
  });

  if (!modelId || !datasetPath) {
    throw new TrainValidationError("modelId and datasetPath are required");
  }

  const { totalRows, parsedOk } = await readDatasetCsv(datasetPath);
  const metrics = computeMockMetrics(totalRows, trainTestSplit);

  return {
    success: true,
    modelId,
    status: "trained",
    accuracy: metrics.accuracy,
    precision: metrics.precision,
    recall: metrics.recall,
    f1Score: metrics.f1Score,
    trainingSamples: metrics.trainingSamples,
    testingSamples: metrics.testingSamples,
    parsedOk,
  };
}


