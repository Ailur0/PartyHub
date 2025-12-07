import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, ArrowRight, User, Heart, Star, Sparkles, Crown, Shield, Sword, Target, Rocket, Zap } from "lucide-react";
import { PlayerData } from "./UndercoverGame";
import PlayerAvatar from "./PlayerAvatar";

const iconMap: Record<string, any> = {
  User, Heart, Star, Sparkles, Crown, Shield, Sword, Target, Rocket, Zap
};

interface WordRevealProps {
  players: PlayerData[];
  currentIndex: number;
  onNext: () => void;
}

const WordReveal = ({ players, currentIndex, onNext }: WordRevealProps) => {
  const [wordVisible, setWordVisible] = useState(false);
  const currentPlayer = players[currentIndex];

  const handleReveal = () => {
    setWordVisible(true);
  };

  const handleNext = () => {
    setWordVisible(false);
    onNext();
  };

  const IconComponent = currentPlayer.avatar ? iconMap[currentPlayer.avatar.icon] || User : User;

  return (
    <div className="space-y-6 text-center">
      <div className="space-y-2">
        <Badge className="bg-gradient-secondary text-secondary-foreground">
          Player {currentIndex + 1} of {players.length}
        </Badge>
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
          Look at your word and remember it. Don't show others!
        </p>
      </div>

      <Card className="p-12 bg-gradient-card backdrop-blur border-2 min-h-[300px] flex items-center justify-center">
        {!wordVisible ? (
          <Button
            size="lg"
            onClick={handleReveal}
            className="gap-2 text-lg px-8 py-6"
          >
            <Eye className="w-5 h-5" />
            Reveal My Word
          </Button>
        ) : (
          <div className="space-y-6">
            {currentPlayer.role === "mrwhite" ? (
              <>
                <div className="text-4xl font-black text-muted-foreground">
                  NO WORD
                </div>
                <Badge
                  variant="outline"
                  className="text-lg px-4 py-2 border-primary text-primary"
                >
                  👤 You are Mr. White!
                </Badge>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  You must figure out what the civilian word is by listening to descriptions. If you survive, you'll get a chance to guess!
                </p>
              </>
            ) : (
              <>
                <div className="text-6xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {currentPlayer.word}
                </div>
                <Badge
                  variant={currentPlayer.role === "spy" ? "destructive" : "secondary"}
                  className="text-lg px-4 py-2"
                >
                  {currentPlayer.role === "spy" ? "🕵️ You're the Spy!" : "👥 Civilian"}
                </Badge>
              </>
            )}
          </div>
        )}
      </Card>

      {wordVisible && (
        <Button
          size="lg"
          onClick={handleNext}
          className="gap-2"
        >
          {currentIndex < players.length - 1 ? "Next Player" : "Start Game"}
          <ArrowRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default WordReveal;
