// Осветляет (percent > 0) или затемняет (percent < 0) hex-цвет.
// Используется, чтобы получить палитру оттенков brand-цвета для диаграммы,
// не заводя отдельную произвольную палитру.
export function shade(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const r = Math.min(255, Math.max(0, (num >> 16) + amt));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amt));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function buildTierPalette(brandHex: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) =>
    shade(brandHex, -15 + i * (65 / count)),
  );
}
