import express from "express";
import cors from "cors";
import depositsRouter from "./metrics/deposits/routes.js";
import registrationsRouter from "./metrics/registrations/routes.js";
import taskCreditsRouter from "./metrics/task-credits/routes.js";
import { startCron } from "./cron/schedule.js";
import { catchUpMissingDays } from "./cron/catchup.js";

const app = express();

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error(`CORS: origin ${origin} не разрешён`));
    },
  }),
);

app.use(express.json());

function requireApiKey(req, res, next) {
  const expected = `Bearer ${process.env.API_KEY}`;
  if (req.headers.authorization !== expected) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

app.use("/api", requireApiKey, depositsRouter);
app.use("/api", requireApiKey, registrationsRouter);
app.use("/api", requireApiKey, taskCreditsRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`[server] backend запущен на http://localhost:${PORT}`);
});

if (process.env.DEMO_MODE !== "true") {
  startCron();
  catchUpMissingDays();
}
