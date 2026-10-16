import { getDailyStats } from "../storage.js";
import { COLLECTORS } from "./collectors.js";

function isoDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export async function catchUpMissingDays(maxLookbackDays = 30) {
  for (const { key, collect } of COLLECTORS) {
    const dailyStats = getDailyStats(key);
    const missing = [];

    for (let i = maxLookbackDays; i >= 1; i--) {
      const date = isoDaysAgo(i);
      if (!dailyStats[date]) missing.push(date);
    }

    if (missing.length === 0) {
      console.log(`[catchup] ${key}: пропущенных дней нет`);
      continue;
    }

    console.log(`[catchup] ${key}: дособираю ${missing.length} дней: ${missing.join(", ")}`);
    for (const date of missing) {
      try {
        await collect(date);
      } catch (e) {
        console.error(`[catchup] ${key}: ошибка сбора за ${date}:`, e.message);
      }
    }
  }
}