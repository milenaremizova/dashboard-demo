import { Router } from "express";
import { getDailyStats } from "../../storage.js";
import { shiftForDemo } from "../../demoShift.js";

const router = Router();

// аналогичная схема как и с deposits
router.get("/registrations", (req, res) => {
  const dailyStats = getDailyStats("registrations");
  const history = Object.entries(dailyStats).map(([date, stats]) => ({
    date,
    ...stats,
  }));
  res.json(shiftForDemo(history));
});

export default router;
