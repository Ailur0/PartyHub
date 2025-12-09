import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Medal, Home, RotateCcw } from "lucide-react";
import { Player } from "@/pages/MiniGameMarathon";
import { updatePlayerStats } from "@/lib/leaderboardStorage";
import { useEffect } from "react";

type Props = {
  players: Player[];
  onPlayAgain: () => void;
  onBackToLobby: () => void;
};

const GameResults = ({ players, onPlayAgain, onBackToLobby }: Props) => {
  const sortedPlayers = [...players].sort((a, b) => b.wins - a.wins);
  const winner = sortedPlayers[0];

  useEffect(() => {
    // Save stats to leaderboard
    sortedPlayers.forEach((player, index) => {
      updatePlayerStats(
        player.id,
        player.name,
        "miniGameMarathon",
        player.wins * 100,
        index === 0,
        player.avatar,
        player.color
      );
    });
  }, []);

  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <Card className="w-full max-w-4xl p-8 bg-gradient-card backdrop-blur border-2 border-border animate-scale-in">
        <div className="text-center mb-8">
          <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 text-xl mb-4 animate-pulse">
            <Trophy className="w-6 h-6 mr-2 inline" />
            Marathon Complete!
          </Badge>
          <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
            🎉 {winner.name} Wins! 🎉
          </h1>
          <p className="text-2xl text-muted-foreground">
            With {winner.wins} victories!
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {sortedPlayers.map((player, index) => (
            <Card
              key={player.id}
              className={`p-6 transition-all ${
                index === 0
                  ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50 scale-105"
                  : index === 1
                  ? "bg-gradient-to-r from-gray-300/20 to-gray-400/20 border-gray-400/50"
                  : index === 2
                  ? "bg-gradient-to-r from-orange-600/20 to-orange-700/20 border-orange-600/50"
                  : "bg-background/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-black text-muted-foreground w-12">
                    {index === 0 ? (
                      <Trophy className="w-12 h-12 text-yellow-500" />
                    ) : index === 1 ? (
                      <Medal className="w-12 h-12 text-gray-400" />
                    ) : index === 2 ? (
                      <Medal className="w-12 h-12 text-orange-600" />
                    ) : (
                      `#${index + 1}`
                    )}
                  </div>
                  <div
                    className={`w-16 h-16 rounded-full ${player.color} flex items-center justify-center text-3xl`}
                  >
                    {player.avatar}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{player.name}</h3>
                    <p className="text-muted-foreground">
                      {player.wins} {player.wins === 1 ? "win" : "wins"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: player.wins }).map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex gap-4">
          <Button
            onClick={onBackToLobby}
            variant="outline"
            className="flex-1"
            size="lg"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Lobby
          </Button>
          <Button
            onClick={onPlayAgain}
            className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
            size="lg"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Play Again
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default GameResults;
