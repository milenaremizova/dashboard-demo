import { Router } from "express";
import { getDailyStats } from "../../storage.js";
import { type } from "node:os";
import { shiftForDemo } from "../../demoShift.js";

const router = Router();

router.get("/task-credits", (req, res) => {
  const dailyStats = getDailyStats("task-credits");
  const history = Object.entries(dailyStats).map(([date, games]) => ({
    date,
    games,
  }));
  res.json(shiftForDemo(history));
});

export default router;
