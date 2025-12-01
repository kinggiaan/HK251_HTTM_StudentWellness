import { createReadStream } from "fs";
import { parse } from "csv-parse";

export interface CsvReadResult {
  totalRows: number;
  parsedOk: boolean;
}

/**
 * Reads a CSV file and counts the number of data rows.
 * Mirrors the behavior from the original inline implementation in index.ts.
 */
export async function readDatasetCsv(datasetPath: string): Promise<CsvReadResult> {
  let totalRows = 0;
  let parsedOk = true;

  try {
    await new Promise<void>((resolve) => {
      const stream = createReadStream(datasetPath).pipe(
        parse({ columns: true, relaxColumnCount: true, skipEmptyLines: true })
      );

      stream.on("data", () => {
        totalRows += 1;
      });

      stream.on("end", () => resolve());

      stream.on("error", () => {
        parsedOk = false;
        // Resolve anyway to keep behavior non-blocking
        resolve();
      });
    });
  } catch {
    parsedOk = false;
  }

  return { totalRows, parsedOk };
}


