import type { DateRange } from "../../../types/period";
import type { RegistrationDayRecord } from "../types";
import { generateMockHistory } from "./mockHistory";
import * as api from "./api";
import { loadJSON, saveJSON } from "../../../lib/storage";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA !== "false";
const MOCK_HISTORY_KEY = "registrations-dashboard:mock-history";

function getOrCreateMockHistory(): RegistrationDayRecord[] {
  const cached = loadJSON<RegistrationDayRecord[] | null>(
    MOCK_HISTORY_KEY,
    null,
  );

  if (cached) return cached;

  const fresh = generateMockHistory(150);
  saveJSON(MOCK_HISTORY_KEY, fresh);
  return fresh;
}

export async function getRegistrationsHistory(
  range: DateRange,
): Promise<RegistrationDayRecord[]> {
  if (USE_MOCK) return getOrCreateMockHistory();
  return api.fetchRegistrationsHistory(range);
}

export const isMockMode = USE_MOCK;
