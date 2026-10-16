import type { DateRange, DayRecord, TaskOverrides } from "../types";
import { generateMockHistory } from "./mockHistory";
import * as api from "./api";
import { loadJSON, saveJSON } from "../../../lib/storage";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA !== "false";

const MOCK_HISTORY_KEY = "deposits-dashboard:mock-history";

// в моковом режиме генерируем историю один раз и кладём в localStorage, чтобы при перезагрузке страницы цифры не "прыгали" и корректировки
// оставались привязаны к тем же данным
function getOrCreateMockHistory(): DayRecord[] {
  const cached = loadJSON<DayRecord[] | null>(MOCK_HISTORY_KEY, null);
  if (cached) return cached;

  const fresh = generateMockHistory(150);
  saveJSON(MOCK_HISTORY_KEY, fresh);
  return fresh;
}

export async function getDepositsHistory(
  range: DateRange,
): Promise<DayRecord[]> {
  if (USE_MOCK) return getOrCreateMockHistory();
  return api.fetchDepositsHistory(range);
}

export async function getTaskOverrides(): Promise<TaskOverrides> {
  if (USE_MOCK) return {};
  return api.fetchTaskOverrides();
}

export async function setTaskOverride(
  rangeKey: string,
  taskId: string,
  value: number,
): Promise<void> {
  if (USE_MOCK) return; // в моковом режиме корректировки хранит useDepositsDashboard (localStorage)
  return api.saveTaskOverride(rangeKey, taskId, value);
}

export async function clearTaskOverride(
  rangeKey: string,
  taskId: string,
): Promise<void> {
  if (USE_MOCK) return;
  return api.deleteTaskOverride(rangeKey, taskId);
}

export const isMockMode = USE_MOCK;
