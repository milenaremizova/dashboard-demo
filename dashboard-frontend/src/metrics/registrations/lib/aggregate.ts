import type { RegistrationDayRecord } from "../types";

export interface RegistrationsAggregate {
  total: number;
  onboardingCompleted: number;
  onboardingNotCompleted: number;
}

export function aggregateRange(
  history: RegistrationDayRecord[],
  startISO: string,
  endISO: string,
): RegistrationsAggregate {
  const days = history.filter((d) => d.date >= startISO && d.date <= endISO);
  return days.reduce(
    (acc, d) => ({
      total: acc.total + d.total,
      onboardingCompleted: acc.onboardingCompleted + d.onboardingCompleted,
      onboardingNotCompleted: acc.onboardingNotCompleted + d.onboardingNotCompleted,
    }),
    { total: 0, onboardingCompleted: 0, onboardingNotCompleted: 0 },
  );
}

// % изменения к предыдущему периоду, как у депозитов. не исп. общую версию из metrics/deposits/lib/aggregate.ts, чтобы регистрации не зависели от файлов депозитов

export function deltaPct(current: number, previous: number): number | null {
  if (!previous) return null;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}
