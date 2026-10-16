import { useDepositsDashboard } from "../hooks/useDepositsDashboard";
import { METRICS } from "../config/metrics";
import { PageShell } from "../../../components/PageShell";
import { PeriodControls } from "../../../components/PeriodControls";
import { StatCard } from "../../../components/StatCard";
import { TrendChart } from "../../../components/TrendChart";
import { TierPieChart } from "./TierPieChart";
import { TaskList } from "./TaskList";
import { TierSetting } from "./TiersSettings";
import { Modal } from "../../../components/Modal";
import { COLOR } from "../../../config/theme";
import { useState, type ReactNode } from "react";
import { Settings } from "lucide-react";

interface Props {
  metricSwitcher?: ReactNode;
}

export function DepositsView({ metricSwitcher }: Props) {
  const d = useDepositsDashboard();
  const metric = METRICS[0];
  const [tiersOpen, setTiersOpen] = useState(false);

  return (
    <>
    <PageShell
      title="Транзакции"
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
      <div className="dashboard-body">
        <div>
          <div className="stat-row">
            <StatCard
              label={`${metric.label} за период`}
              value={d.agg.totalCount.toLocaleString("ru-RU")}
              unit={metric.unit}
              deltaPct={d.countDelta}
              deltaLabel={d.deltaLabel}
              tint={COLOR.brand}
            />
            <StatCard
              label="Сумма транзакций"
              value={d.agg.totalAmount.toLocaleString("ru-RU")}
              unit="₽"
              deltaPct={d.amountDelta}
              deltaLabel={d.deltaLabel}
              tint={COLOR.brand}
            />
          </div>

          <div className="charts-row">
            <TrendChart data={d.trendData} metricType="deposits" />
            <TierPieChart byTask={d.agg.byTask} />
          </div>
        </div>

        <TaskList
          byTask={d.agg.byTask}
          onEdit={d.editTaskCount}
          onReset={d.resetTaskOverride}
          headerAction={
            <button className="nav-btn" onClick={() => setTiersOpen(true)} title="Настройка еженедельных заданий">
              <Settings size={16} />
            </button>
          }
        />
      </div>
    </PageShell>
    {tiersOpen && (
      <Modal title="Настройка заданий" onClose={() => setTiersOpen(false)}>
        <TierSetting />
      </Modal>
    )}
    </>
  );
}
