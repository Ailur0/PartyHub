import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Player } from "@/pages/MiniGameMarathon";
import { Palette } from "lucide-react";

type Props = {
  players: Player[];
  onComplete: (winnerId: string) => void;
};

const COLORS = [
  { name: "RED", color: "bg-red-500" },
  { name: "BLUE", color: "bg-blue-500" },
  { name: "GREEN", color: "bg-green-500" },
  { name: "YELLOW", color: "bg-yellow-500" },
  { name: "PURPLE", color: "bg-purple-500" },
  { name: "ORANGE", color: "bg-orange-500" },
];

const ColorMatch = ({ players, onComplete }: Props) => {
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [wordColor, setWordColor] = useState(COLORS[0]);
  const [textColor, setTextColor] = useState(COLORS[1]);
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(players.map((p) => [p.id, 0]))
  );
  const [round, setRound] = useState(0);

  useEffect(() => {
    generateChallenge();
  }, [currentPlayer]);

  const generateChallenge = () => {
    const word = COLORS[Math.floor(Math.random() * COLORS.length)];
    let text = COLORS[Math.floor(Math.random() * COLORS.length)];
    while (text === word) {
      text = COLORS[Math.floor(Math.random() * COLORS.length)];
    }
    setWordColor(word);
    setTextColor(text);
  };

  const handleAnswer = (isColorMatch: boolean) => {
    const correct = isColorMatch === (wordColor.name === textColor.name);
    if (correct) {
      setScores((prev) => ({
        ...prev,
        [players[currentPlayer].id]: prev[players[currentPlayer].id] + 1,
      }));
    }

    if (round < players.length * 3 - 1) {
      setRound(round + 1);
      setCurrentPlayer((round + 1) % players.length);
    } else {
      const winner = Object.entries(scores).reduce((a, b) =>
        a[1] > b[1] ? a : b
      )[0];
      setTimeout(() => onComplete(winner), 500);
    }
  };

  const player = players[currentPlayer];

  return (
    <Card className="p-8 bg-gradient-card backdrop-blur border-2 border-border">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-black mb-2 flex items-center justify-center gap-2">
          <Palette className="w-8 h-8 text-pink-500" />
          Color Match
        </h2>
        <p className="text-xl text-muted-foreground mb-4">
          Does the word match the color?
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
        <div className={`text-8xl font-black ${textColor.color} bg-clip-text text-transparent`}>
          {wordColor.name}
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <Button
          onClick={() => handleAnswer(true)}
          className="w-48 h-20 text-2xl font-bold bg-green-500 hover:bg-green-600"
        >
          MATCH
        </Button>
        <Button
          onClick={() => handleAnswer(false)}
          className="w-48 h-20 text-2xl font-bold bg-red-500 hover:bg-red-600"
        >
          NO MATCH
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

export default ColorMatch;
