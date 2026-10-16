import { pool } from "../../db.js";
import { upsertDailyStats } from "../../storage.js";
import { GAMES } from "./config/games.js";

async function queryGameForDate(type, dataISO) {
  const query = `
    SELECT
      COUNT(*) FILTER (WHERE progress = 100) AS automatic,
      COUNT(*) FILTER (WHERE progress < 100) AS manual
    FROM user_mock
    WHERE type = $1
      AND status = 'DONE'
      AND updated_at >= $2
      AND updated_at <= $3
    `;

    const result = await pool.query(query, [type, `${dataISO} 00:00:00`, `${dataISO} 23:59:59`]);
    const row = result.rows[0];

    return {
        automatic: Number(row.automatic),
        manual: Number(row.manual),
    };
}

async function queryDateAllGames(dataISO) {
    const games = [];
    for (const g of GAMES) {
        const { automatic, manual} = await queryGameForDate(g.type, dataISO);
        games.push({gameId: g.gameId, name: g.name, automatic, manual});
    }
    return games;
}

export async function collectForDate(dataISO) {
    const games = await queryDateAllGames(dataISO);
    upsertDailyStats("task-credits", dataISO, games);
    return games;
}