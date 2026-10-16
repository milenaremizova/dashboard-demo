import type { CSSProperties } from "react";
import {
  Bar,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { COLOR } from "../../../config/theme";
import { buildTierPalette } from "../../../lib/color";

interface GameType {
  gameId: string;
  name: string;
}

export interface CreditsChartPoint {
  date: string;
  label: string;
  percentManual: number;
  [key: string]: string | number;
}

interface Props {
  data: CreditsChartPoint[];
  games: GameType[];
}

export function CreditsChart({ data, games }: Props) {
  const automaticColors = buildTierPalette(
    COLOR.brand,
    Math.max(games.length, 1),
  );
  const manualColors = buildTierPalette(
    COLOR.accent2,
    Math.max(games.length, 1),
  );

  console.log("games", games, "data", data);
  return (
    <div style={styles.panel}>
      <div style={styles.title}>По дням</div>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={data}>
            <XAxis
              dataKey="label"
              stroke={COLOR.textFaint}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="count"
              stroke={COLOR.textFaint}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="percent"
              orientation="right"
              stroke={COLOR.textFaint}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              unit="%"
            />
            <Tooltip
              itemStyle={{ color: COLOR.text }}
              labelStyle={{ color: COLOR.text }}
              contentStyle={{
                background: COLOR.panel,
                border: `1px solid ${COLOR.border}`,
                borderRadius: 8,
              }}
            />
            {games.map((g, i) => (
              <Bar
                key={`${g.gameId}-auto`}
                yAxisId="count"
                dataKey={`${g.gameId}_automatic`}
                name={`${g.gameId} автоматически`}
                fill={automaticColors[i]}
                radius={[4, 4, 0, 0]}
              />
            ))}
            {games.map((g, i) => (
              <Bar
                key={`${g.gameId}-manual`}
                yAxisId="count"
                dataKey={`${g.gameId}_manual`}
                name={`${g.gameId} вручную`}
                fill={manualColors[i]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      ) : (
        <div style={styles.empty}>Нет данных за выбранный период</div>
      )}
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
  empty: {
    color: COLOR.textFaint,
    fontSize: 14,
    padding: "50px 0",
    textAlign: "center",
  },
};
