import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Player } from "@/pages/MiniGameMarathon";
import { Music2 } from "lucide-react";

type Props = {
  players: Player[];
  onComplete: (winnerId: string) => void;
};

const RhythmTap = ({ players, onComplete }: Props) => {
  const [beats, setBeats] = useState<boolean[]>([]);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [playerTaps, setPlayerTaps] = useState<number[]>([]);
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(players.map((p) => [p.id, 0]))
  );
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    const pattern = Array.from({ length: 8 }, () => Math.random() > 0.4);
    setBeats(pattern);
    playPattern(pattern);
  }, [currentPlayer]);

  const playPattern = async (pattern: boolean[]) => {
    for (let i = 0; i < pattern.length; i++) {
      setCurrentBeat(i);
      await new Promise((resolve) => setTimeout(resolve, 600));
    }
    setCurrentBeat(-1);
    setListening(true);
    setPlayerTaps([]);
  };

  useEffect(() => {
    if (!listening || currentBeat >= 0) return;

    const timer = setTimeout(() => {
      evaluatePerformance();
    }, 600 * 8);

    return () => clearTimeout(timer);
  }, [listening]);

  const evaluatePerformance = () => {
    let correctTaps = 0;
    beats.forEach((shouldTap, i) => {
      const tapped = playerTaps.includes(i);
      if (shouldTap === tapped) correctTaps++;
    });

    setScores((prev) => ({
      ...prev,
      [players[currentPlayer].id]: prev[players[currentPlayer].id] + correctTaps,
    }));

    if (currentPlayer < players.length - 1) {
      setCurrentPlayer(currentPlayer + 1);
      setListening(false);
    } else {
      const winner = Object.entries(scores).reduce((a, b) =>
        a[1] > b[1] ? a : b
      )[0];
      setTimeout(() => onComplete(winner), 500);
    }
  };

  const handleTap = () => {
    if (listening) {
      const beatIndex = Math.floor((Date.now() % (600 * 8)) / 600);
      setPlayerTaps((prev) => [...prev, beatIndex]);
    }
  };

  const player = players[currentPlayer];

  return (
    <Card className="p-8 bg-gradient-card backdrop-blur border-2 border-border">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-black mb-2 flex items-center justify-center gap-2">
          <Music2 className="w-8 h-8 text-green-500" />
          Rhythm Tap
        </h2>
        <p className="text-xl text-muted-foreground mb-4">
          {listening ? "Repeat the rhythm!" : "Watch carefully..."}
        </p>
        <div className="flex items-center justify-center gap-3">
          <div
            className={`w-12 h-12 rounded-full ${player.color} flex items-center justify-center text-2xl`}
          >
            {player.avatar}
          </div>
          <p className="text-2xl font-bold">{player.name}</p>
        </div>
      </div>

      <div className="flex justify-center gap-2 mb-8">
        {beats.map((beat, index) => (
          <div
            key={index}
            className={`w-16 h-16 rounded-lg transition-all ${
              currentBeat === index && beat
                ? "bg-primary scale-125"
                : currentBeat === index
                ? "bg-muted scale-110"
                : beat
                ? "bg-primary/30"
                : "bg-muted"
            }`}
          />
        ))}
      </div>

      <div className="flex justify-center">
        <Button
          onClick={handleTap}
          disabled={!listening}
          className="w-64 h-64 rounded-full text-4xl font-black"
          size="lg"
        >
          {listening ? "TAP!" : "..."}
        </Button>
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

export default RhythmTap;
