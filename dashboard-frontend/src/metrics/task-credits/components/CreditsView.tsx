import { useTaskCreditsDashboard } from "../hooks/useTaskCreditsDashboard";
import { PageShell } from "../../../components/PageShell";
import { PeriodControls } from "../../../components/PeriodControls";
import { CreditsTable } from "./CreditsTable";
import { CreditsChart } from "./CreditsChart";
import type { ReactNode } from "react";

interface Props {
  metricSwitcher?: ReactNode;
}

export function CreditsView({ metricSwitcher }: Props) {
  const d = useTaskCreditsDashboard();

  return (
    <PageShell
      title="Обработка заявок"
      periodLabel={d.rangeLabel}
      loading={d.loading}
      error={d.error}
      periodControls={
        <PeriodControls
          extraControl={metricSwitcher}
          availableModes={["week", "month", "range"]}
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
      <CreditsTable rows={d.weeklyRows} />
      <div style={{ height: 16 }} />
      <CreditsChart
        data={d.dailyChartData}
        games={d.weeklyRows[0]?.byGame ?? []}
      />
    </PageShell>
  );
}
