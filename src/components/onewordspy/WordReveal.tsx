import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { PlayerData } from "./OneWordSpyGame";

interface WordRevealProps {
  players: PlayerData[];
  currentIndex: number;
  onNext: () => void;
}

const WordReveal = ({ players, currentIndex, onNext }: WordRevealProps) => {
  const [wordRevealed, setWordRevealed] = useState(false);
  const currentPlayer = players[currentIndex];
  const isLastPlayer = currentIndex === players.length - 1;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-4 py-2 text-sm font-semibold mb-4">
          Word Reveal Phase
        </Badge>
        <h2 className="text-3xl font-bold mb-2">
          Player {currentIndex + 1} of {players.length}
        </h2>
        <p className="text-muted-foreground">
          Pass the device to <span className="font-bold text-foreground">{currentPlayer.name}</span>
        </p>
      </div>

      <Card className="p-8 space-y-6 bg-gradient-card backdrop-blur border-2">
        <div className="flex items-center justify-center">
          <div
            className={`w-24 h-24 rounded-full ${currentPlayer.color} flex items-center justify-center text-5xl`}
          >
            {currentPlayer.icon}
          </div>
        </div>

        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold">{currentPlayer.name}</h3>
          <p className="text-muted-foreground">
            {!wordRevealed
              ? "Click below to reveal your word. Remember: ONE WORD HINTS ONLY!"
              : "Memorize your word. Don't let others see it!"}
          </p>
        </div>

        {!wordRevealed ? (
          <Button
            onClick={() => setWordRevealed(true)}
            size="lg"
            className="w-full text-lg gap-2 bg-gradient-to-r from-yellow-500 to-orange-600 hover:opacity-90"
          >
            <Eye className="w-5 h-5" />
            Reveal My Word
          </Button>
        ) : (
          <div className="space-y-6">
            <div className="p-8 rounded-xl bg-background border-2 border-primary">
              <p className="text-sm text-muted-foreground mb-2 text-center">Your Word:</p>
              <p className="text-4xl font-black text-center text-primary">
                {currentPlayer.role === "spy" ? "SPY" : currentPlayer.word}
              </p>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Role: <span className={currentPlayer.role === "spy" ? "text-destructive font-bold" : "text-primary font-bold"}>
                  {currentPlayer.role === "spy" ? "🕵️ SPY" : "👤 CIVILIAN"}
                </span>
              </p>
              {currentPlayer.role === "spy" && (
                <p className="text-xs text-muted-foreground mt-2 text-center italic">
                  You don't know the word! Listen and blend in.
                </p>
              )}
            </div>

            <Button
              onClick={() => {
                setWordRevealed(false);
                onNext();
              }}
              size="lg"
              className="w-full text-lg gap-2"
            >
              {isLastPlayer ? "Start Giving Hints" : "Next Player"}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        )}

        <div className="flex items-center justify-center gap-2 pt-4">
          {players.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex
                  ? "bg-primary"
                  : index < currentIndex
                  ? "bg-primary/50"
                  : "bg-border"
              }`}
            />
          ))}
        </div>
      </Card>
    </div>
  );
};

export default WordReveal;
