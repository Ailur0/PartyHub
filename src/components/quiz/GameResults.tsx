import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, RotateCcw } from "lucide-react";
import { PlayerScore } from "./QuizGame";
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
        "quiz",
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
        <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
        <h2 className="text-4xl font-black mb-2">Quiz Complete!</h2>
        <p className="text-xl text-muted-foreground mb-6">
          <span className="font-bold" style={{ color: winner.avatar.color }}>
            {winner.name}
          </span>{" "}
          wins with {winner.score} points!
        </p>
        
        <div className="flex items-center justify-center gap-4 mb-6">
          <PlayerAvatar
            icon={winner.avatar.icon}
            color={winner.avatar.color}
            size="lg"
          />
        </div>

        <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg px-6 py-2">
          {winner.correctAnswers} Correct Answers
        </Badge>
      </Card>

      <Card className="p-6 bg-gradient-card backdrop-blur border-2 border-border">
        <h3 className="text-2xl font-bold mb-4">Final Standings</h3>
        <div className="space-y-3">
          {sortedPlayers.map((player, index) => {
            const icons = [Trophy, Medal, Award];
            const Icon = icons[index] || Award;
            const colors = ["text-yellow-500", "text-gray-400", "text-amber-700"];
            const iconColor = colors[index] || "text-muted-foreground";

            return (
              <div
                key={player.name}
                className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 border-2 border-border"
              >
                <Icon className={`w-6 h-6 ${iconColor}`} />
                <div className="text-2xl font-bold w-8">#{index + 1}</div>
                <PlayerAvatar
                  icon={player.avatar.icon}
                  color={player.avatar.color}
                  size="md"
                />
                <div className="flex-1">
                  <div className="font-bold text-lg">{player.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {player.correctAnswers} correct answers
                  </div>
                </div>
                <Badge className="bg-purple-600 text-white text-lg px-4 py-2">
                  {player.score} pts
                </Badge>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="flex justify-center">
        <Button
          onClick={onPlayAgain}
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          Play Again
        </Button>
      </div>
    </div>
  );
};

export default GameResults;
