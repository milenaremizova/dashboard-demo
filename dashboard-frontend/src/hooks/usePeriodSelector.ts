import { useEffect, useState } from "react";
import type { DateRange, PeriodMode } from "../types/period";
import {
  addDays,
  formatRu,
  getPreviousPeriodLabel,
  getPreviousRange,
  getRangeForMode,
  shiftAnchor,
  toISO,
} from "../lib/dates";
import { loadJSON, saveJSON } from "../lib/storage";

interface ViewState {
  mode: PeriodMode;
  anchorDate: string;
  customStart: string;
  customEnd: string;
}

// storageKey свой на каждую метрику (например "deposits-dashboard:view-state",
// "registrations-dashboard:view-state"), чтобы выбранный период депозитов
// и регистраций не путались между собой в localStorage
export function usePeriodSelector(storageKey: string, defaultMode: PeriodMode = "day") {
  const initial = loadJSON<ViewState | null>(storageKey, null);

  const [mode, setMode] = useState<PeriodMode>(initial?.mode ?? defaultMode);
  const [anchorDate, setAnchorDate] = useState(
    initial ? new Date(initial.anchorDate) : new Date(),
  );
  const [customStart, setCustomStart] = useState(
    initial?.customStart ?? toISO(addDays(new Date(), -6)),
  );
  const [customEnd, setCustomEnd] = useState(
    initial?.customEnd ?? toISO(new Date()),
  );

  useEffect(() => {
    saveJSON<ViewState>(storageKey, {
      mode,
      anchorDate: anchorDate.toISOString(),
      customStart,
      customEnd,
    });
  }, [storageKey, mode, anchorDate, customStart, customEnd]);

  const range: DateRange = getRangeForMode(
    mode,
    anchorDate,
    customStart,
    customEnd,
  );
  const rangeKey = `${mode}:${range.start}_${range.end}`;
  const rangeLabel =
    mode === "day"
      ? formatRu(range.start)
      : `${formatRu(range.start)} — ${formatRu(range.end)}`;
  const prevRange = getPreviousRange(range);
  const deltaLabel = getPreviousPeriodLabel(mode);

  function resetToDay() {
    const today = new Date();
    setAnchorDate(today);
    setCustomStart(toISO(addDays(today, -6)));
    setCustomEnd(toISO(today));
  }

  return {
    mode,
    changeMode: setMode,
    anchorDate,
    setAnchorDate,
    moveAnchor: (dir: 1 | -1) =>
      setAnchorDate((prev) => shiftAnchor(mode, prev, dir)),
    customStart,
    setCustomStart,
    customEnd,
    setCustomEnd,
    range,
    rangeKey,
    rangeLabel,
    prevRange,
    deltaLabel,
    resetToDay,
  };
}
