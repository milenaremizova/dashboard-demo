import { Router } from "express";
import {
  getDailyStats,
  getOverrides,
  setOverride,
  deleteOverride,
} from "../../storage.js";
import { loadSumMapping, saveSumMapping } from "./sumMappingStore.js";

const router = Router();

// Отдача накопленной истории 
// фронтенд агрегирует нужный период (день/неделя/месяц/диапазон)
router.get("/deposits", (req, res) => {
  const dailyStats = getDailyStats("deposits");
  const history = Object.entries(dailyStats).map(([date, tasks]) => ({
    date,
    tasks,
  }));
  res.json(history);
});

router.get("/deposits/overrides", (req, res) => {
  res.json(getOverrides("deposits"));
});

router.patch("/deposits/overrides", (req, res) => {
  const { rangeKey, taskId, value } = req.body;
  if (!rangeKey || !taskId || typeof value !== "number") {
    return res
      .status(400)
      .json({ error: "rangeKey, taskId и value(number) обязательны" });
  }
  setOverride("deposits", rangeKey, taskId, value);
  res.status(204).end();
});

router.delete("/deposits/overrides", (req, res) => {
  const { rangeKey, taskId } = req.query;
  if (!rangeKey || !taskId) {
    return res.status(400).json({ error: "rangeKey и taskId обязательны" });
  }
  deleteOverride("deposits", String(rangeKey), String(taskId));
  res.status(204).end();
});

router.get("/deposits/tiers", (req, res) => {
  const mapping = loadSumMapping();
  res.json(mapping);
});

router.put("/deposits/tiers", (req, res) => {
  const newMapping = req.body;

  for (const [tierCode, tier] of Object.entries(newMapping)) {
    if (
      typeof tier.taskId !== "number" ||
      typeof tier.name !== "string" ||
      typeof tier.amount !== "number"
    ) {
      return res
        .status(400)
        .json({ error: `Некорректные данные для задания "${tierCode}"` });
    }
  }
  saveSumMapping(newMapping);
  res.json({ ok: true });
});

export default router;
