import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "data");

function filePathFor(metricKey) {
  return path.join(DATA_DIR, `${metricKey}-stats.json`);
}

function ensureFile(metricKey) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
  const filePath = filePathFor(metricKey);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({ dailyStats: {}, overrides: {} }, null, 2));
  }
}

function readAll(metricKey) {
  ensureFile(metricKey);
  return JSON.parse(fs.readFileSync(filePathFor(metricKey), "utf-8"));
}

function writeAll(metricKey, data) {
  fs.writeFileSync(filePathFor(metricKey), JSON.stringify(data, null, 2));
}

// дневные агрегаты (пишет cron) 

export function getDailyStats(metricKey) {
  return readAll(metricKey).dailyStats;
}

export function upsertDailyStats(metricKey, date, data) {
  const all = readAll(metricKey);
  all.dailyStats[date] = data;
  writeAll(metricKey, all);
}

// ручные корректировки (пишут роуты)

export function getOverrides(metricKey) {
  return readAll(metricKey).overrides;
}

export function setOverride(metricKey, rangeKey, itemId, value) {
  const all = readAll(metricKey);
  all.overrides[`${rangeKey}::${itemId}`] = value;
  writeAll(metricKey, all);
}

export function deleteOverride(metricKey, rangeKey, itemId) {
  const all = readAll(metricKey);
  delete all.overrides[`${rangeKey}::${itemId}`];
  writeAll(metricKey, all);
}