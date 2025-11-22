import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, RotateCcw, Users } from "lucide-react";
import { PlayerData } from "./OneWordSpyGame";
import { updatePlayerStats } from "@/lib/leaderboardStorage";
import { useEffect } from "react";

interface GameResultsProps {
  players: PlayerData[];
  civilianWord: string;
  onPlayAgain: () => void;
}

const GameResults = ({ players, civilianWord, onPlayAgain }: GameResultsProps) => {
  const spy = players.find((p) => p.role === "spy");
  const spyEliminated = spy && !spy.isAlive;
  const civilianWins = spyEliminated;

  useEffect(() => {
    // Save stats to leaderboard
    players.forEach((player) => {
      const won = 
        (player.role === "spy" && !spyEliminated) ||
        (player.role === "civilian" && civilianWins);
      
      updatePlayerStats(
        player.name,
        player.name,
        "oneWordSpy",
        won ? 100 : 0,
        won,
        player.icon,
        player.color
      );
    });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <Trophy className="w-20 h-20 mx-auto text-yellow-500 animate-bounce" />
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-6 py-3 text-xl font-bold">
            Game Over!
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black">
            {civilianWins ? "Civilians Win! 🎉" : "Spy Wins! 🕵️"}
          </h2>
          <p className="text-xl text-muted-foreground">
            The word was: <span className="font-bold text-primary">{civilianWord}</span>
          </p>
        </div>

        <Card className="p-6 space-y-4 bg-gradient-card backdrop-blur border-2">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-bold">Final Results</h3>
          </div>

          <div className="grid gap-3">
            {players.map((player, index) => (
              <div
                key={player.name}
                className={`p-4 rounded-lg border-2 transition-all ${
                  player.role === "spy"
                    ? "bg-red-500/10 border-red-500/50"
                    : "bg-background border-border"
                } ${!player.isAlive ? "opacity-50" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-full ${player.color} flex items-center justify-center text-2xl`}
                    >
                      {player.icon}
                    </div>
                    <div>
                      <p className="font-bold">{player.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {player.role === "spy" ? "🕵️ Spy" : "👤 Civilian"}
                        {!player.isAlive && " (Eliminated)"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Word:</p>
                    <p className="font-bold">
                      {player.role === "spy" ? "???" : player.word}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-yellow-500/10 border border-yellow-500/30">
          <h3 className="font-bold mb-3 text-center">Game Summary</h3>
          <div className="space-y-2 text-sm text-center text-muted-foreground">
            <p>
              {civilianWins
                ? "The civilians successfully identified and eliminated the spy!"
                : "The spy survived and blended in perfectly!"}
            </p>
            <p className="text-xs italic">
              {spy?.name} was the spy trying to blend in without knowing the word.
            </p>
          </div>
        </Card>

        <Button
          onClick={onPlayAgain}
          size="lg"
          className="w-full text-lg gap-2 bg-gradient-to-r from-yellow-500 to-orange-600 hover:opacity-90"
        >
          <RotateCcw className="w-5 h-5" />
          Play Again
        </Button>
      </div>
    </div>
  );
};

export default GameResults;
