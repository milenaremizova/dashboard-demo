import { COLLECTORS } from "./collectors.js";

function isoDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

const metricKey = process.argv[2];
const days = Number(process.argv[3] ?? 30);

const targets = metricKey === "all"
  ? COLLECTORS
  : COLLECTORS.filter((m) => m.key === metricKey);

if (targets.length === 0) {
  console.error(`Неизвестная метрика "${metricKey}". Доступные: ${COLLECTORS.map((m) => m.key).join(", ")}, all`);
  process.exit(1);
}

for (const { key, collect } of targets) {
  console.log(`— ${key} —`);
  for (let i = days; i >= 1; i--) {
    const date = isoDaysAgo(i);
    const result = await collect(date);
    console.log(`${date}:`, result);
  }
}