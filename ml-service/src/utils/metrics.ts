export interface MetricsResult {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  trainingSamples: number;
  testingSamples: number;
}

/**
 * Compute deterministic mock metrics based on row count and train/test split.
 * Logic is preserved from the original implementation in index.ts.
 */
export function computeMockMetrics(
  totalRows: number | undefined,
  trainTestSplit: number | undefined
): MetricsResult {
  const safeTotalRows = totalRows && totalRows > 0 ? totalRows : 100;
  const split = typeof trainTestSplit === "number" ? trainTestSplit : 0.8;

  const base = Math.max(10, Math.min(90, Math.floor((safeTotalRows % 50) + 40)));
  const accuracy = Number((base / 100).toFixed(2));
  const precision = Number(((base - 2) / 100).toFixed(2));
  const recall = Number(((base - 1) / 100).toFixed(2));
  const f1Score = Number((((precision + recall) / 2)).toFixed(2));

  const trainingSamples = Math.floor(safeTotalRows * split);
  const testingSamples = Math.ceil(safeTotalRows * (1 - split));

  return {
    accuracy,
    precision,
    recall,
    f1Score,
    trainingSamples,
    testingSamples,
  };
}


