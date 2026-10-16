import { useRegistrationsDashboard } from "../hooks/useRegistrationsDashboard";
import { PageShell } from "../../../components/PageShell";
import { PeriodControls } from "../../../components/PeriodControls";
import { StatCard } from "../../../components/StatCard";
import { TrendChart } from "../../../components/TrendChart";
import { SplitStat } from "../../../components/SplitStat";
import { COLOR } from "../../../config/theme";
import type { ReactNode } from "react";

interface Props {
  metricSwitcher?: ReactNode;
}

export function RegistrationsView({ metricSwitcher }: Props) {
  const d = useRegistrationsDashboard();

  return (
    <PageShell
      title="Новые пользователи"
      periodLabel={d.rangeLabel}
      loading={d.loading}
      error={d.error}
      periodControls={
        <PeriodControls
          extraControl={metricSwitcher}
          mode={d.mode}
          onModeChange={d.changeMode}
          anchorDate={d.anchorDate}
          onAnchorChange={d.setAnchorDate}
          onShift={d.moveAnchor}
          onReset={d.resetToDay}
          customStart={d.customStart}
          customEnd={d.customEnd}
          onCustomStartChange={d.setCustomStart}
          onCustomEndChange={d.setCustomEnd}
        />
      }
    >
      <div className="stat-row">
        <StatCard
          label="Пользователи за период"
          value={d.agg.total.toLocaleString("ru-RU")}
          unit="чел."
          deltaPct={d.totalDelta}
          deltaLabel={d.deltaLabel}
          tint={COLOR.brand}
        />
        <StatCard
          label="Прошли онбординг"
          value={d.agg.onboardingCompleted.toLocaleString("ru-RU")}
          unit="чел."
          deltaPct={d.completedDelta}
          deltaLabel={d.deltaLabel}
          tint={COLOR.brand}
        />
      </div>

      <SplitStat
        title="Онбординг"
        segments={[
          {
            label: "Прошли",
            value: d.agg.onboardingCompleted,
            color: COLOR.brand,
          },
          {
            label: "Не прошли",
            value: d.agg.onboardingNotCompleted,
            color: COLOR.border,
          },
        ]}
      />

      <TrendChart data={d.trendData} metricType="registrations" />
    </PageShell>
  );
}
