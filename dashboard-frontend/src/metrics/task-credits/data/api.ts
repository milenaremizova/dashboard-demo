import type { DateRange } from "../../../types/period";
import type { TaskCreditsDayRecord } from "../types";
import { authFetch } from "../../../lib/apiClient";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchTaskCreditHistory(
  range: DateRange,
): Promise<TaskCreditsDayRecord[]> {
  const response = await authFetch(
    `${BASE_URL}/api/task-credits?start=${range.start}&end=${range.end}`,
  );
  if (!response.ok)
    throw new Error(
      `Не удалось получить данные по заданиям: ${response.status}`,
    );
  return (await response.json()) as TaskCreditsDayRecord[];
}
