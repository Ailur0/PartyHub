export interface PlayerStats {
  playerId: string;
  playerName: string;
  totalWins: number;
  totalGamesPlayed: number;
  achievements: string[];
  lastPlayed: string;
  avatar?: string;
  color?: string;
}

export interface GameModeStats {
  undercover: GameStats;
  actItOut: GameStats;
  sketchIt: GameStats;
  quiz: GameStats;
  oneWordSpy: GameStats;
  obstacleDash: GameStats;
  miniGameMarathon: GameStats;
}

export interface GameStats {
  gamesPlayed: number;
  wins: number;
  highScore: number;
  averageScore: number;
  bestTime?: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface LeaderboardEntry extends PlayerStats {
  rank: number;
  gameModeStats: GameModeStats;
}

export interface LeaderboardData {
  players: Record<string, LeaderboardEntry>;
  lastUpdated: string;
}
