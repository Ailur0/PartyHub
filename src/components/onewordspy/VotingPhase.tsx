import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Vote, Users } from "lucide-react";
import { PlayerData } from "./OneWordSpyGame";
import { toast } from "sonner";

interface VotingPhaseProps {
  players: PlayerData[];
  onVotingComplete: (votedOutPlayerId: string) => void;
  currentRound: number;
}

const VotingPhase = ({ players, onVotingComplete, currentRound }: VotingPhaseProps) => {
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = (playerId: string) => {
    setVotes({
      ...votes,
      [playerId]: (votes[playerId] || 0) + 1,
    });
  };

  const handleFinishVoting = () => {
    if (Object.keys(votes).length === 0) {
      toast.error("No votes cast yet");
      return;
    }

    let maxVotes = 0;
    let votedOutPlayer = "";
    let tiedPlayers: string[] = [];

    Object.entries(votes).forEach(([playerId, voteCount]) => {
      if (voteCount > maxVotes) {
        maxVotes = voteCount;
        votedOutPlayer = playerId;
        tiedPlayers = [playerId];
      } else if (voteCount === maxVotes) {
        tiedPlayers.push(playerId);
      }
    });

    if (tiedPlayers.length > 1) {
      // Random elimination on tie
      votedOutPlayer = tiedPlayers[Math.floor(Math.random() * tiedPlayers.length)];
      toast.info("It's a tie! Random elimination.");
    }

    onVotingComplete(votedOutPlayer);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-4 py-2 text-sm font-semibold">
            Round {currentRound} - Voting Phase
          </Badge>
          <h2 className="text-3xl font-bold">Who is the Spy?</h2>
          <p className="text-muted-foreground">
            Discuss the hints and vote to eliminate a player
          </p>
        </div>

        <Card className="p-6 space-y-4 bg-gradient-card backdrop-blur border-2">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-bold">Cast Your Votes</h3>
          </div>

          <div className="grid gap-3">
            {players.map((player) => (
              <div
                key={player.name}
                className="flex items-center justify-between p-4 rounded-lg bg-background border border-border hover:border-primary transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full ${player.color} flex items-center justify-center text-2xl`}
                  >
                    {player.icon}
                  </div>
                  <div>
                    <p className="font-bold">{player.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Votes: {votes[player.name] || 0}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => handleVote(player.name)}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Vote className="w-4 h-4" />
                  Vote
                </Button>
              </div>
            ))}
          </div>

          <Button
            onClick={handleFinishVoting}
            size="lg"
            className="w-full text-lg bg-gradient-to-r from-yellow-500 to-orange-600 hover:opacity-90"
          >
            Finish Voting & Eliminate
          </Button>
        </Card>

        <Card className="p-4 bg-yellow-500/10 border border-yellow-500/30">
          <p className="text-sm text-center text-muted-foreground">
            💡 Tip: Pay attention to hints that seemed off or too vague
          </p>
        </Card>
      </div>
    </div>
  );
};

export default VotingPhase;
