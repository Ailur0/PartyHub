import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, User, Heart, Star, Sparkles, Crown, Shield, Sword, Target, Rocket, Zap } from "lucide-react";
import { PlayerData } from "./UndercoverGame";
import PlayerAvatar from "./PlayerAvatar";

const iconMap: Record<string, any> = {
  User, Heart, Star, Sparkles, Crown, Shield, Sword, Target, Rocket, Zap
};

interface DescriptionPhaseProps {
  players: PlayerData[];
  round: number;
  onComplete: (descriptions: string[]) => void;
}

const DescriptionPhase = ({ players, round, onComplete }: DescriptionPhaseProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [descriptions, setDescriptions] = useState<string[]>(
    new Array(players.length).fill("")
  );
  const [timeLeft, setTimeLeft] = useState(60);

  const currentPlayer = players[currentIndex];

  useEffect(() => {
    setTimeLeft(60);
  }, [currentIndex]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleNext = () => {
    if (currentIndex < players.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete(descriptions);
    }
  };

  const updateDescription = (value: string) => {
    const newDescriptions = [...descriptions];
    newDescriptions[currentIndex] = value;
    setDescriptions(newDescriptions);
  };

  const IconComponent = currentPlayer.avatar ? iconMap[currentPlayer.avatar.icon] || User : User;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-4">
          <Badge className="bg-gradient-primary text-primary-foreground">
            Round {round} - Description Phase
          </Badge>
          <Badge 
            variant={timeLeft <= 10 ? "destructive" : "secondary"}
            className="gap-1"
          >
            <Clock className="w-3 h-3" />
            {timeLeft}s
          </Badge>
        </div>
        <div className="flex items-center justify-center gap-3">
          {currentPlayer.avatar && (
            <PlayerAvatar
              icon={IconComponent}
              color={currentPlayer.avatar.color}
              size="lg"
            />
          )}
          <h2 className="text-3xl font-bold">
            {currentPlayer.name}'s Turn
          </h2>
        </div>
        <p className="text-muted-foreground">
          Describe your word in one sentence. Be clever!
        </p>
      </div>

      <Card className="p-8 bg-gradient-card backdrop-blur border-2 space-y-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">Your word is:</p>
          <div className="text-4xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {currentPlayer.word}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Your Description</label>
          <Textarea
            placeholder="Describe your word without being too obvious..."
            value={descriptions[currentIndex]}
            onChange={(e) => updateDescription(e.target.value)}
            className="min-h-[120px] resize-none"
          />
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Player {currentIndex + 1} of {players.length}</span>
          <span>{descriptions[currentIndex].length} characters</span>
        </div>
      </Card>

      <Button
        size="lg"
        onClick={handleNext}
        disabled={!descriptions[currentIndex].trim()}
        className="w-full gap-2"
      >
        {currentIndex < players.length - 1 ? "Next Player" : "Start Voting"}
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default DescriptionPhase;
