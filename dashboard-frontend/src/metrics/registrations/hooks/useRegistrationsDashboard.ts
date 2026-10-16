import { useEffect, useMemo, useState } from "react";
import type { RegistrationDayRecord } from "../types";
import { usePeriodSelector } from "../../../hooks/usePeriodSelector";
import { aggregateRange, deltaPct } from "../lib/aggregate";
import { getRegistrationsHistory } from "../data/provider";

export function useRegistrationsDashboard() {
  const period = usePeriodSelector("registrations-dashboard:view-state");

  const [history, setHistory] = useState<RegistrationDayRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getRegistrationsHistory(period.range)
      .then((data) => {
        if (!cancelled) setHistory(data);
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
  }, []);

  const agg = useMemo(
    () => aggregateRange(history, period.range.start, period.range.end),
    [history, period.range.start, period.range.end],
  );
  const prevAgg = useMemo(
    () => aggregateRange(history, period.prevRange.start, period.prevRange.end),
    [history, period.prevRange.start, period.prevRange.end],
  );

  const totalDelta = deltaPct(agg.total, prevAgg.total);
  const completedDelta = deltaPct(
    agg.onboardingCompleted,
    prevAgg.onboardingCompleted,
  );

  const trendData = useMemo(() => {
    const days = history.filter(
      (d) => d.date >= period.range.start && d.date <= period.range.end,
    );
    if (days.length < 2) return [];
    return days.map((d) => ({
      date: d.date,
      label: new Date(d.date).toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
      }),
      count: d.total,
    }));
  }, [history, period.range.start, period.range.end]);

  return {
    ...period,
    loading,
    error,
    agg,
    totalDelta,
    completedDelta,
    trendData,
  };
}
