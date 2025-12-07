import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, RotateCcw, User, Heart, Star, Sparkles, Crown, Shield, Sword, Target, Rocket, Zap } from "lucide-react";
import { PlayerData } from "./UndercoverGame";
import PlayerAvatar from "./PlayerAvatar";
import { updatePlayerStats } from "@/lib/leaderboardStorage";
import { useEffect } from "react";

const iconMap: Record<string, any> = {
  User, Heart, Star, Sparkles, Crown, Shield, Sword, Target, Rocket, Zap
};

interface GameResultsProps {
  players: PlayerData[];
  civilianWord: string;
  onPlayAgain: () => void;
}

const GameResults = ({ players, civilianWord, onPlayAgain }: GameResultsProps) => {
  const spy = players.find((p) => p.role === "spy");
  const mrWhite = players.find((p) => p.role === "mrwhite");
  const mrWhiteWon = (mrWhite as any)?.mrWhiteWon === true;
  const spyWon = spy?.isAlive && !mrWhiteWon;

  useEffect(() => {
    // Save stats to leaderboard
    players.forEach((player) => {
      const won = 
        (player.role === "spy" && spyWon) ||
        (player.role === "mrwhite" && mrWhiteWon) ||
        (player.role === "civilian" && !spyWon && !mrWhiteWon);
      
      updatePlayerStats(
        player.name,
        player.name,
        "undercover",
        won ? 100 : 0,
        won,
        player.avatar?.icon,
        player.avatar?.color
      );
    });
  }, []);

  let winMessage = "👥 Civilians Win!";
  let winDescription = "The civilians caught the spy!";

  if (mrWhiteWon) {
    winMessage = "👤 Mr. White Wins!";
    winDescription = "Mr. White guessed the word correctly!";
  } else if (spyWon) {
    winMessage = "🕵️ Spy Wins!";
    winDescription = "The spy successfully blended in!";
  }

  return (
    <div className="space-y-6 text-center">
      <div className="space-y-2">
        <Trophy className="w-16 h-16 mx-auto text-primary animate-bounce" />
        <h2 className="text-4xl font-black">{winMessage}</h2>
        <p className="text-xl text-muted-foreground">{winDescription}</p>
      </div>

      <Card className="p-6 bg-gradient-card backdrop-blur border-2 space-y-4">
        <h3 className="text-xl font-bold">Game Summary</h3>
        
        <div className="space-y-2">
          {players.map((player, index) => {
            const IconComponent = player.avatar ? iconMap[player.avatar.icon] || User : User;
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  player.role === "spy"
                    ? "border-destructive/50 bg-destructive/10"
                    : player.role === "mrwhite"
                    ? "border-primary/50 bg-primary/10"
                    : "border-border/50 bg-background/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-left">
                    {player.avatar && (
                      <PlayerAvatar
                        icon={IconComponent}
                        color={player.avatar.color}
                        size="sm"
                      />
                    )}
                    <div>
                      <div className="font-bold">{player.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Word: {player.role === "mrwhite" ? `(None - Civilian word was: ${civilianWord})` : player.word}
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={
                      player.role === "spy" 
                        ? "destructive" 
                        : player.role === "mrwhite"
                        ? "outline"
                        : "secondary"
                    }
                  >
                    {player.role === "spy" 
                      ? "🕵️ Spy" 
                      : player.role === "mrwhite"
                      ? "👤 Mr. White"
                      : "👥 Civilian"}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Button
        size="lg"
        onClick={onPlayAgain}
        className="gap-2"
      >
        <RotateCcw className="w-4 h-4" />
        Play Again
      </Button>
    </div>
  );
};

export default GameResults;
