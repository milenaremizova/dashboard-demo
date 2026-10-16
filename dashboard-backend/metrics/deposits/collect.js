import { pool } from "../../db.js";
import { upsertDailyStats } from "../../storage.js";
import { loadSumMapping } from "./sumMappingStore.js";

async function queryDepositsForDate(dateISO) {
  const mapping = loadSumMapping();
  const sumCodes = Object.keys(mapping);

  const valuesSql = sumCodes
    .map((code) => `(${mapping[code].taskId}, '${code}')`)
    .join(",\n        ");

  const query = `
    WITH task_map (task_id, sum_code) AS (
      VALUES
        ${valuesSql}
    )
    SELECT
      tm.sum_code,
      COALESCE(c.completed_tasks, 0) AS completed_mocks
    FROM task_map tm
    LEFT JOIN (
      SELECT mock_id, COUNT(*) AS completed_mocks
      FROM user_mock
      WHERE type = 'Mock'
        AND status = 'DONE'
        AND updated_at >= $1
        AND updated_at <= $2
        AND task_id IN (SELECT task_id FROM mock_map)
      GROUP BY mock_id
    ) c ON c.mock_id = tm.mock_id;
  `;

  const result = await pool.query(query, [
    `${dateISO} 00:00:00`,
    `${dateISO} 23:59:59`,
  ]);

  return sumCodes.map((code) => {
    const row = result.rows.find((r) => r.sum_code === code);
    const meta = mapping[code];
    return {
      taskId: code,
      name: meta.name,
      amount: meta.amount,
      completed: row ? Number(row.completed_tasks) : 0,
    };
  });
}

export async function collectForDate(dateISO) {
  const tasks = await queryDepositsForDate(dateISO);
  upsertDailyStats("deposits", dateISO, tasks);
  return tasks;
}
