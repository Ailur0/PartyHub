import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Clock, Users, AlertCircle } from "lucide-react";
import { PlayerData } from "./OneWordSpyGame";
import { toast } from "sonner";

interface OneWordHintPhaseProps {
  players: PlayerData[];
  hintTime: number;
  currentRound: number;
  totalRounds: number;
  onComplete: () => void;
}

interface PlayerHint {
  playerName: string;
  hint: string;
}

const OneWordHintPhase = ({
  players,
  hintTime,
  currentRound,
  totalRounds,
  onComplete,
}: OneWordHintPhaseProps) => {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentHint, setCurrentHint] = useState("");
  const [allHints, setAllHints] = useState<PlayerHint[]>([]);
  const [timeLeft, setTimeLeft] = useState(hintTime);
  const [isTimerActive, setIsTimerActive] = useState(true);

  const currentPlayer = players[currentPlayerIndex];

  useEffect(() => {
    if (!isTimerActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSkipHint();
          return hintTime;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isTimerActive]);

  const handleSkipHint = () => {
    const hint: PlayerHint = {
      playerName: currentPlayer.name,
      hint: currentHint.trim() || "(skipped)",
    };
    setAllHints([...allHints, hint]);
    setCurrentHint("");
    setTimeLeft(hintTime);

    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
    } else {
      onComplete();
    }
  };

  const handleSubmitHint = () => {
    const trimmedHint = currentHint.trim();
    
    if (!trimmedHint) {
      toast.error("Please enter a hint");
      return;
    }

    // Check if it's ONE WORD
    const words = trimmedHint.split(/\s+/);
    if (words.length > 1) {
      toast.error("ONE WORD ONLY! No phrases allowed.");
      return;
    }

    const hint: PlayerHint = {
      playerName: currentPlayer.name,
      hint: trimmedHint,
    };
    setAllHints([...allHints, hint]);
    setCurrentHint("");
    setTimeLeft(hintTime);

    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
    } else {
      onComplete();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmitHint();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-4 py-2 text-sm font-semibold">
            Round {currentRound} of {totalRounds}
          </Badge>
          <h2 className="text-3xl font-bold">One Word Hint Phase</h2>
          <div className="flex items-center justify-center gap-4 text-muted-foreground">
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              {currentPlayerIndex + 1} / {players.length}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {timeLeft}s
            </span>
          </div>
        </div>

        <Card className="p-8 space-y-6 bg-gradient-card backdrop-blur border-2">
          <div className="flex flex-col items-center gap-4">
            <div
              className={`w-20 h-20 rounded-full ${currentPlayer.color} flex items-center justify-center text-4xl`}
            >
              {currentPlayer.icon}
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold">{currentPlayer.name}'s Turn</h3>
              <p className="text-muted-foreground mt-2">
                Give ONE WORD that describes your word
              </p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-yellow-600 dark:text-yellow-400">
                Rules:
              </p>
              <ul className="text-muted-foreground mt-1 space-y-1">
                <li>• ONE WORD ONLY - no phrases or multiple words</li>
                <li>• No part of the actual word</li>
                <li>• No gestures or sounds</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            <Input
              value={currentHint}
              onChange={(e) => setCurrentHint(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your ONE WORD hint..."
              className="text-lg h-14"
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                onClick={handleSubmitHint}
                className="flex-1 text-lg h-12 bg-gradient-to-r from-yellow-500 to-orange-600 hover:opacity-90"
              >
                Submit Hint
              </Button>
              <Button
                onClick={handleSkipHint}
                variant="outline"
                className="h-12"
              >
                Skip
              </Button>
            </div>
          </div>

          <div className="w-full bg-border rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-yellow-500 to-orange-600 h-full transition-all duration-1000"
              style={{ width: `${(timeLeft / hintTime) * 100}%` }}
            />
          </div>
        </Card>

        {allHints.length > 0 && (
          <Card className="p-6 bg-background/50 backdrop-blur border">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Hints Given ({allHints.length})
            </h3>
            <div className="grid gap-2">
              {allHints.map((hint, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 rounded-lg bg-background border border-border"
                >
                  <span className="font-semibold">{hint.playerName}</span>
                  <Badge variant="secondary" className="text-lg px-4 py-1">
                    {hint.hint}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OneWordHintPhase;
