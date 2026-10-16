// Обёртка над localStorage. Используется браузером — независимо от того,
// есть бэкенд или нет — usePeriodSelector хранит тут выбранный период,
// а провайдеры метрик (в моковом режиме, VITE_USE_MOCK_DATA=true) —
// сгенерированные моки и корректировки, чтобы не пропадали при перезагрузке.

export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function saveJSON<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    
  }
}