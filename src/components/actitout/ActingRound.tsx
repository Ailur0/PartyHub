import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Timer, Eye, EyeOff, Check, X, Play } from "lucide-react";
import { PlayerData } from "@/pages/ActItOut";
import { PlayerScore } from "./ActItOutGame";
import PlayerAvatar from "@/components/undercover/PlayerAvatar";
import { toast } from "sonner";

const WORDS = {
  movies: {
    easy: ["Frozen", "Batman", "Shrek", "Spider-Man", "Finding Nemo", "Toy Story"],
    medium: ["Titanic", "The Lion King", "Star Wars", "Harry Potter", "Avatar", "Jurassic Park"],
    hard: ["The Matrix", "Pirates of the Caribbean", "Jaws", "Inception", "The Godfather", "Pulp Fiction"]
  },
  actions: {
    easy: ["Running", "Sleeping", "Eating", "Jumping", "Reading", "Singing"],
    medium: ["Swimming", "Dancing", "Cooking", "Writing", "Climbing", "Painting"],
    hard: ["Flying", "Surfing", "Fishing", "Meditating", "Skateboarding", "Juggling"]
  },
  objects: {
    easy: ["Phone", "Car", "Book", "Chair", "Clock", "Tree"],
    medium: ["Computer", "Guitar", "Camera", "Bicycle", "Umbrella", "Backpack"],
    hard: ["Piano", "Microwave", "Television", "Telescope", "Chandelier", "Compass"]
  }
};

interface ActingRoundProps {
  actor: PlayerData;
  allPlayers: PlayerScore[];
  roundTime: number;
  currentRound: number;
  totalRounds: number;
  category: "mixed" | "movies" | "actions" | "objects";
  difficulty: "easy" | "medium" | "hard";
  skipsRemaining: number;
  onRoundComplete: (wasGuessed: boolean, guessers: string[], wasSkipped: boolean) => void;
  onSkip: () => boolean;
}

const ActingRound = ({
  actor,
  allPlayers,
  roundTime,
  currentRound,
  totalRounds,
  category,
  difficulty,
  skipsRemaining,
  onRoundComplete,
  onSkip,
}: ActingRoundProps) => {
  const [word, setWord] = useState("");
  const [timeLeft, setTimeLeft] = useState(roundTime);
  const [showWord, setShowWord] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [guessers, setGuessers] = useState<string[]>([]);

  useEffect(() => {
    // Select random word from category and difficulty
    let wordList: string[] = [];
    
    if (category === "mixed") {
      // Combine all categories for the selected difficulty
      wordList = [
        ...WORDS.movies[difficulty],
        ...WORDS.actions[difficulty],
        ...WORDS.objects[difficulty]
      ];
    } else {
      wordList = WORDS[category][difficulty];
    }
    
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    setWord(randomWord);
    setTimeLeft(roundTime);
    setShowWord(false);
    setIsStarted(false);
    setGuessers([]);
  }, [actor, roundTime, category, difficulty]);

  useEffect(() => {
    if (!isStarted || timeLeft <= 0) {
      if (timeLeft === 0) {
        handleComplete();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isStarted]);

  const handleComplete = () => {
    onRoundComplete(guessers.length > 0, guessers, false);
  };

  const handleSkip = () => {
    const canSkip = onSkip();
    if (canSkip) {
      toast.info("Word skipped! New word coming up...");
      // Get a new word
      let wordList: string[] = [];
      
      if (category === "mixed") {
        wordList = [
          ...WORDS.movies[difficulty],
          ...WORDS.actions[difficulty],
          ...WORDS.objects[difficulty]
        ];
      } else {
        wordList = WORDS[category][difficulty];
      }
      
      const newWord = wordList[Math.floor(Math.random() * wordList.length)];
      setWord(newWord);
      setShowWord(false);
      setTimeout(() => setShowWord(true), 100);
    } else {
      toast.error("No skips remaining!");
    }
  };

  const toggleGuesser = (playerName: string) => {
    if (guessers.includes(playerName)) {
      setGuessers(guessers.filter(name => name !== playerName));
    } else {
      setGuessers([...guessers, playerName]);
    }
  };

  const startActing = () => {
    setIsStarted(true);
    setShowWord(true);
  };

  const nonActorPlayers = allPlayers.filter(p => p.name !== actor.name);

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
                icon={actor.avatar.icon}
                color={actor.avatar.color}
                size="sm"
              />
              <span className="font-semibold">{actor.name} is acting</span>
            </div>
            <Badge className="bg-accent text-accent-foreground capitalize">
              {category}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {difficulty}
            </Badge>
            {isStarted && (
              <Badge variant="secondary">
                {skipsRemaining} skip{skipsRemaining !== 1 ? 's' : ''} left
              </Badge>
            )}
          </div>
          {isStarted && (
            <Badge
              variant={timeLeft <= 10 ? "destructive" : "default"}
              className="text-lg px-4 py-2"
            >
              <Timer className="w-4 h-4 mr-2" />
              {timeLeft}s
            </Badge>
          )}
        </div>
      </Card>

      {/* Main Game Area */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Acting Area */}
        <div className="lg:col-span-2">
          <Card className="p-8 bg-gradient-card backdrop-blur border-2 border-border min-h-[500px] flex flex-col items-center justify-center">
            {!isStarted ? (
              <div className="text-center space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Ready to Act?</h3>
                  <p className="text-muted-foreground">
                    {actor.name}, you'll have {roundTime} seconds to act out the word
                  </p>
                  <p className="text-sm text-muted-foreground">
                    No talking, no sounds - just actions!
                  </p>
                </div>
                <Button
                  size="lg"
                  onClick={startActing}
                  className="bg-gradient-to-r from-accent to-blue-600 text-accent-foreground gap-2"
                >
                  <Play className="w-5 h-5" />
                  Start Acting
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-6 w-full">
                {showWord && (
                  <div className="space-y-4 animate-fade-in">
                    <Badge className="text-3xl px-8 py-4 bg-gradient-to-r from-accent to-blue-600 text-accent-foreground">
                      {word.toUpperCase()}
                    </Badge>
                    <p className="text-lg text-muted-foreground">
                      Act it out! No talking or sounds allowed.
                    </p>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex gap-4 justify-center pt-8 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowWord(!showWord)}
                    className="gap-2"
                  >
                    {showWord ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showWord ? "Hide" : "Show"} Word
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSkip}
                    disabled={skipsRemaining === 0}
                    className="gap-2"
                  >
                    <X className="w-4 h-4" />
                    Skip Word
                  </Button>
                  <Button
                    variant="default"
                    onClick={handleComplete}
                    disabled={timeLeft > 0}
                    className="gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Complete Round
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Players Panel */}
        <div className="lg:col-span-1">
          <Card className="p-4 bg-gradient-card backdrop-blur border-2 border-border h-full flex flex-col">
            <h3 className="text-xl font-bold mb-4">Who Guessed It?</h3>
            
            <div className="space-y-2 flex-1 overflow-y-auto">
              {nonActorPlayers.map((player) => {
                const hasGuessed = guessers.includes(player.name);
                return (
                  <button
                    key={player.name}
                    onClick={() => isStarted && toggleGuesser(player.name)}
                    disabled={!isStarted}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                      hasGuessed
                        ? "bg-green-500/20 border-green-500"
                        : isStarted
                        ? "bg-muted/50 border-border hover:border-accent"
                        : "bg-muted/30 border-border/50 cursor-not-allowed opacity-50"
                    }`}
                  >
                    <PlayerAvatar
                      icon={player.avatar.icon}
                      color={player.avatar.color}
                      size="sm"
                    />
                    <div className="flex-1 text-left">
                      <div className="font-medium">{player.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Score: {player.score}
                      </div>
                    </div>
                    {hasGuessed ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-border" />
                    )}
                  </button>
                );
              })}
            </div>

            {isStarted && (
              <div className="pt-4 border-t border-border mt-4">
                <p className="text-sm text-muted-foreground text-center">
                  Click on players who guessed correctly
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ActingRound;
