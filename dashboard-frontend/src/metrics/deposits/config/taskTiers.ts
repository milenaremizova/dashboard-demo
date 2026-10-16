import type { TaskTier } from "../types";

// TODO: заменить на реальные тиры депозитов (task_id, название, сумму).
// Структура (taskId/name/amount) уже соответствует тому, что отдаёт твой SQL
// (task_amounts) — просто подставь реальные строки вместо примеров ниже.
export const TASK_TIERS: TaskTier[] = [
  { taskId: "sum_5000_shop", name: "Открытие портала", amount: 5 },
  { taskId: "sum_1000", name: "Первый шаг", amount: 10 },
  { taskId: "sum_2500", name: "Разведка территории", amount: 25 },
  { taskId: "sum_5000", name: "Сбор ресурсов", amount: 50 },
  { taskId: "sum_10000", name: "Прокачка героя", amount: 100 },
  { taskId: "sum_20000", name: "Штурм крепости", amount: 250 },
  { taskId: "sum_50000", name: "Финальный рейд", amount: 500 },
];
