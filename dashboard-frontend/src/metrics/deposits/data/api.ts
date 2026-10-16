import type { DateRange, DayRecord, TaskOverrides, TierMapping } from "../types";
import { authFetch } from "../../../lib/apiClient";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export async function fetchDepositsHistory(range: DateRange): Promise<DayRecord[]> {
  const res = await authFetch(`${BASE_URL}/api/deposits?start=${range.start}&end=${range.end}`);
  if (!res.ok) throw new Error(`Не удалось получить депозиты: ${res.status}`);
  return (await res.json()) as DayRecord[];
}


export async function fetchTaskOverrides(): Promise<TaskOverrides> {
  const res = await authFetch(`${BASE_URL}/api/deposits/overrides`);
  if (!res.ok) throw new Error(`Не удалось получить корректировки: ${res.status}`);
  return (await res.json()) as TaskOverrides;
}

export async function saveTaskOverride(rangeKey: string, taskId: string, value: number): Promise<void> {
  const res = await authFetch(`${BASE_URL}/api/deposits/overrides`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rangeKey, taskId, value }),
  });
  if (!res.ok) throw new Error(`Не удалось сохранить корректировку: ${res.status}`);
}

export async function deleteTaskOverride(rangeKey: string, taskId: string): Promise<void> {
  const res = await authFetch(
    `${BASE_URL}/api/deposits/overrides?rangeKey=${encodeURIComponent(rangeKey)}&taskId=${encodeURIComponent(taskId)}`,
    { method: "DELETE" }
  );
  if (!res.ok) throw new Error(`Не удалось сбросить корректировку: ${res.status}`);
}

export async function fetchTierMapping(): Promise<TierMapping> {
  const response = await authFetch(`${BASE_URL}/api/deposits/tiers`);
  if (!response.ok) throw new Error(`Не удалось получить задания: ${response.status}`);
  return (await response.json() as TierMapping);
}

export async function saveTierMapping(mapping: TierMapping): Promise<void> {
  const response = await authFetch(`${BASE_URL}/api/deposits/tiers`, {
    method: "PUT",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(mapping),
  });
  if (!response.ok) throw new Error(`Не удалось сохранить задания: ${response.status}`);
}