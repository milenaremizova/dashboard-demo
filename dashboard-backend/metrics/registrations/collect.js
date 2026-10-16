import { pool } from "../../db.js";
import { upsertDailyStats } from "../../storage.js";

async function queryRegistrationsForDate(dateISO) {
  const query = `
    SELECT
      COUNT(*) AS total,
      COUNT(*) FILTER (WHERE is_mocks_onboarding_completed = true) AS onboarding_completed,
      COUNT(*) FILTER (WHERE is_mocks_onboarding_completed = false) AS onboarding_not_completed
    FROM mock.mock
    WHERE created_at >= $1
      AND created_at <= $2
  `;

  const result = await pool.query(query, [`${dateISO} 00:00:00`, `${dateISO} 23:59:59`]);
  const row = result.rows[0];

  return {
    total: Number(row.total),
    onboardingCompleted: Number(row.onboarding_completed),
    onboardingNotCompleted: Number(row.onboarding_not_completed),
  };
}

export async function collectForDate(dateISO) {
  const stats = await queryRegistrationsForDate(dateISO);
  upsertDailyStats("registrations", dateISO, stats);
  return stats;
}