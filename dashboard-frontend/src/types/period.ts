// Один тир депозита (задание в CS2, за которое засчитывается депозит).
export interface TaskTier {
  taskId: string;
  name: string;
  amount: number;
}

// Данные по одному тиру за один день.
export interface TaskDayEntry extends TaskTier {
  completed: number; // сколько раз выполнено = сколько депозитов
}

// Один день истории — то, что в итоге должно приходить с бэкенда
// (см. src/data/api.ts — TODO по формату ответа).
export interface DayRecord {
  date: string; // ISO-строка YYYY-MM-DD
  tasks: TaskDayEntry[];
}

// Тир с посчитанным количеством за произвольный период (агрегат).
export interface TaskAggregate extends TaskTier {
  completed: number;
  rawCompleted: number; // значение до ручной корректировки
  isOverridden: boolean;
}

export type PeriodMode = "day" | "week" | "month" | "range";

export interface DateRange {
  start: string;
  end: string;
}

// Описание метрики дашборда. Сейчас используется только "deposits_count",
// но структура сразу рассчитана на добавление новых метрик в будущем —
// см. src/config/metrics.ts
export interface MetricConfig {
  id: string;
  label: string;
  unit: string;
}

// Ключ ручной корректировки: `${rangeKey}::${taskId}` -> новое значение completed
export type TaskOverrides = Record<string, number>;

