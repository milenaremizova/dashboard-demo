import pg from "pg";
import dotenv from "dotenv"; import path from "node:path"; import { fileURLToPath } from "node:url"; const __dirname = path.dirname(fileURLToPath(import.meta.url)); dotenv.config({ path: path.join(__dirname, ".env") });

const { Pool } = pg;

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000, // не ждать дольше 5 секунд
});

// проверка при старте, чтобы сразу увидеть проблему с подключением, если она есть
export async function assertDbConnection() {
  await pool.query("SELECT 1");
}