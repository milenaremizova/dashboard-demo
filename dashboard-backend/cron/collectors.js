import { collectForDate as collectDeposits } from "../metrics/deposits/collect.js";
import { collectForDate as collectRegistrations } from "../metrics/registrations/collect.js";
import { collectForDate as collectTaskCredits } from "../metrics/task-credits/collect.js";

export const COLLECTORS = [
  { key: "deposits", collect: collectDeposits },
  { key: "registrations", collect: collectRegistrations },
  { key: "task-credits", collect: collectTaskCredits},
];