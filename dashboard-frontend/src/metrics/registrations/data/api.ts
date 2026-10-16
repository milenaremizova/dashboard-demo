import type { DateRange } from "../../../types/period";
import type { RegistrationDayRecord } from "../types";
import { authFetch } from "../../../lib/apiClient";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchRegistrationsHistory(range: DateRange): Promise<RegistrationDayRecord[]> {
    const response = await authFetch(`${BASE_URL}/api/registrations?start=${range.start}&end=${range.end}`);
    if (!response.ok) throw new Error(`Не удалось получить регистрации: ${response.status}`);
    return (await response.json()) as RegistrationDayRecord[];
}