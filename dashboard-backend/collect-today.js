import { COLLECTORS } from "./cron/collectors.js";

const today = new Date().toISOString().slice(0, 10);

for (const { key, collect } of COLLECTORS) {
  const result = await collect(today);
  console.log(`${key}:`, result);
}