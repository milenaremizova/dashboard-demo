import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_DIR = path.join(__dirname, "../data");
const OUTPUT_DIR = path.join(__dirname, "../data-demo");

const SCALE = 0.6;
const JITTER = 0.1;

function scaledValue(value) {
  if (typeof value !== "number") return value;
  const factor = SCALE + (Math.random() * 2 - 1) * JITTER;
  return Math.max(0, Math.round(value * factor));
}

const TIER_RENAME = {
  sum_5000_shop: { name: "Открытие портала", amount: 5 },
  sum_1000: { name: "Первый шаг", amount: 10 },
  sum_2500: { name: "Разведка территории", amount: 25 },
  sum_5000: { name: "Сбор ресурсов", amount: 50 },
  sum_10000: { name: "Прокачка героя", amount: 100 },
  sum_20000: { name: "Штурм крепости", amount: 250 },
  sum_50000: { name: "Финальный рейд", amount: 500 },
};

function anonymizeDeposits(raw) {
  const out = { dailyStats: {}, overrides: {} };
  for (const [date, tasks] of Object.entries(raw.dailyStats)) {
    out.dailyStats[date] = tasks.map((t) => {
      const renamed = TIER_RENAME[t.taskId];
      return {
        taskId: t.taskId,
        name: renamed?.name ?? t.name,
        amount: renamed?.amount ?? t.amount,
        completed: scaledValue(t.completed),
      };
    });
  }
  return out;
}

function anonymizeRegistrations(raw) {
  const out = { dailyStats: {}, overrides: {} };
  for (const [date, stats] of Object.entries(raw.dailyStats)) {
    const total = scaledValue(stats.total);
    const onboardingCompleted = Math.min(total, scaledValue(stats.onboardingCompleted));
    out.dailyStats[date] = {
      total,
      onboardingCompleted,
      onboardingNotCompleted: total - onboardingCompleted,
    };
  }
  return out;
}

function anonymizeTaskCredits(raw) {
  const out = { dailyStats: {}, overrides: {} };
  for (const [date, games] of Object.entries(raw.dailyStats)) {
    out.dailyStats[date] = games.map((g) => ({
      gameId: g.gameId,
      name: g.name,
      automatic: scaledValue(g.automatic),
      manual: scaledValue(g.manual),
    }));
  }
  return out;
}

const HANDLERS = {
  "deposits-stats.json": anonymizeDeposits,
  "registrations-stats.json": anonymizeRegistrations,
  "task-credits-stats.json": anonymizeTaskCredits,
};

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

for (const [fileName, handler] of Object.entries(HANDLERS)) {
  const sourcePath = path.join(SOURCE_DIR, fileName);
  if (!fs.existsSync(sourcePath)) {
    console.log(`пропускаю ${fileName} - файла нет`);
    continue;
  }
  const raw = JSON.parse(fs.readFileSync(sourcePath, "utf-8"));
  const anonymized = handler(raw);
  fs.writeFileSync(path.join(OUTPUT_DIR, fileName), JSON.stringify(anonymized, null, 2));
  console.log(`готово: ${fileName}`);
}