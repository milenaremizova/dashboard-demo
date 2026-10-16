import type { CSSProperties } from "react";
import type { WeekRow } from "../lib/aggregate";
import { COLOR } from "../../../config/theme";
import { HIGH_MANUAL_THRESHOLD } from "../lib/aggregate";

interface Props {
  rows: WeekRow[];
}

export function CreditsTable({ rows }: Props) {
  const games = rows[0]?.byGame ?? [];

  return (
    <div style={styles.panel}>
      <div style={styles.title}>Динамика по квестам</div>

      <div style={styles.scrollArea}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{ ...styles.th, ...styles.thSticky }} rowSpan={2}>
                Неделя
              </th>
              <th style={styles.th} colSpan={games.length}>
                <span style={{ ...styles.dot, background: COLOR.brand }} />
                Выполнено
              </th>
              <th style={styles.th} colSpan={games.length}>
                <span style={{ ...styles.dot, background: COLOR.accent2 }} />
                Кол-во ручных зачислений
              </th>
              <th style={styles.th} colSpan={games.length + 1}>
                Процент
              </th>
            </tr>
            <tr>
              {games.map((g) => (
                <th key={`auto-${g.gameId}`} style={styles.thSub}>
                  {g.name}
                </th>
              ))}
              {games.map((g) => (
                <th key={`man-${g.gameId}`} style={styles.thSub}>
                  {g.name}
                </th>
              ))}
              {games.map((g) => (
                <th key={`pct-${g.gameId}`} style={styles.thSub}>
                  {g.name}
                </th>
              ))}
              <th style={styles.thSub}>Всего</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.weekStart} className="credits-row">
                <td style={{ ...styles.td, ...styles.tdSticky }}>
                  {row.weekLabel}
                </td>
                {row.byGame.map((g) => (
                  <td key={`auto-${g.gameId}`} style={styles.td}>
                    {g.automatic}
                  </td>
                ))}
                {row.byGame.map((g) => (
                  <td key={`man-${g.gameId}`} style={styles.td}>
                    {g.manual}
                  </td>
                ))}
                {row.byGame.map((g) => (
                  <td
                    key={`pct-${g.gameId}`}
                    style={styles.td}
                    className={
                      g.percentManual > HIGH_MANUAL_THRESHOLD
                        ? "percent-high"
                        : "percent-normal"
                    }
                  >
                    {g.percentManual.toFixed(2)} %
                  </td>
                ))}
                <td
                  style={{ ...styles.td, fontWeight: 600 }}
                  className={
                    row.totalPercentManual > HIGH_MANUAL_THRESHOLD
                      ? "percent-high"
                      : "percent-normal"
                  }
                >
                  {row.totalPercentManual.toFixed(2)} %
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
    border: `1px solid ${COLOR.border}`,
  },
  title: { fontSize: 14, color: COLOR.textMuted, marginBottom: 14 },

  scrollArea: { maxHeight: 320, overflowY: "auto", overflowX: "auto" },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 16,
    fontVariantNumeric: "tabular-nums",
  },

  th: {
    position: "sticky",
    top: 0,
    background: COLOR.shell,
    color: COLOR.textMuted,
    padding: "10px 12px",
    textAlign: "center",
    fontWeight: 600,
    borderBottom: `1px solid ${COLOR.border}`,
    whiteSpace: "nowrap",
  },
  thSub: {
    position: "sticky",
    top: 33,
    background: COLOR.shell,
    color: COLOR.textFaint,
    padding: "8px 12px",
    textAlign: "center",
    fontWeight: 500,
    fontSize: 12,
    borderBottom: `1px solid ${COLOR.border}`,
    whiteSpace: "nowrap",
  },
  thSticky: { left: 0, zIndex: 2, textAlign: "left" },
  dot: {
    display: "inline-block",
    width: 12,
    height: 12,
    borderRadius: "50%",
    marginRight: 10,
    verticalAlign: "middle",
    boxShadow: "0 0 10px currentColor",
  },

  td: {
    padding: "10px 12px",
    textAlign: "center",
    color: COLOR.text,
    borderBottom: `1px solid ${COLOR.border}`,
    whiteSpace: "nowrap",
  },
  tdSticky: {
    position: "sticky",
    left: 0,
    background: COLOR.panel,
    zIndex: 1,
    textAlign: "left",
    fontWeight: 600,
  },
};
