import { Router } from "express";
import { getDailyStats } from "../../storage.js";

const router = Router();

// аналогичная схема как и с deposits
router.get("/registrations", (req, res) => {
  const dailyStats = getDailyStats("registrations");
  const history = Object.entries(dailyStats).map(([date, stats]) => ({
    date,
    ...stats,
  }));
  res.json(history);
});

export default router;
