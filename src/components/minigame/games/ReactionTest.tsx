import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Player } from "@/pages/MiniGameMarathon";
import { Zap } from "lucide-react";

type Props = {
  players: Player[];
  onComplete: (winnerId: string) => void;
};

const ReactionTest = ({ players, onComplete }: Props) => {
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [waiting, setWaiting] = useState(true);
  const [green, setGreen] = useState(false);
  const [reactionTimes, setReactionTimes] = useState<Record<string, number>>(
    Object.fromEntries(players.map((p) => [p.id, 0]))
  );
  const [startTime, setStartTime] = useState(0);

  useEffect(() => {
    const delay = Math.random() * 3000 + 2000;
    const timer = setTimeout(() => {
      setWaiting(false);
      setGreen(true);
      setStartTime(Date.now());
    }, delay);

    return () => clearTimeout(timer);
  }, [currentPlayer]);

  const handleClick = () => {
    if (!green) return;

    const reactionTime = Date.now() - startTime;
    const newTimes = {
      ...reactionTimes,
      [players[currentPlayer].id]: reactionTime,
    };
    setReactionTimes(newTimes);

    if (currentPlayer < players.length - 1) {
      setCurrentPlayer(currentPlayer + 1);
      setWaiting(true);
      setGreen(false);
    } else {
      const winner = Object.entries(newTimes).reduce((a, b) =>
        a[1] < b[1] && a[1] > 0 ? a : b
      )[0];
      setTimeout(() => onComplete(winner), 1000);
    }
  };

  const player = players[currentPlayer];

  return (
    <Card className="p-8 bg-gradient-card backdrop-blur border-2 border-border">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-black mb-2 flex items-center justify-center gap-2">
          <Zap className="w-8 h-8 text-yellow-500" />
          Reaction Test
        </h2>
        <p className="text-xl text-muted-foreground mb-4">
          Click when it turns green!
        </p>
        <div className="flex items-center justify-center gap-3">
          <div
            className={`w-12 h-12 rounded-full ${player.color} flex items-center justify-center text-2xl`}
          >
            {player.avatar}
          </div>
          <p className="text-2xl font-bold">{player.name}'s Turn</p>
        </div>
      </div>

      <div className="flex items-center justify-center mb-8">
        <Button
          onClick={handleClick}
          className={`w-96 h-96 text-4xl font-black rounded-full transition-all ${
            green
              ? "bg-green-500 hover:bg-green-600"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {waiting ? "Wait..." : green ? "CLICK!" : "Too Early!"}
        </Button>
      </div>

      <div className="flex justify-center gap-4">
        {players.map((p) => (
          <Card key={p.id} className="px-4 py-2 bg-background/50">
            <p className="font-semibold">{p.name}</p>
            <p className="text-xl font-black text-primary">
              {reactionTimes[p.id] > 0 ? `${reactionTimes[p.id]}ms` : "-"}
            </p>
          </Card>
        ))}
      </div>
    </Card>
  );
};

export default ReactionTest;
