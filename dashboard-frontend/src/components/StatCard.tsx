import type { CSSProperties } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { COLOR, FONT_DISPLAY } from "../config/theme";

interface Props {
  label: string;
  value: string;
  unit: string;
  deltaPct: number | null;
  deltaLabel: string;
  tint: string;
}

export function StatCard({
  label,
  value,
  unit,
  deltaPct,
  deltaLabel,
  tint,
}: Props) {
  const isUp = deltaPct !== null && deltaPct >= 0;

  return (
    <div
      style={{
        ...styles.card,
        borderColor: `${tint}33`,
        background: `linear-gradient(180deg, ${tint}14, transparent 60%), ${COLOR.panel}`,
      }}
    >
      <div style={styles.label}>{label}</div>
      <div style={styles.value}>
        {value}
        <span style={styles.unit}>{unit}</span>
      </div>
      {deltaPct !== null && (
        <div
          style={{ ...styles.delta, color: isUp ? COLOR.accent2 : "#ff8a80" }}
        >
          {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {Math.abs(deltaPct)}% {deltaLabel}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  card: {
    borderRadius: 16,
    padding: "28px 20px",
    border: "1px solid #0d3a49",
    boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
  },
  label: {
    fontSize: 21,
    color: COLOR.textMuted,
    marginBottom: 20,
  },

  value: {
    fontFamily: FONT_DISPLAY,
    fontSize: 28,
    fontWeight: 700,
    lineHeight: 1,
    letterSpacing: 2,
  },
  unit: {
    fontSize: 21,
    fontWeight: 500,
    color: COLOR.textMuted,
    marginLeft: 8,
  },
  delta: {
    fontFamily: FONT_DISPLAY,
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 14,
    marginTop: 15,
    fontWeight: 500,
    letterSpacing: 1,
  },
};
