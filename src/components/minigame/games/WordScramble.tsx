import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Player } from "@/pages/MiniGameMarathon";
import { Shuffle } from "lucide-react";

type Props = {
  players: Player[];
  onComplete: (winnerId: string) => void;
};

const WORDS = [
  "PARTY", "GAME", "FRIEND", "LAUGH", "MUSIC",
  "DANCE", "HAPPY", "SMILE", "ENERGY", "CRAZY",
];

const WordScramble = ({ players, onComplete }: Props) => {
  const [word, setWord] = useState("");
  const [scrambled, setScrambled] = useState("");
  const [guess, setGuess] = useState("");
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(players.map((p) => [p.id, 0]))
  );
  const [round, setRound] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(0);

  useEffect(() => {
    generateWord();
  }, [round]);

  const generateWord = () => {
    const newWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    const scrambledWord = newWord
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
    setWord(newWord);
    setScrambled(scrambledWord);
    setGuess("");
  };

  const handleSubmit = () => {
    if (guess.toUpperCase() === word) {
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
          <Shuffle className="w-8 h-8 text-orange-500" />
          Word Scramble
        </h2>
        <p className="text-xl text-muted-foreground mb-4">
          Unscramble the word!
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

      <div className="text-center mb-8">
        <div className="text-7xl font-black text-primary mb-8 tracking-wider">
          {scrambled}
        </div>
        <div className="max-w-md mx-auto flex gap-4">
          <Input
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Type your answer..."
            className="text-2xl h-16 text-center"
            onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
          />
          <Button
            onClick={handleSubmit}
            className="h-16 px-8 text-xl font-bold"
            size="lg"
          >
            Submit
          </Button>
        </div>
      </div>

      <div className="flex justify-center gap-4">
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

export default WordScramble;
