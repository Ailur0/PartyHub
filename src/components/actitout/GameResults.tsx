import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Drama } from "lucide-react";
import { PlayerScore } from "./ActItOutGame";
import PlayerAvatar from "@/components/undercover/PlayerAvatar";
import { updatePlayerStats } from "@/lib/leaderboardStorage";
import { useEffect } from "react";

interface GameResultsProps {
  playerScores: PlayerScore[];
  onPlayAgain: () => void;
}

const GameResults = ({ playerScores, onPlayAgain }: GameResultsProps) => {
  const sortedPlayers = [...playerScores].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];

  useEffect(() => {
    // Save stats to leaderboard
    sortedPlayers.forEach((player, index) => {
      updatePlayerStats(
        player.name,
        player.name,
        "actItOut",
        player.score,
        index === 0,
        player.avatar.icon,
        player.avatar.color
      );
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="p-8 bg-gradient-card backdrop-blur border-2 border-border text-center">
        <div className="mb-6">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
          <h1 className="text-4xl font-black mb-2">
            <span className="bg-gradient-to-r from-accent to-blue-600 bg-clip-text text-transparent">
              Game Over!
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Congratulations to our champion actor!
          </p>
        </div>

        {/* Winner */}
        <div className="mb-8 p-6 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50">
          <div className="flex items-center justify-center gap-4">
            <PlayerAvatar
              icon={winner.avatar.icon}
              color={winner.avatar.color}
              size="lg"
            />
            <div className="text-left">
              <div className="text-2xl font-bold">{winner.name}</div>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  {winner.score} points
                </span>
                <span className="flex items-center gap-1">
                  <Drama className="w-4 h-4" />
                  {winner.successfulActs} successful acts
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* All Players */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold mb-4">Final Standings</h3>
          {sortedPlayers.map((player, index) => (
            <div
              key={player.name}
              className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 border border-border"
            >
              <Badge
                variant={index === 0 ? "default" : "secondary"}
                className="w-8 h-8 rounded-full flex items-center justify-center"
              >
                {index + 1}
              </Badge>
              <PlayerAvatar
                icon={player.avatar.icon}
                color={player.avatar.color}
                size="md"
              />
              <div className="flex-1 text-left">
                <div className="font-bold">{player.name}</div>
                <div className="text-sm text-muted-foreground">
                  {player.successfulActs} successful acts
                </div>
              </div>
              <Badge className="text-lg px-4 py-2">{player.score} pts</Badge>
            </div>
          ))}
        </div>

        <Button
          onClick={onPlayAgain}
          size="lg"
          className="w-full mt-6 bg-gradient-to-r from-accent to-blue-600 hover:opacity-90 text-accent-foreground"
        >
          Play Again
        </Button>
      </Card>
    </div>
  );
};

export default GameResults;
