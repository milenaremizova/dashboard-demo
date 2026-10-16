export type { DateRange, PeriodMode } from "../../types/period";

export interface TaskTier {
  taskId: string;
  name: string;
  amount: number;
}

export interface TaskDayEntry extends TaskTier {
  completed: number;
}

export interface DayRecord {
  date: string;
  tasks: TaskDayEntry[];
}

export interface TaskAggregate extends TaskTier {
  completed: number;
  amountTotal: number;
  rawCompleted: number;
  isOverridden: boolean;
}

export interface MetricConfig {
  id: string;
  label: string;
  unit: string;
}

export type TaskOverrides = Record<string, number>;

export interface TierMapping {
  [sumCode: string]: {
    taskId: number;
    name: string;
    amount: number;
  };
}