import type { TaskCreditsDayRecord } from "../types";
import { addDays, toISO } from "../../../lib/dates";

const GAMES = [
  { gameId: "cs2", name: "CS2" },
  { gameId: "dota2", name: "Dota2" },
];

export function generateMockHistory(days = 90): TaskCreditsDayRecord[] {
  const today = new Date();
  const history: TaskCreditsDayRecord[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = addDays(today, -i);
    const games = GAMES.map((g) => {
      const automatic = Math.round(20 + Math.random() * 60);
      const manual = Math.round(Math.random() * automatic * 0.4);
      return { ...g, automatic, manual };
    });
    history.push({ date: toISO(date), games });
  }
  return history;
}
