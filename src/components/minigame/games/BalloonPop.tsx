import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Player } from "@/pages/MiniGameMarathon";
import { Sparkles } from "lucide-react";

type Balloon = {
  id: string;
  x: number;
  y: number;
  color: string;
};

type Props = {
  players: Player[];
  onComplete: (winnerId: string) => void;
};

const BalloonPop = ({ players, onComplete }: Props) => {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(players.map((p) => [p.id, 0]))
  );
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [timeLeft, setTimeLeft] = useState(8);

  useEffect(() => {
    const spawnInterval = setInterval(() => {
      if (timeLeft > 0) {
        const newBalloon: Balloon = {
          id: Date.now().toString(),
          x: Math.random() * 80 + 10,
          y: Math.random() * 60 + 10,
          color: ["red", "blue", "green", "yellow", "purple", "pink"][
            Math.floor(Math.random() * 6)
          ],
        };
        setBalloons((prev) => [...prev, newBalloon]);
      }
    }, 800);

    return () => clearInterval(spawnInterval);
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (currentPlayer < players.length - 1) {
            setCurrentPlayer(currentPlayer + 1);
            setBalloons([]);
            return 8;
          } else {
            const winner = Object.entries(scores).reduce((a, b) =>
              a[1] > b[1] ? a : b
            )[0];
            setTimeout(() => onComplete(winner), 500);
            return 0;
          }
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, currentPlayer, players, scores, onComplete]);

  const handleBalloonClick = (id: string) => {
    setBalloons((prev) => prev.filter((b) => b.id !== id));
    setScores((prev) => ({
      ...prev,
      [players[currentPlayer].id]: prev[players[currentPlayer].id] + 1,
    }));
  };

  const player = players[currentPlayer];

  return (
    <Card className="p-8 bg-gradient-card backdrop-blur border-2 border-border">
      <div className="text-center mb-4">
        <h2 className="text-4xl font-black mb-2 flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8 text-pink-500" />
          Balloon Pop
        </h2>
        <div className="flex items-center justify-center gap-3 mb-2">
          <div
            className={`w-12 h-12 rounded-full ${player.color} flex items-center justify-center text-2xl`}
          >
            {player.avatar}
          </div>
          <p className="text-2xl font-bold">{player.name}</p>
        </div>
        <div className="text-4xl font-black text-primary">{timeLeft}s</div>
      </div>

      <div className="relative h-96 bg-gradient-to-b from-sky-200 to-sky-50 rounded-lg overflow-hidden">
        {balloons.map((balloon) => (
          <button
            key={balloon.id}
            onClick={() => handleBalloonClick(balloon.id)}
            className={`absolute w-16 h-20 text-4xl transition-all hover:scale-110 cursor-pointer animate-fade-in`}
            style={{
              left: `${balloon.x}%`,
              top: `${balloon.y}%`,
              filter: `hue-rotate(${balloon.color === "red" ? 0 : balloon.color === "blue" ? 200 : balloon.color === "green" ? 100 : balloon.color === "yellow" ? 50 : balloon.color === "purple" ? 270 : 300}deg)`,
            }}
          >
            🎈
          </button>
        ))}
      </div>

      <div className="mt-4 flex justify-center gap-4">
        {players.map((p) => (
          <Card key={p.id} className="px-4 py-2 bg-background/50">
            <p className="font-semibold">{p.name}</p>
            <p className="text-2xl font-black text-primary">{scores[p.id]}</p>
          </Card>
        ))}
      </div>
    </Card>
  );
};

export default BalloonPop;
