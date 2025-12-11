import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Player } from "@/pages/MiniGameMarathon";
import { Zap } from "lucide-react";

type Props = {
  players: Player[];
  onComplete: (winnerId: string) => void;
};

const TapRace = ({ players, onComplete }: Props) => {
  const [taps, setTaps] = useState<Record<string, number>>(
    Object.fromEntries(players.map((p) => [p.id, 0]))
  );
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setGameStarted(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!gameStarted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          const winner = Object.entries(taps).reduce((a, b) =>
            a[1] > b[1] ? a : b
          )[0];
          setTimeout(() => onComplete(winner), 500);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, timeLeft, taps, onComplete]);

  const handleTap = (playerId: string) => {
    if (timeLeft > 0) {
      setTaps((prev) => ({ ...prev, [playerId]: prev[playerId] + 1 }));
    }
  };

  return (
    <Card className="p-8 bg-gradient-card backdrop-blur border-2 border-border">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-black mb-2 flex items-center justify-center gap-2">
          <Zap className="w-8 h-8 text-yellow-500" />
          Tap Race
        </h2>
        <p className="text-xl text-muted-foreground mb-4">
          Tap as fast as you can!
        </p>
        <div className="text-6xl font-black text-primary">{timeLeft}s</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {players.map((player) => (
          <Card key={player.id} className="p-6 bg-background/50">
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-12 h-12 rounded-full ${player.color} flex items-center justify-center text-2xl`}
              >
                {player.avatar}
              </div>
              <div>
                <p className="font-bold">{player.name}</p>
                <p className="text-3xl font-black text-primary">
                  {taps[player.id]} taps
                </p>
              </div>
            </div>
            <Button
              onClick={() => handleTap(player.id)}
              disabled={!gameStarted || timeLeft <= 0}
              className="w-full h-32 text-2xl font-bold"
              size="lg"
            >
              TAP!
            </Button>
          </Card>
        ))}
      </div>
    </Card>
  );
};

export default TapRace;
