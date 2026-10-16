import type { RegistrationDayRecord } from "../types";
import { addDays, toISO } from "../../../lib/dates";

export function generateMockHistory(days = 150): RegistrationDayRecord[] {
  const today = new Date();
  const history: RegistrationDayRecord[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = addDays(today, -i);
    const total = Math.round(250 + Math.random() * 300);
    const onboardingCompleted = Math.round(total * (0.5 + Math.random() * 0.2));
    history.push({
      date: toISO(date),
      total,
      onboardingCompleted,
      onboardingNotCompleted: total - onboardingCompleted,
    });
  }
  return history;
}
