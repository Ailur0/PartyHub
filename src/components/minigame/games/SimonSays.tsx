import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Player } from "@/pages/MiniGameMarathon";
import { Music } from "lucide-react";

type Props = {
  players: Player[];
  onComplete: (winnerId: string) => void;
};

const COLORS = ["red", "blue", "green", "yellow"];

const SimonSays = ({ players, onComplete }: Props) => {
  const [pattern, setPattern] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showing, setShowing] = useState(true);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    startNewRound();
  }, [currentPlayer]);

  const startNewRound = () => {
    const newPattern = [
      ...pattern,
      Math.floor(Math.random() * 4),
    ];
    setPattern(newPattern);
    setPlayerInput([]);
    setCurrentStep(0);
    setShowing(true);
    playPattern(newPattern);
  };

  const playPattern = async (pat: number[]) => {
    for (let i = 0; i < pat.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setActive(pat[i]);
      await new Promise((resolve) => setTimeout(resolve, 400));
      setActive(null);
    }
    setShowing(false);
  };

  const handleColorClick = (index: number) => {
    if (showing) return;

    setActive(index);
    setTimeout(() => setActive(null), 200);

    const newInput = [...playerInput, index];
    setPlayerInput(newInput);

    if (newInput[newInput.length - 1] !== pattern[newInput.length - 1]) {
      if (currentPlayer < players.length - 1) {
        setCurrentPlayer(currentPlayer + 1);
        setPattern([]);
      } else {
        const winner = players[currentPlayer === 0 ? players.length - 1 : currentPlayer - 1].id;
        setTimeout(() => onComplete(winner), 500);
      }
    } else if (newInput.length === pattern.length) {
      if (pattern.length >= 5) {
        setTimeout(() => onComplete(players[currentPlayer].id), 500);
      } else {
        setTimeout(() => startNewRound(), 1000);
      }
    }
  };

  const player = players[currentPlayer];

  return (
    <Card className="p-8 bg-gradient-card backdrop-blur border-2 border-border">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-black mb-2 flex items-center justify-center gap-2">
          <Music className="w-8 h-8 text-purple-500" />
          Simon Says
        </h2>
        <p className="text-xl text-muted-foreground mb-4">
          Repeat the pattern!
        </p>
        <div className="flex items-center justify-center gap-3 mb-2">
          <div
            className={`w-12 h-12 rounded-full ${player.color} flex items-center justify-center text-2xl`}
          >
            {player.avatar}
          </div>
          <p className="text-2xl font-bold">{player.name}</p>
        </div>
        <p className="text-xl text-primary">Level {pattern.length}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        {COLORS.map((color, index) => (
          <button
            key={color}
            onClick={() => handleColorClick(index)}
            disabled={showing}
            className={`aspect-square rounded-lg transition-all ${
              active === index ? "scale-110 brightness-150" : "scale-100"
            } ${
              color === "red"
                ? "bg-red-500"
                : color === "blue"
                ? "bg-blue-500"
                : color === "green"
                ? "bg-green-500"
                : "bg-yellow-500"
            } ${!showing && "hover:brightness-125 cursor-pointer"}`}
          />
        ))}
      </div>
    </Card>
  );
};

export default SimonSays;
