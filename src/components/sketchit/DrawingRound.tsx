import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Timer, Eye, EyeOff } from "lucide-react";
import DrawingCanvas from "./DrawingCanvas";
import GuessingInterface from "./GuessingInterface";
import { PlayerData } from "@/pages/SketchIt";
import { PlayerScore } from "./SketchItGame";
import PlayerAvatar from "@/components/undercover/PlayerAvatar";

const WORDS = [
  "cat", "dog", "house", "tree", "car", "sun", "moon", "star", "flower", "bird",
  "fish", "apple", "banana", "pizza", "cake", "book", "phone", "computer", "guitar", "piano",
  "bicycle", "boat", "airplane", "train", "rocket", "rainbow", "cloud", "mountain", "beach", "island",
  "castle", "bridge", "crown", "heart", "smile", "glasses", "hat", "shoe", "umbrella", "clock"
];

interface DrawingRoundProps {
  drawer: PlayerData;
  allPlayers: PlayerScore[];
  roundTime: number;
  currentRound: number;
  totalRounds: number;
  onRoundComplete: (guessedPlayers: string[], word: string) => void;
}

const DrawingRound = ({
  drawer,
  allPlayers,
  roundTime,
  currentRound,
  totalRounds,
  onRoundComplete,
}: DrawingRoundProps) => {
  const [word, setWord] = useState("");
  const [timeLeft, setTimeLeft] = useState(roundTime);
  const [guessedPlayers, setGuessedPlayers] = useState<string[]>([]);
  const [showWord, setShowWord] = useState(false);
  const [wordRevealed, setWordRevealed] = useState(false);

  useEffect(() => {
    // Select random word
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setWord(randomWord);
    setTimeLeft(roundTime);
    setGuessedPlayers([]);
    setShowWord(false);
    setWordRevealed(false);
  }, [drawer, roundTime]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onRoundComplete(guessedPlayers, word);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, guessedPlayers, word, onRoundComplete]);

  const handleCorrectGuess = (playerName: string) => {
    if (!guessedPlayers.includes(playerName) && playerName !== drawer.name) {
      const newGuessedPlayers = [...guessedPlayers, playerName];
      setGuessedPlayers(newGuessedPlayers);

      // If all players guessed, end round early
      const nonDrawers = allPlayers.filter(p => p.name !== drawer.name);
      if (newGuessedPlayers.length === nonDrawers.length) {
        setTimeout(() => {
          onRoundComplete(newGuessedPlayers, word);
        }, 1000);
      }
    }
  };

  const revealWord = () => {
    setWordRevealed(true);
  };

  const toggleWordVisibility = () => {
    setShowWord(!showWord);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="p-4 bg-gradient-card backdrop-blur border-2 border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge variant="secondary">
              Round {currentRound}/{totalRounds}
            </Badge>
            <div className="flex items-center gap-2">
              <PlayerAvatar
                icon={drawer.avatar.icon}
                color={drawer.avatar.color}
                size="sm"
              />
              <span className="font-semibold">{drawer.name} is drawing</span>
            </div>
          </div>
          <Badge
            variant={timeLeft <= 10 ? "destructive" : "default"}
            className="text-lg px-4 py-2"
          >
            <Timer className="w-4 h-4 mr-2" />
            {timeLeft}s
          </Badge>
        </div>
      </Card>

      {/* Main Game Area */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Drawing Canvas */}
        <div className="lg:col-span-2">
          <Card className="p-4 bg-gradient-card backdrop-blur border-2 border-border">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold">Drawing Canvas</h3>
                {!wordRevealed && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleWordVisibility}
                    className="gap-2"
                  >
                    {showWord ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showWord ? "Hide" : "Show"} Word
                  </Button>
                )}
              </div>
              {showWord && !wordRevealed && (
                <Badge className="text-lg px-4 py-2 bg-primary text-primary-foreground">
                  Word: {word.toUpperCase()}
                </Badge>
              )}
            </div>
            <DrawingCanvas />
          </Card>
        </div>

        {/* Guessing Interface */}
        <div className="lg:col-span-1">
          <GuessingInterface
            word={word}
            players={allPlayers}
            drawer={drawer}
            guessedPlayers={guessedPlayers}
            onCorrectGuess={handleCorrectGuess}
            onRevealWord={revealWord}
            wordRevealed={wordRevealed}
          />
        </div>
      </div>
    </div>
  );
};

export default DrawingRound;
