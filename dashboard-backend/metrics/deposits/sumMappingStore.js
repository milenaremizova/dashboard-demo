import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MAPPING_PATH = path.join(__dirname, "config/sumMapping.json");

export function loadSumMapping() {
    const raw = fs.readFileSync(MAPPING_PATH, "utf-8");
    return JSON.parse(raw);
}

export function saveSumMapping(mapping) {
    fs.writeFileSync(MAPPING_PATH, JSON.stringify(mapping, null, 2));
}