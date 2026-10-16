import { TASK_TIERS } from "../config/taskTiers";
import type { DayRecord } from "../types";
import { addDays, toISO } from "../../../lib/dates";

// используется только в режиме VITE_USE_MOCK_DATA=true (provider.ts). генерирует историю на N дней назад от сегодня, чтобы дашборд можно было разрабатывать и смотреть на UI без реального бэкенда
export function generateMockHistory(days = 150): DayRecord[] {
  const today = new Date();
  const history: DayRecord[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = addDays(today, -i);
    const tasks = TASK_TIERS.map((tier) => {
      const base = Math.max(1, 12 - Math.log2(tier.amount / 1000) * 3);
      const completed = Math.max(
        0,
        Math.round(base + (Math.random() - 0.5) * base),
      );
      return { ...tier, completed };
    });
    history.push({ date: toISO(date), tasks });
  }

  return history;
}
