import type { CSSProperties } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { TaskAggregate } from "../types";
import { COLOR } from "../../../config/theme";
import { buildTierPalette } from "../../../lib/color";

interface Props {
  byTask: TaskAggregate[];
}

export function TierPieChart({ byTask }: Props) {
  const palette = buildTierPalette(COLOR.brand, byTask.length);
  const data = byTask
    .filter((t) => t.completed > 0)
    .map((t) => ({
      ...t,
      color: palette[byTask.findIndex((x) => x.taskId === t.taskId)],
    }));

  return (
    <div style={styles.panel}>
      <div style={styles.title}>Доля по заданиям</div>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={290}>
          <PieChart>
            <Pie
              data={data}
              dataKey="completed"
              nameKey="name"
              innerRadius={40}
              outerRadius={100}
              paddingAngle={3}
            >
              {data.map((entry) => (
                <Cell key={entry.taskId} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              itemStyle={{ color: COLOR.text }}
              labelStyle={{ color: COLOR.text }}
              contentStyle={{
                background: COLOR.panel,
                border: `1px solid ${COLOR.border}`,
                color: COLOR.text,
                borderRadius: 8,
              }}
              formatter={(value: number, name: string) => [
                `${value} шт.`,
                name,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div style={styles.empty}>За период нет тртанзакций</div>
      )}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  panel: {
    background: COLOR.panel,
    borderRadius: 16,
    padding: 20,
    border: `1px solid ${COLOR.border}`,
    boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
  },
  title: { fontSize: 18, color: COLOR.textMuted, marginBottom: 12 },
  empty: {
    color: COLOR.textFaint,
    fontSize: 14,
    padding: "70px 0",
    textAlign: "center",
  },
};
