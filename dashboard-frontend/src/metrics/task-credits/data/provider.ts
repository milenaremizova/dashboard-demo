import type { DateRange } from "../../../types/period";
import type { TaskCreditsDayRecord } from "../types";
import { generateMockHistory } from "./mockHistory";
import * as api from "./api";
import { loadJSON, saveJSON } from "../../../lib/storage";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA !== "false";
const MOCK_HISTORY_KEY = "task-credits-dashboard:mock-history";

function getOrCreateMockHistory(): TaskCreditsDayRecord[] {
  const cached = loadJSON<TaskCreditsDayRecord[] | null>(
    MOCK_HISTORY_KEY,
    null,
  );
  if (cached) return cached;

  const fresh = generateMockHistory(90);
  saveJSON(MOCK_HISTORY_KEY, fresh);
  return fresh;
}

export async function getTaskCreditsHistory(
  range: DateRange,
): Promise<TaskCreditsDayRecord[]> {
  if (USE_MOCK) return getOrCreateMockHistory();
  return api.fetchTaskCreditHistory(range);
}
