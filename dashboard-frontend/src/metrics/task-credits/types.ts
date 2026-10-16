export interface GameCredits {
  gameId: string;
  name: string;
  automatic: number;
  manual: number;
}

export interface TaskCreditsDayRecord {
  date: string;
  games: GameCredits[];
}
