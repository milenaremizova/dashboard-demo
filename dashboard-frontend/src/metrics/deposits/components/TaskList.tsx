import { useState, type CSSProperties, type ReactNode } from "react";
import { Check, Pencil, X } from "lucide-react";
import type { TaskAggregate } from "../types";
import { COLOR } from "../../../config/theme";
import { buildTierPalette } from "../../../lib/color";

interface Props {
  byTask: TaskAggregate[];
  onEdit: (taskId: string, value: number) => void;
  onReset: (taskId: string) => void;
  headerAction?: ReactNode;
}

export function TaskList({ byTask, onEdit, onReset, headerAction }: Props) {
  const [editingtaskId, setEditingtaskId] = useState<string | null>(null);
  const [draftValue, setDraftValue] = useState("");
  const palette = buildTierPalette(COLOR.brand, byTask.length);

  function startEdit(task: TaskAggregate) {
    setEditingtaskId(task.taskId);
    setDraftValue(String(task.completed));
  }

  function save(taskId: string) {
    const value = Number(draftValue);
    if (Number.isNaN(value) || value < 0) return;
    onEdit(taskId, value);
    setEditingtaskId(null);
  }

  return (
    <div style={styles.panel}>
      <div style={styles.titleRow}>
        <div style={styles.title}>Задания</div>
        {headerAction}
      </div>
      <div style={styles.list}>
        {byTask
          .filter((t) => t.completed > 0 || t.isOverridden)
          .map((t) => {
            const paletteIndex = byTask.findIndex((b) => b.taskId === t.taskId);
            const isEditing = editingtaskId === t.taskId;
            return (
              <div key={t.taskId} style={styles.row}>
                <span
                  style={{ ...styles.dot, background: palette[paletteIndex] }}
                />
                <div style={styles.name}>
                  {t.name}
                  {t.isOverridden && <span style={styles.badge}>ручное</span>}
                </div>
                <span style={styles.amount}>
                  {t.amount.toLocaleString("ru-RU")} ₽
                </span>

                {!isEditing ? (
                  <div style={styles.countBlock}>
                    <span style={styles.count}>{t.completed}</span>
                    <button
                      style={styles.iconBtn}
                      onClick={() => startEdit(t)}
                      title="Скорректировать"
                    >
                      <Pencil size={14} />
                    </button>
                    {t.isOverridden && (
                      <button
                        style={styles.iconBtnMuted}
                        onClick={() => onReset(t.taskId)}
                        title="Сбросить к исходному"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ) : (
                  <div style={styles.editBlock}>
                    <input
                      type="number"
                      value={draftValue}
                      onChange={(e) => setDraftValue(e.target.value)}
                      style={styles.editInput}
                      autoFocus
                    />
                    <button
                      style={styles.iconBtnAccent}
                      onClick={() => save(t.taskId)}
                    >
                      <Check size={14} />
                    </button>
                    <button
                      style={styles.iconBtnMuted}
                      onClick={() => setEditingtaskId(null)}
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
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
    borderRadius: 16,
    padding: 20,
    border: `1px solid ${COLOR.border}`,
    boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
  },
  title: {
    fontSize: 21,
    color: COLOR.textMuted,
  },

  titleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  list: { display: "flex", flexDirection: "column", gap: 4, fontVariantNumeric: "tabular-nums", },
  row: {
    display: "grid",
    gridTemplateColumns: "10px 1fr auto auto",
    gap: 18,
    alignItems: "center",
    fontSize: 16,
    padding: "18px 4px",
    borderBottom: `1px solid ${COLOR.border}`,
  },
  dot: { width: 10, height: 10, borderRadius: "50%" },
  name: { color: COLOR.text, display: "flex", alignItems: "center", gap: 8 },
  badge: {
    fontSize: 10,
    background: `${COLOR.accent2}22`,
    color: COLOR.accent2,
    padding: "2px 7px",
    borderRadius: 20,
  },
  amount: { color: COLOR.textFaint, fontSize: 13, whiteSpace: "nowrap" },
  countBlock: { display: "flex", alignItems: "center", gap: 6 },
  count: { fontWeight: 700, minWidth: 26, textAlign: "right" },
  editBlock: { display: "flex", alignItems: "center", gap: 6 },
  editInput: {
    background: COLOR.bg,
    border: `1px solid ${COLOR.brand}`,
    color: COLOR.text,
    borderRadius: 6,
    padding: "4px 8px",
    fontSize: 14,
    width: 70,
    fontFamily: "inherit",
  },
  iconBtn: {
    background: "transparent",
    border: "none",
    color: COLOR.textFaint,
    cursor: "pointer",
    padding: 4,
    display: "flex",
  },
  iconBtnMuted: {
    background: "transparent",
    border: "none",
    color: "#ff8a80",
    cursor: "pointer",
    padding: 4,
    display: "flex",
  },
  iconBtnAccent: {
    background: COLOR.brand,
    border: "none",
    color: COLOR.bg,
    cursor: "pointer",
    padding: 4,
    borderRadius: 6,
    display: "flex",
  },
};
