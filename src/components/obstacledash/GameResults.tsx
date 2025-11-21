import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, RotateCcw, Medal, Skull } from "lucide-react";
import { updatePlayerStats } from "@/lib/leaderboardStorage";
import { useEffect } from "react";

interface PlayerState {
  name: string;
  icon: string;
  color: string;
  x: number;
  isEliminated: boolean;
  finishTime?: number;
}

interface GameResultsProps {
  players: PlayerState[];
  onPlayAgain: () => void;
}

const GameResults = ({ players, onPlayAgain }: GameResultsProps) => {
  const winner = players[0];

  useEffect(() => {
    // Save stats to leaderboard
    players.forEach((player, index) => {
      updatePlayerStats(
        player.name,
        player.name,
        "obstacleDash",
        Math.floor(player.x),
        index === 0,
        player.icon,
        player.color
      );
    });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <div className="text-center space-y-4 animate-fade-in">
          <Trophy className="w-20 h-20 mx-auto text-yellow-500 animate-bounce" />
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 text-xl font-bold">
            Race Complete!
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black">
            {winner.name} Wins! 🎉
          </h2>
        </div>

        <Card className="p-6 space-y-4 bg-gradient-card backdrop-blur border-2">
          <div className="flex items-center gap-2 mb-4">
            <Medal className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-bold">Final Results</h3>
          </div>

          <div className="grid gap-3">
            {players.map((player, index) => {
              const medals = ["🥇", "🥈", "🥉"];
              const medal = medals[index];

              return (
                <div
                  key={player.name}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    index === 0
                      ? "bg-yellow-500/10 border-yellow-500/50 scale-105"
                      : player.isEliminated
                      ? "bg-red-500/10 border-red-500/30 opacity-60"
                      : "bg-background border-border"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 text-center">
                        {medal ? (
                          <span className="text-3xl">{medal}</span>
                        ) : (
                          <span className="text-xl font-bold text-muted-foreground">
                            #{index + 1}
                          </span>
                        )}
                      </div>
                      <div
                        className={`w-12 h-12 rounded-full ${player.color} flex items-center justify-center text-2xl`}
                      >
                        {player.icon}
                      </div>
                      <div>
                        <p className="font-bold text-lg">{player.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {player.isEliminated ? (
                            <span className="flex items-center gap-1 text-red-500">
                              <Skull className="w-4 h-4" />
                              Eliminated
                            </span>
                          ) : player.finishTime ? (
                            "Finished"
                          ) : (
                            "Did not finish"
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={index === 0 ? "default" : "secondary"} className="text-lg">
                        {Math.floor(player.x)}m
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6 bg-green-500/10 border border-green-500/30">
          <h3 className="font-bold mb-3 text-center">Race Stats</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">
                {players.filter((p) => p.finishTime).length}
              </p>
              <p className="text-sm text-muted-foreground">Finished</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-destructive">
                {players.filter((p) => p.isEliminated).length}
              </p>
              <p className="text-sm text-muted-foreground">Eliminated</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-500">
                {players.length}
              </p>
              <p className="text-sm text-muted-foreground">Total Racers</p>
            </div>
          </div>
        </Card>

        <Button
          onClick={onPlayAgain}
          size="lg"
          className="w-full text-lg gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90"
        >
          <RotateCcw className="w-5 h-5" />
          Race Again
        </Button>
      </div>
    </div>
  );
};

export default GameResults;
