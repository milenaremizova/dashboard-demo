import type { DateRange, PeriodMode } from "../types/period";

export function toISO(date: Date): string {
  const tz = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tz).toISOString().slice(0, 10);
}

export function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

export function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 = воскресенье
  return addDays(d, day === 0 ? -6 : 1 - day); // к понедельнику
}

export function endOfWeek(date: Date): Date {
  return addDays(startOfWeek(date), 6);
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function formatRu(dateISO: string): string {
  return new Date(dateISO).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function daysBetween(startISO: string, endISO: string): number {
  return (
    Math.round(
      (new Date(endISO).getTime() - new Date(startISO).getTime()) / 86400000,
    ) + 1
  );
}

export function getRangeForMode(
  mode: PeriodMode,
  anchorDate: Date,
  customStart: string,
  customEnd: string,
): DateRange {
  switch (mode) {
    case "day":
      return { start: toISO(anchorDate), end: toISO(anchorDate) };
    case "week":
      return {
        start: toISO(startOfWeek(anchorDate)),
        end: toISO(endOfWeek(anchorDate)),
      };
    case "month":
      return {
        start: toISO(startOfMonth(anchorDate)),
        end: toISO(endOfMonth(anchorDate)),
      };
    case "range":
      return { start: customStart, end: customEnd };
  }
}

export function shiftAnchor(
  mode: PeriodMode,
  anchorDate: Date,
  dir: 1 | -1,
): Date {
  if (mode === "day") return addDays(anchorDate, dir);
  if (mode === "week") return addDays(anchorDate, dir * 7);
  if (mode === "month") {
    const d = new Date(anchorDate);
    d.setMonth(d.getMonth() + dir);
    return d;
  }
  return anchorDate;
}

export function getPreviousRange(range: DateRange): DateRange {
  const len = daysBetween(range.start, range.end);
  const prevEnd = addDays(new Date(range.start), -1);
  const prevStart = addDays(prevEnd, -(len - 1));
  return { start: toISO(prevStart), end: toISO(prevEnd) };
}

const PREV_PERIOD_LABEL: Record<PeriodMode, string> = {
  day: "к прошлому дню",
  week: "к прошлой неделе",
  month: "к прошлому месяцу",
  range: "к предыдущему периоду",
};

export function getPreviousPeriodLabel(mode: PeriodMode): string {
  return PREV_PERIOD_LABEL[mode];
}
