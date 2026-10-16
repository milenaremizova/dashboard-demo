const DAY = 86400000;

function todayISO() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function addDaysISO(iso, n) {
  return new Date(Date.parse(iso) + n * DAY).toISOString().slice(0, 10);
}


export function shiftForDemo(history) {
  if (process.env.DEMO_MODE !== "true" || history.length === 0) return history;
  const last = history.map((h) => h.date).sort().at(-1);
  const offset = Math.round((Date.parse(todayISO()) - Date.parse(last)) / DAY);
  return history.map((h) => ({ ...h, date: addDaysISO(h.date, offset) }));
}