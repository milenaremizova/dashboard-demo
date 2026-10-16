import { DashboardDayPicker } from "./DateField";
import type { CSSProperties } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import type { PeriodMode } from "../types/period";
import { COLOR } from "../config/theme";
import type { ReactNode } from "react";
import { toISO } from "../lib/dates";

const MODES: { id: PeriodMode; label: string }[] = [
  { id: "day", label: "День" },
  { id: "week", label: "Неделя" },
  { id: "month", label: "Месяц" },
  { id: "range", label: "Диапазон" },
];

interface Props {
  mode: PeriodMode;
  onModeChange: (mode: PeriodMode) => void;
  anchorDate: Date;
  onAnchorChange: (date: Date) => void;
  onShift: (dir: 1 | -1) => void;
  onReset: () => void;
  customStart: string;
  customEnd: string;
  onCustomStartChange: (v: string) => void;
  onCustomEndChange: (v: string) => void;
  extraControl?: ReactNode;
  availableModes?: PeriodMode[];
}

export function PeriodControls({
  mode,
  onModeChange,
  anchorDate,
  onAnchorChange,
  onShift,
  onReset,
  customStart,
  customEnd,
  onCustomStartChange,
  onCustomEndChange,
  extraControl,
  availableModes,
}: Props) {
  const visibleModes = availableModes
    ? MODES.filter((m) => availableModes.includes(m.id))
    : MODES;
  return (
    <div className="period-controls" style={styles.controls}>
      <div className="period-top-row" style={styles.topRow}>
        {extraControl}
        <div className="mode-tabs-row" style={styles.modeTabs}>
          {visibleModes.map((m) => (
            <button
              key={m.id}
              onClick={() => onModeChange(m.id)}
              className={`mode-tab${mode === m.id ? " active" : ""}`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {mode !== "range" ? (
        <div style={styles.navRow} className="period-nav-row">
          <button className="nav-btn" onClick={() => onShift(-1)}>
            <ChevronLeft size={16} />
          </button>
          <DashboardDayPicker value={anchorDate} onChange={onAnchorChange} />
          <button className="nav-btn" onClick={() => onShift(1)}>
            <ChevronRight size={16} />
          </button>
          <button
            className="nav-btn"
            onClick={onReset}
            title="Вернуться к сегодня"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      ) : (
        <div style={styles.navRow} className="period-nav-row">
          <DashboardDayPicker
            value={new Date(customStart)}
            onChange={(date) => onCustomStartChange(toISO(date))}
          />
          <span style={{ color: COLOR.textFaint }}>—</span>
          <DashboardDayPicker
            value={new Date(customEnd)}
            onChange={(date) => onCustomEndChange(toISO(date))}
          />
          <button
            className="nav-btn"
            onClick={onReset}
            title="Сбросить диапазон"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  controls: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 20,
  },
  modeTabs: {
    display: "flex",
    gap: 4,
    background: COLOR.periodControl,
    padding: 4,
    borderRadius: 10,
    border: `1px solid ${COLOR.border}`,
  },
  navRow: { display: "flex", alignItems: "center", gap: 6 },
  dateInput: {
    background: COLOR.periodControl,
    border: `1px solid ${COLOR.border}`,
    color: COLOR.text,
    borderRadius: 8,
    padding: "5px 8px",
    fontFamily: "inherit",
    fontSize: 16,
  },
  topRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
};
