import { useState, type CSSProperties } from "react";
import { DepositsView } from "../metrics/deposits/components/DepositsView";
import { RegistrationsView } from "../metrics/registrations/components/RegsView";
import { CreditsView } from "../metrics/task-credits/components/CreditsView";
import { MetricSwitcher } from "./MetricSwitcher";
import { COLOR, FONT_SANS, FONT_DISPLAY } from "../config/theme";

function themeVars(): CSSProperties {
  const vars: Record<string, string> = {
    "--font-sans": FONT_SANS,
    "--font-display": FONT_DISPLAY,
  };
  for (const [key, value] of Object.entries(COLOR)) {
    vars[`--color-${key}`] = value;
  }
  return vars as CSSProperties;
}

const METRIC_VIEWS = [
  { id: "deposits", label: "Транзакции", View: DepositsView },
  { id: "registrations", label: "Новые пользователи", View: RegistrationsView },
  { id: "credits", label: "Обработка заявок", View: CreditsView },
];

export function DashboardShell() {
  const [activeMetric, setActiveMetric] = useState("deposits");
  const ActiveView = METRIC_VIEWS.find((m) => m.id === activeMetric)!.View;

  const metricSwitcher = (
    <MetricSwitcher
      metrics={METRIC_VIEWS.map(({ id, label }) => ({ id, label }))}
      active={activeMetric}
      onChange={setActiveMetric}
    />
  );

  return (
    <div key={activeMetric} className="metric-fade" style={themeVars()}>
      <ActiveView metricSwitcher={metricSwitcher} />
    </div>
  );
}