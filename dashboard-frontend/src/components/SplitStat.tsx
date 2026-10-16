import type { CSSProperties } from "react";
import { COLOR } from "../config/theme";

interface Segment {
  label: string;
  value: number;
  color: string;
}

interface Props {
  title: string;
  segments: Segment[];
}

export function SplitStat({ title, segments }: Props) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);

  return (
    <div style={styles.panel}>
      <div style={styles.title}>{title}</div>

      <div style={styles.bar}>
        {segments.map((seg) => {
          const pct = total > 0 ? (seg.value / total) * 100 : 0;
          return (
            <div
              key={seg.label}
              style={{
                ...styles.segment,
                width: `${pct}%`,
                background: seg.color,
              }}
            />
          );
        })}
      </div>

      <div style={styles.legend}>
        {segments.map((seg) => {
          const pct =
            total > 0 ? Math.round((seg.value / total) * 1000) / 10 : 0;
          return (
            <div key={seg.label} style={styles.legendItem}>
              <span style={{ ...styles.dot, background: seg.color }} />
              <span style={styles.legendLabel}>{seg.label}</span>
              <span style={styles.legendValue}>
                {seg.value.toLocaleString("ru-RU")}{" "}
                <span style={styles.legendPct}>({pct}%)</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  panel: {
    background: COLOR.panel,
    boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    border: `1px solid ${COLOR.border}`,
  },
  title: {
    fontSize: 14,
    color: COLOR.textMuted,
    marginBottom: 14,
  },

  bar: {
    display: "flex",
    width: "100%",
    height: 10,
    borderRadius: 6,
    overflow: "hidden",
    background: COLOR.border,
    marginBottom: 16,
  },

  segment: {
    height: "100%",
    transition: "width 0.3s ease",
  },

  legend: {
    display: "flex",
    flexWrap: "wrap",
    gap: 20,
  },

  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 14,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    flexShrink: 0,
  },

  legendLabel: {
    color: COLOR.text,
  },

  legendValue: {
    color: COLOR.text,
    fontWeight: 600,
  },

  legendPct: {
    color: COLOR.textFaint,
    fontWeight: 400,
  },
};
