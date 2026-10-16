import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCE = path.join(__dirname, "../data/deposit-stats.json");
const BACKUP_DIR = path.join(__dirname, "../data/backups");
const KEEP_LAST = 30; // храним последние 30 снэпшотов статы

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function backupNow() {
  if (!fs.existsSync(SOURCE)) return; // если нечего бэкапить

  if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });

  const dest = path.join(BACKUP_DIR, `deposit-stats-${todayISO()}.json`);
  fs.copyFileSync(SOURCE, dest);

  // очищение старых снэпшотов
  const files = fs
    .readdirSync(BACKUP_DIR)
    .filter((f) => f.startsWith("deposit-stats-"))
    .sort(); // имена с датой сортируются как надо текстово

  if (files.length > KEEP_LAST) {
    const toDelete = files.slice(0, files.length - KEEP_LAST);
    for (const f of toDelete) fs.unlinkSync(path.join(BACKUP_DIR, f));
  }
}