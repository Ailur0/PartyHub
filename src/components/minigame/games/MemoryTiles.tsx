import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Player } from "@/pages/MiniGameMarathon";
import { Brain } from "lucide-react";

type Props = {
  players: Player[];
  onComplete: (winnerId: string) => void;
};

const GRID_SIZE = 16;

const MemoryTiles = ({ players, onComplete }: Props) => {
  const [pattern, setPattern] = useState<number[]>([]);
  const [showing, setShowing] = useState(true);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [playerGuesses, setPlayerGuesses] = useState<number[]>([]);
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(players.map((p) => [p.id, 0]))
  );

  useEffect(() => {
    const newPattern = Array.from(
      { length: 5 },
      () => Math.floor(Math.random() * GRID_SIZE)
    );
    setPattern(newPattern);
    setTimeout(() => setShowing(false), 3000);
  }, []);

  const handleTileClick = (index: number) => {
    if (showing) return;

    const newGuesses = [...playerGuesses, index];
    setPlayerGuesses(newGuesses);

    if (newGuesses.length === pattern.length) {
      const correct = newGuesses.every((g, i) => g === pattern[i]);
      if (correct) {
        setScores((prev) => ({
          ...prev,
          [players[currentPlayer].id]: prev[players[currentPlayer].id] + 1,
        }));
      }

      if (currentPlayer < players.length - 1) {
        setCurrentPlayer(currentPlayer + 1);
        setPlayerGuesses([]);
        setShowing(true);
        setTimeout(() => setShowing(false), 2000);
      } else {
        const winner = Object.entries(scores).reduce((a, b) =>
          a[1] > b[1] ? a : b
        )[0];
        setTimeout(() => onComplete(winner), 1000);
      }
    }
  };

  const player = players[currentPlayer];

  return (
    <Card className="p-8 bg-gradient-card backdrop-blur border-2 border-border">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-black mb-2 flex items-center justify-center gap-2">
          <Brain className="w-8 h-8 text-purple-500" />
          Memory Tiles
        </h2>
        <p className="text-xl text-muted-foreground mb-4">
          Remember the pattern!
        </p>
        <div className="flex items-center justify-center gap-3 mb-4">
          <div
            className={`w-12 h-12 rounded-full ${player.color} flex items-center justify-center text-2xl`}
          >
            {player.avatar}
          </div>
          <p className="text-2xl font-bold">{player.name}'s Turn</p>
        </div>
        {showing && (
          <p className="text-xl text-primary font-bold">
            Watch carefully...
          </p>
        )}
      </div>

      <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
        {Array.from({ length: GRID_SIZE }).map((_, index) => (
          <button
            key={index}
            onClick={() => handleTileClick(index)}
            disabled={showing}
            className={`aspect-square rounded-lg transition-all ${
              showing && pattern.includes(index)
                ? "bg-primary animate-pulse"
                : playerGuesses.includes(index)
                ? "bg-secondary"
                : "bg-muted hover:bg-muted/80"
            } ${!showing && "cursor-pointer"}`}
          />
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-4">
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

export default MemoryTiles;
