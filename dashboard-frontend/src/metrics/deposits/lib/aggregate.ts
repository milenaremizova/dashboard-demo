import type {
  DayRecord,
  TaskAggregate,
  TaskOverrides,
  TaskTier,
} from "../types";

export interface RawAggregate {
  byTask: (TaskTier & { completed: number; amountTotal: number })[];
  days: DayRecord[];
}

export function aggregateRange(
  history: DayRecord[],
  startISO: string,
  endISO: string,
  tiers: TaskTier[],
): RawAggregate {
  const days = history.filter((d) => d.date >= startISO && d.date <= endISO);
  const byTask = tiers.map((tier) => ({
    ...tier,
    completed: 0,
    amountTotal: 0,
  }));

  for (const day of days) {
    for (const t of day.tasks) {
      const target = byTask.find((b) => b.taskId === t.taskId);
      if (target) {
        target.completed += t.completed;
        target.amountTotal += t.completed * t.amount;
        target.name = t.name;
      }
    }
  }

  return { byTask, days };
}

export interface EffectiveAggregate {
  byTask: TaskAggregate[];
  totalCount: number;
  totalAmount: number;
}

export function applyOverrides(
  byTask: (TaskTier & { completed: number; amountTotal: number })[],
  rangeKey: string,
  overrides: TaskOverrides,
): EffectiveAggregate {
  const effective: TaskAggregate[] = byTask.map((t) => {
    const key = `${rangeKey}::${t.taskId}`;
    const hasOverride = overrides[key] !== undefined;
    const completed = hasOverride ? overrides[key] : t.completed;
    return {
      ...t,
      completed,
      rawCompleted: t.completed,
      isOverridden: hasOverride,
    };
  });

  const totalCount = effective.reduce((s, t) => s + t.completed, 0);
  const totalAmount = effective.reduce((s, t) => s + t.amountTotal, 0);

  return { byTask: effective, totalCount, totalAmount };
}

// % изменения к предыдущему периоду. null, если сравнивать не с чем
export function deltaPct(current: number, previous: number): number | null {
  if (!previous) return null;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}
