import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Vote, Clock, User, Heart, Star, Sparkles, Crown, Shield, Sword, Target, Rocket, Zap } from "lucide-react";
import { PlayerData } from "./UndercoverGame";
import PlayerAvatar from "./PlayerAvatar";

const iconMap: Record<string, any> = {
  User, Heart, Star, Sparkles, Crown, Shield, Sword, Target, Rocket, Zap
};

interface VotingPhaseProps {
  players: PlayerData[];
  round: number;
  onComplete: (eliminatedIndex: number) => void;
}

const VotingPhase = ({ players, round, onComplete }: VotingPhaseProps) => {
  const [votes, setVotes] = useState<number[]>(new Array(players.length).fill(0));
  const [timeLeft, setTimeLeft] = useState(90);

  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleVote = (index: number) => {
    const newVotes = [...votes];
    newVotes[index]++;
    setVotes(newVotes);
  };

  const handleFinishVoting = () => {
    const maxVotes = Math.max(...votes);
    const eliminatedIndex = votes.indexOf(maxVotes);
    onComplete(eliminatedIndex);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-4">
          <Badge className="bg-gradient-primary text-primary-foreground">
            Round {round} - Voting Phase
          </Badge>
          <Badge 
            variant={timeLeft <= 15 ? "destructive" : "secondary"}
            className="gap-1"
          >
            <Clock className="w-3 h-3" />
            {timeLeft}s
          </Badge>
        </div>
        <h2 className="text-3xl font-bold">Time to Vote!</h2>
        <p className="text-muted-foreground">
          Who do you think is the spy?
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {players.map((player, index) => {
          const IconComponent = player.avatar ? iconMap[player.avatar.icon] || User : User;
          return (
            <Card
              key={index}
              className="p-6 bg-gradient-card backdrop-blur border-2 hover:border-primary transition-all space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {player.avatar && (
                      <PlayerAvatar
                        icon={IconComponent}
                        color={player.avatar.color}
                        size="sm"
                      />
                    )}
                    <h3 className="text-xl font-bold">{player.name}</h3>
                  </div>
                  {votes[index] > 0 && (
                    <Badge variant="secondary">
                      {votes[index]} {votes[index] === 1 ? "vote" : "votes"}
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground italic">
                  "{player.description}"
                </p>
              </div>

              <Button
                onClick={() => handleVote(index)}
                className="w-full gap-2"
                variant="outline"
              >
                <Vote className="w-4 h-4" />
                Vote to Eliminate
              </Button>
            </Card>
          );
        })}
      </div>

      <div className="text-center space-y-4">
        <div className="text-sm text-muted-foreground">
          Total votes: {votes.reduce((a, b) => a + b, 0)}
        </div>
        <Button
          size="lg"
          onClick={handleFinishVoting}
          disabled={votes.reduce((a, b) => a + b, 0) === 0}
          className="gap-2"
        >
          Reveal Results
        </Button>
      </div>
    </div>
  );
};

export default VotingPhase;
