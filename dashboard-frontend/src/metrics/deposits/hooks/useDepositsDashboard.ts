import { useEffect, useMemo, useState } from "react";
import type { DayRecord, TaskOverrides } from "../../../types/period";
import { TASK_TIERS } from "../config/taskTiers";
import { usePeriodSelector } from "../../../hooks/usePeriodSelector";
import { aggregateRange, applyOverrides, deltaPct } from "../lib/aggregate";
import {
  getDepositsHistory,
  getTaskOverrides,
  isMockMode,
  setTaskOverride,
  clearTaskOverride,
} from "../data/provider";
import { loadJSON, saveJSON } from "../../../lib/storage";

const OVERRIDES_KEY = "deposits-dashboard:task-overrides";

export function useDepositsDashboard() {
  const period = usePeriodSelector("deposits-dashboard:view-state");

  const [history, setHistory] = useState<DayRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [taskOverrides, setTaskOverrides] = useState<TaskOverrides>(() =>
    isMockMode ? loadJSON<TaskOverrides>(OVERRIDES_KEY, {}) : {},
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([getDepositsHistory(period.range), getTaskOverrides()])
      .then(([historyData, overridesData]) => {
        if (cancelled) return;
        setHistory(historyData);
        if (!isMockMode) setTaskOverrides(overridesData);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const raw = useMemo(
    () =>
      aggregateRange(history, period.range.start, period.range.end, TASK_TIERS),
    [history, period.range.start, period.range.end],
  );
  const agg = useMemo(
    () => applyOverrides(raw.byTask, period.rangeKey, taskOverrides),
    [raw, period.rangeKey, taskOverrides],
  );

  const prevAgg = useMemo(
    () =>
      aggregateRange(
        history,
        period.prevRange.start,
        period.prevRange.end,
        TASK_TIERS,
      ),
    [history, period.prevRange.start, period.prevRange.end],
  );
  const prevTotalCount = prevAgg.byTask.reduce((s, t) => s + t.completed, 0);
  const prevTotalAmount = prevAgg.byTask.reduce((s, t) => s + t.amountTotal, 0);

  const countDelta = deltaPct(agg.totalCount, prevTotalCount);
  const amountDelta = deltaPct(agg.totalAmount, prevTotalAmount);

  const trendData = useMemo(() => {
    if (raw.days.length < 2) return [];
    return raw.days.map((d) => ({
      date: d.date,
      label: new Date(d.date).toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
      }),
      count: d.tasks.reduce((s, t) => s + t.completed, 0),
    }));
  }, [raw]);

  async function editTaskCount(taskId: string, value: number) {
    const key = `${period.rangeKey}::${taskId}`;
    setTaskOverrides((prev) => {
      const next = { ...prev, [key]: value };
      if (isMockMode) saveJSON(OVERRIDES_KEY, next);
      return next;
    });
    if (!isMockMode) {
      try {
        await setTaskOverride(period.rangeKey, taskId, value);
      } catch (e) {
        setError((e as Error).message);
      }
    }
  }

  async function resetTaskOverride(taskId: string) {
    const key = `${period.rangeKey}::${taskId}`;
    setTaskOverrides((prev) => {
      const next = { ...prev };
      delete next[key];
      if (isMockMode) saveJSON(OVERRIDES_KEY, next);
      return next;
    });
    if (!isMockMode) {
      try {
        await clearTaskOverride(period.rangeKey, taskId);
      } catch (e) {
        setError((e as Error).message);
      }
    }
  }

  return {
    ...period,
    loading,
    error,
    agg,
    countDelta,
    amountDelta,
    trendData,
    editTaskCount,
    resetTaskOverride,
  };
}
