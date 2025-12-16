import { LeaderboardData, LeaderboardEntry, GameModeStats } from "@/types/leaderboard";

const STORAGE_KEY = "partyverse_leaderboard";

const createEmptyGameModeStats = (): GameModeStats => ({
  undercover: { gamesPlayed: 0, wins: 0, highScore: 0, averageScore: 0 },
  actItOut: { gamesPlayed: 0, wins: 0, highScore: 0, averageScore: 0 },
  sketchIt: { gamesPlayed: 0, wins: 0, highScore: 0, averageScore: 0 },
  quiz: { gamesPlayed: 0, wins: 0, highScore: 0, averageScore: 0 },
  oneWordSpy: { gamesPlayed: 0, wins: 0, highScore: 0, averageScore: 0 },
  obstacleDash: { gamesPlayed: 0, wins: 0, highScore: 0, averageScore: 0, bestTime: undefined },
  miniGameMarathon: { gamesPlayed: 0, wins: 0, highScore: 0, averageScore: 0 },
});

export const getLeaderboardData = (): LeaderboardData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return { players: {}, lastUpdated: new Date().toISOString() };
  }
  return JSON.parse(stored);
};

export const saveLeaderboardData = (data: LeaderboardData): void => {
  data.lastUpdated = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const updatePlayerStats = (
  playerId: string,
  playerName: string,
  gameMode: keyof GameModeStats,
  score: number,
  won: boolean,
  avatar?: string,
  color?: string
): void => {
  const data = getLeaderboardData();
  
  if (!data.players[playerId]) {
    data.players[playerId] = {
      playerId,
      playerName,
      totalWins: 0,
      totalGamesPlayed: 0,
      achievements: [],
      lastPlayed: new Date().toISOString(),
      rank: 0,
      avatar,
      color,
      gameModeStats: createEmptyGameModeStats(),
    };
  }

  const player = data.players[playerId];
  player.playerName = playerName;
  player.lastPlayed = new Date().toISOString();
  player.totalGamesPlayed += 1;
  if (won) player.totalWins += 1;
  if (avatar) player.avatar = avatar;
  if (color) player.color = color;

  const modeStats = player.gameModeStats[gameMode];
  modeStats.gamesPlayed += 1;
  if (won) modeStats.wins += 1;
  if (score > modeStats.highScore) modeStats.highScore = score;
  modeStats.averageScore = 
    (modeStats.averageScore * (modeStats.gamesPlayed - 1) + score) / modeStats.gamesPlayed;

  // Check for achievements
  checkAchievements(player);

  saveLeaderboardData(data);
};

export const getTopPlayers = (limit: number = 10): LeaderboardEntry[] => {
  const data = getLeaderboardData();
  const players = Object.values(data.players);
  
  players.sort((a, b) => {
    if (b.totalWins !== a.totalWins) return b.totalWins - a.totalWins;
    return b.totalGamesPlayed - a.totalGamesPlayed;
  });

  return players.slice(0, limit).map((player, index) => ({
    ...player,
    rank: index + 1,
  }));
};

export const getPlayerStats = (playerId: string): LeaderboardEntry | null => {
  const data = getLeaderboardData();
  return data.players[playerId] || null;
};

const checkAchievements = (player: LeaderboardEntry): void => {
  const achievements: Array<{ id: string; name: string; condition: boolean }> = [
    { id: "first_win", name: "First Victory", condition: player.totalWins === 1 },
    { id: "party_starter", name: "Party Starter", condition: player.totalGamesPlayed === 10 },
    { id: "party_master", name: "Party Master", condition: player.totalWins === 10 },
    { id: "legend", name: "Legend", condition: player.totalWins === 50 },
    { id: "sketch_master", name: "Sketch Master", condition: player.gameModeStats.sketchIt.wins >= 5 },
    { id: "quiz_champion", name: "Quiz Champion", condition: player.gameModeStats.quiz.wins >= 5 },
    { id: "undercover_spy", name: "Undercover Spy", condition: player.gameModeStats.undercover.wins >= 5 },
  ];

  achievements.forEach(({ id, name, condition }) => {
    if (condition && !player.achievements.includes(id)) {
      player.achievements.push(id);
    }
  });
};
