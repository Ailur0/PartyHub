import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Medal, Award, TrendingUp } from "lucide-react";
import { getTopPlayers } from "@/lib/leaderboardStorage";
import { LeaderboardEntry } from "@/types/leaderboard";

const GlobalLeaderboard = () => {
  const [topPlayers, setTopPlayers] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = () => {
    const players = getTopPlayers(10);
    setTopPlayers(players);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-700" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Trophy className="w-8 h-8 text-primary" />
          <h2 className="text-3xl font-bold">Global Leaderboard</h2>
        </div>
        <p className="text-muted-foreground">Top players across all game modes</p>
      </div>

      {topPlayers.length === 0 ? (
        <Card className="p-8 text-center">
          <TrendingUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No games played yet. Be the first!</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {topPlayers.map((player) => (
            <Card
              key={player.playerId}
              className={`p-4 transition-all hover:shadow-lg ${
                player.rank <= 3 ? "bg-gradient-to-r from-primary/10 to-transparent border-primary/30" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12">
                  {getRankIcon(player.rank)}
                </div>

                <Avatar className="w-12 h-12" style={{ backgroundColor: player.color || "#6366f1" }}>
                  <AvatarFallback className="text-white text-lg">
                    {player.avatar || player.playerName[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg truncate">{player.playerName}</h3>
                    {player.achievements.length > 0 && (
                      <Badge variant="secondary" className="gap-1">
                        <Award className="w-3 h-3" />
                        {player.achievements.length}
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>{player.totalGamesPlayed} games</span>
                    <span className="text-primary font-semibold">{player.totalWins} wins</span>
                    <span>
                      {player.totalGamesPlayed > 0
                        ? Math.round((player.totalWins / player.totalGamesPlayed) * 100)
                        : 0}
                      % win rate
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{player.totalWins}</div>
                  <div className="text-xs text-muted-foreground">victories</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default GlobalLeaderboard;
