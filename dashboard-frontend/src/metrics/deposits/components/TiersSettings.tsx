import { useEffect, useState, type CSSProperties } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import type { TierMapping } from "../types";
import { fetchTierMapping, saveTierMapping } from "../data/api";
import { COLOR } from "../../../config/theme";

interface Row {
    sumCode: string;
    taskId: string;
    name: string;
    amount: string;
}

function mappingToRows(mapping: TierMapping): Row[] {
    return Object.entries(mapping).map(([sumCode, t]) => ({
        sumCode,
        taskId: String(t.taskId),
        name: t.name,
        amount: String(t.amount),
    }));
}

export function TierSetting() {
    const [rows, setRows] = useState<Row[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [savedAt, setSavedAt] = useState<Date | null>(null);

    useEffect(() => {
        fetchTierMapping()
        .then((mapping) => setRows(mappingToRows(mapping)))
        .catch((e: Error) => setError(e.message))
        .finally(() => setLoading(false));
    }, []);

    function updateRow(index: number, field: keyof Row, value: string) {
        setRows((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
    }

    function addRow() {
        setRows((prev) => [...prev, { sumCode: "", taskId: "", name: "", amount: "" }]);
    }

    function removeRow(index: number) {
        setRows((prev) => prev.filter((_, i) => i !== index));
    }

    async function handleSave() {
        setError(null);

        const codes = new Set<string>();
        for (const r of rows) {
            if (!r.sumCode.trim()) return setError("У всех заданий должен быть код");
            if (codes.has(r.sumCode)) return setError(`Код ${r.sumCode} дублируется`);
            codes.add(r.sumCode);
            if (!r.name.trim()) return setError(`У этого задания ${r.sumCode} не заполнено название`);
            if (!Number.isFinite(Number(r.taskId))) return setError(`У задания ${r.sumCode} неверный ID`);
            if (!Number.isFinite(Number(r.amount))) return setError(`У задания ${r.sumCode} неверная сумма`);
        };
    
    const mapping: TierMapping = {};
    for (const r of rows) {
        mapping[r.sumCode] = { taskId: Number(r.taskId), name: r.name, amount: Number(r.amount) };
    }
    
    setSaving(true);
    try {
      await saveTierMapping(mapping);
      setSavedAt(new Date());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  } // ← закрывает handleSave

  if (loading) return <div>Загрузка…</div>; 
  return (
    <div style={styles.panel}>
        <div style={styles.title}>Таблица изменения заданий</div>
        <div style={styles.hint}>
            <p>Изменение заданий производится каждый вторник. <span style={styles.hintWarning}>Code - неизменяемое поле, можно только добавить новый, если на текущей неделе больше заданий.</span></p>
            <p>TaskId, название, сумму - изменяемые поля, корректируются под актуальную неделю. После сохранения обновленная статистика будет собрана после ближайшей работы крон-скрипта (срабатывает каждые 30 мин.)</p>
        </div>

        {error && <div style={styles.errorBanner}>{error}</div>}
        {savedAt && !error && <div style={styles.successBanner}>Сохранено {savedAt.toLocaleTimeString("ru-RU")}</div>}

        <div style={styles.tableWrap}>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Code</th>
                        <th style={styles.th}>taskId</th>
                        <th style={styles.th}>Название</th>
                        <th style={styles.th}>Сумма</th>
                        <th style={styles.th}></th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r, i) => (
                        <tr key={i}>
                            <td style={styles.td}>
                                <input style={styles.input} value={r.sumCode} onChange={(e) => updateRow(i, "sumCode", e.target.value)}/>
                            </td>
                            <td style={styles.td}>
                                <input style={styles.input} value={r.taskId} onChange={(e) => updateRow(i, "taskId", e.target.value)}/>
                            </td>
                            <td style={styles.td}>
                                <input style={styles.input} value={r.name} onChange={(e) => updateRow(i, "name", e.target.value)}/>
                            </td>
                            <td style={styles.td}>
                                <input style={styles.input} value={r.amount} onChange={(e) => updateRow(i, "amount", e.target.value)}/>
                            </td>
                            <td style={styles.td}>
                                <button style={styles.iconBtn} onClick={() => removeRow(i)} title="Удалить задание">
                                    <Trash2 size={16}/>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div style={styles.actions}>
            <button style={styles.addBtn} onClick={addRow}>
              <Plus size={16}/> Добавить задание
            </button>
            <button style={styles.saveBtn} onClick={handleSave} disabled={saving}>
                <Save /> {saving ? "Сохраняю..." : "Сохранить"}
            </button>
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
    },
    title: {
        fontSize: 21,
        fontWeight: 600,
        color: COLOR.text,
        marginBottom: 20,
    },
    hint: {
        fontSize: 16,
        color: COLOR.text,
        marginBottom: 30,
    },
    hintWarning: {
        color: COLOR.accent2
    },

    loading: {
        color: COLOR.textFaint,
        padding: 40,
        textAlign: "center",
    },
    errorBanner: {
        background: "#ff8a8022",
        border: "1px solid #ff8a8055",
        color: "#ff8a80",
        borderRadius: 10,
        padding: "10 px 14px",
        fontSize: 13,
        marginBottom: 16,
    },
    successBanner: {
        background: `${COLOR.brand}22`,
        border: `1px solid ${COLOR.brand}55`,
        color: COLOR.brand,
        borderRadius: 10,
        padding: "10px 14px",
        fontSize: 13,
        marginBottom: 16,
    },
    tableWrap: {
        overflowX: "auto",
        marginBottom: 25, 
    },
    table: {
        width: "100%",
        background: COLOR.bg,
        borderCollapse: "collapse",
        border: `1px solid ${COLOR.brand}`,
        fontSize: 16,
    },
    th: {
        textAlign: "left",
        padding: "6px 8px",
        color: COLOR.textMuted,
        borderBottom: `1px solid ${COLOR.brand}`,
    },
    td: {
        padding: "6px 8px",
        borderBottom: `1px solid ${COLOR.brand}`,
    },
    input: {
        width: "100%",
        background: COLOR.bg,
        border: `1px solid ${COLOR.border}`,
        color: COLOR.text,
        borderRadius: 6,
        padding: "10px 8px",
        fontFamily: "inherit",
        fontSize: 14,
    },
    iconBtn: {
        background: "transparent",
        border: "none",
        color: "#ff8a80",
        cursor: "pointer",
        padding: 4,
        display: "flex",
    },
    actions: {
        display: "flex",
        gap: 20,
    },
    addBtn: {
        display: "flex", 
        alignItems: "center",
        gap: 8,
        background: "transparent",
        border: `1px solid ${COLOR.border}`,
        color: COLOR.text,
        borderRadius: 8,
        padding: "8px, 14px",
        cursor: "pointer",
        fontFamily: "inherit",
        fontSize: 16,
    },
    saveBtn: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: COLOR.brand,
        border: "none",
        color: COLOR.bg,
        borderRadius: 8,
        padding: "8px 14px",
        cursor: "pointer",
        fontFamily: "inherit",
        fontSize: 16,
        fontWeight: 600,
    }
}
 
