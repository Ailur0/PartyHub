import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Player } from "@/pages/MiniGameMarathon";
import { Calculator } from "lucide-react";

type Props = {
  players: Player[];
  onComplete: (winnerId: string) => void;
};

const MathQuick = ({ players, onComplete }: Props) => {
  const [question, setQuestion] = useState({ text: "", answer: 0 });
  const [options, setOptions] = useState<number[]>([]);
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(players.map((p) => [p.id, 0]))
  );
  const [round, setRound] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(0);

  useEffect(() => {
    generateQuestion();
  }, [round]);

  const generateQuestion = () => {
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;
    const ops = ["+", "-", "×"];
    const op = ops[Math.floor(Math.random() * ops.length)];

    let answer = 0;
    let text = "";

    if (op === "+") {
      answer = num1 + num2;
      text = `${num1} + ${num2}`;
    } else if (op === "-") {
      answer = num1 - num2;
      text = `${num1} - ${num2}`;
    } else {
      answer = num1 * num2;
      text = `${num1} × ${num2}`;
    }

    const wrongOptions = [
      answer + Math.floor(Math.random() * 5) + 1,
      answer - Math.floor(Math.random() * 5) - 1,
      answer + Math.floor(Math.random() * 10) + 5,
    ];

    const allOptions = [answer, ...wrongOptions].sort(() => Math.random() - 0.5);

    setQuestion({ text, answer });
    setOptions(allOptions);
  };

  const handleAnswer = (selected: number) => {
    if (selected === question.answer) {
      setScores((prev) => ({
        ...prev,
        [players[currentPlayer].id]: prev[players[currentPlayer].id] + 1,
      }));
    }

    if (round < players.length * 5 - 1) {
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
          <Calculator className="w-8 h-8 text-blue-500" />
          Math Quick
        </h2>
        <p className="text-xl text-muted-foreground mb-4">
          Solve it fast!
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
        <div className="text-7xl font-black text-primary mb-8">
          {question.text}
        </div>
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          {options.map((option) => (
            <Button
              key={option}
              onClick={() => handleAnswer(option)}
              className="h-24 text-4xl font-bold"
              size="lg"
            >
              {option}
            </Button>
          ))}
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

export default MathQuick;
