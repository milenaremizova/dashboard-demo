import cron from "node-cron";
import { COLLECTORS } from "./collectors.js";
import { backupNow } from "./backup.js";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayISO() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

async function collectAll(dateISO, label) {
  for (const { key, collect } of COLLECTORS) {
    try {
      await collect(dateISO);
      console.log(`[cron] ${key}: собрано за ${dateISO} (${label})`);
    } catch (e) {
      console.error(`[cron] ${key}: ошибка сбора за ${dateISO} (${label}):`, e.message);
    }
  }
}

export function startCron() {
  // Ночью — финализируем вчерашний (уже полностью закрытый) день + бэкап.
  cron.schedule("10 0 * * *", async () => {
    await collectAll(yesterdayISO(), "финал");
    backupNow();
  });

  // Каждые 30 минут в течение дня — обновляем сегодняшний, ещё не
  // закрытый день, чтобы на дашборде были живые цифры за "сегодня",
  // а не только вчера и раньше.
  cron.schedule("*/30 * * * *", async () => {
    await collectAll(todayISO(), "промежуточно");
  });
}