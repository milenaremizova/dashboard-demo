import { useEffect, useMemo, useState } from "react";
import type { TaskCreditsDayRecord } from "../types";
import type { CreditsChartPoint } from "../components/CreditsChart";
import { usePeriodSelector } from "../../../hooks/usePeriodSelector";
import { aggregateRange, buildWeeklyRows } from "../lib/aggregate";
import { getTaskCreditsHistory } from "../data/provider";

export function useTaskCreditsDashboard() {
  const period = usePeriodSelector("task-credits-dashboard:view-state", "week");

  const [history, setHistory] = useState<TaskCreditsDayRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getTaskCreditsHistory(period.range)
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

  // для таблицы разбивка выбранного периода на недельные строки
  const weeklyRows = useMemo(
    () => buildWeeklyRows(history, period.range.start, period.range.end),
    [history, period.range.start, period.range.end],
  );

  // для графика по каждому дню отдельно, детализация при наведении на столбцы статы
  const dailyChartData = useMemo(() => {
    const days = history.filter(
      (d) => d.date >= period.range.start && d.date <= period.range.end,
    );
    return days.map((d): CreditsChartPoint => {
      const agg = aggregateRange([d], d.date, d.date);
      const stat: CreditsChartPoint = {
        date: d.date,
        label: new Date(d.date).toLocaleDateString("ru-RU", {
          day: "2-digit",
          month: "2-digit",
        }),
        percentManual: agg.totalPercentManual,
      };

      for (const g of d.games) {
        stat[`${g.gameId}_automatic`] = g.automatic;
        stat[`${g.gameId}_manual`] = g.manual;
      }

      return stat;
    });
  }, [history, period.range.start, period.range.end]);

  return { ...period, loading, error, weeklyRows, dailyChartData };
}
