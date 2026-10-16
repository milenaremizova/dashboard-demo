import type { TaskCreditsDayRecord } from "../types";

export const HIGH_MANUAL_THRESHOLD = 2;

export interface GameTotals {
  gameId: string;
  name: string;
  automatic: number;
  manual: number;
  percentManual: number; // % ручных от (automatic + manual)
}

export interface TaskCreditsAggregate {
  byGame: GameTotals[];
  totalAutomatic: number;
  totalManual: number;
  totalPercentManual: number; // "Всего" % ручных по всем играм вместе
}

function percentOf(part: number, whole: number): number {
  if (!whole) return 0;
  return Math.round((part / whole) * 1000) / 10;
}

export function aggregateRange(
  history: TaskCreditsDayRecord[],
  startISO: string,
  endISO: string,
): TaskCreditsAggregate {
  const days = history.filter((d) => d.date >= startISO && d.date <= endISO);

  const byGameMap = new Map<string, GameTotals>();
  for (const day of days) {
    for (const g of day.games) {
      const existing = byGameMap.get(g.gameId);
      if (existing) {
        existing.automatic += g.automatic;
        existing.manual += g.manual;
      } else {
        byGameMap.set(g.gameId, {
          gameId: g.gameId,
          name: g.name,
          automatic: g.automatic,
          manual: g.manual,
          percentManual: 0,
        });
      }
    }
  }

  const byGame = Array.from(byGameMap.values()).map((g) => ({
    ...g,
    percentManual: percentOf(g.manual, g.automatic + g.manual),
  }));

  const totalAutomatic = byGame.reduce((s, g) => s + g.automatic, 0);
  const totalManual = byGame.reduce((s, g) => s + g.manual, 0);

  return {
    byGame,
    totalAutomatic,
    totalManual,
    totalPercentManual: percentOf(totalManual, totalAutomatic + totalManual),
  };
}

export interface WeekRow {
  weekStart: string;
  weekLabel: string;
  byGame: GameTotals[];
  totalPercentManual: number;
}

export function buildWeeklyRows(
  history: TaskCreditsDayRecord[],
  startISO: string,
  endISO: string,
): WeekRow[] {
  const days = history.filter((d) => d.date >= startISO && d.date <= endISO);
  if (days.length === 0) return [];

  const weeks = new Map<string, TaskCreditsDayRecord[]>();
  for (const day of days) {
    const weekStart = getWeekStartISO(day.date);
    const bucket = weeks.get(weekStart) ?? [];
    bucket.push(day);
    weeks.set(weekStart, bucket);
  }

  return Array.from(weeks.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([weekStart, weekDays]) => {
      const weekEnd = addDaysISO(weekStart, 6);
      const agg = aggregateRange(weekDays, weekStart, weekEnd);
      return {
        weekStart,
        weekLabel: `${formatShort(weekStart)}–${formatShort(weekEnd)}`,
        byGame: agg.byGame,
        totalPercentManual: agg.totalPercentManual,
      };
    });
}

function getWeekStartISO(dateISO: string): string {
  const d = new Date(dateISO);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

function addDaysISO(dateISO: string, n: number): string {
  const d = new Date(dateISO);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function formatShort(dateISO: string): string {
  return new Date(dateISO).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
  });
}
