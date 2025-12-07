import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Send } from "lucide-react";
import { PlayerData } from "./UndercoverGame";

interface MrWhiteGuessProps {
  mrWhite: PlayerData;
  onGuess: (guess: string) => void;
}

const MrWhiteGuess = ({ mrWhite, onGuess }: MrWhiteGuessProps) => {
  const [guess, setGuess] = useState("");

  const handleSubmit = () => {
    if (guess.trim()) {
      onGuess(guess);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Badge className="bg-gradient-primary text-primary-foreground">
          Mr. White's Final Chance
        </Badge>
        <h2 className="text-3xl font-bold">
          {mrWhite.name}, Make Your Guess!
        </h2>
        <p className="text-muted-foreground">
          You survived! Now guess what the civilian word was to win the game.
        </p>
      </div>

      <Card className="p-8 bg-gradient-card backdrop-blur border-2 space-y-6">
        <div className="text-center space-y-4">
          <Lightbulb className="w-16 h-16 mx-auto text-primary" />
          <p className="text-lg">
            Based on all the descriptions you heard, what do you think the civilian word was?
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Your Guess</label>
          <Input
            placeholder="Enter the civilian word..."
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
            className="text-lg text-center"
            autoFocus
          />
        </div>

        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={!guess.trim()}
          className="w-full gap-2"
        >
          <Send className="w-4 h-4" />
          Submit Guess
        </Button>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        Guess correctly to win the game for Mr. White!
      </div>
    </div>
  );
};

export default MrWhiteGuess;
