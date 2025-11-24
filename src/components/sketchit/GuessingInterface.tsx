import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, Check, Eye } from "lucide-react";
import { PlayerData } from "@/pages/SketchIt";
import { PlayerScore } from "./SketchItGame";
import PlayerAvatar from "@/components/undercover/PlayerAvatar";
import { toast } from "sonner";

interface GuessingInterfaceProps {
  word: string;
  players: PlayerScore[];
  drawer: PlayerData;
  guessedPlayers: string[];
  onCorrectGuess: (playerName: string) => void;
  onRevealWord: () => void;
  wordRevealed: boolean;
}

const GuessingInterface = ({
  word,
  players,
  drawer,
  guessedPlayers,
  onCorrectGuess,
  onRevealWord,
  wordRevealed,
}: GuessingInterfaceProps) => {
  const [guess, setGuess] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<string>("");

  const handleGuess = () => {
    if (!guess.trim() || !selectedPlayer) return;

    const normalizedGuess = guess.toLowerCase().trim();
    const normalizedWord = word.toLowerCase().trim();

    if (normalizedGuess === normalizedWord) {
      onCorrectGuess(selectedPlayer);
      toast.success(`${selectedPlayer} guessed correctly!`);
      setGuess("");
    } else {
      toast.error("Wrong guess!");
      setGuess("");
    }
  };

  const nonDrawerPlayers = players.filter(p => p.name !== drawer.name);

  return (
    <Card className="p-4 bg-gradient-card backdrop-blur border-2 border-border h-full flex flex-col">
      <h3 className="text-xl font-bold mb-4">Guessing</h3>

      {/* Players Status */}
      <div className="space-y-2 mb-4 flex-1 overflow-y-auto">
        {nonDrawerPlayers.map((player) => {
          const hasGuessed = guessedPlayers.includes(player.name);
          return (
            <div
              key={player.name}
              onClick={() => !hasGuessed && setSelectedPlayer(player.name)}
              className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                hasGuessed
                  ? "bg-green-500/20 border-green-500/50"
                  : selectedPlayer === player.name
                  ? "bg-primary/20 border-primary"
                  : "bg-muted/50 border-border hover:border-primary/50"
              }`}
            >
              <PlayerAvatar
                icon={player.avatar.icon}
                color={player.avatar.color}
                size="sm"
              />
              <div className="flex-1">
                <div className="font-medium">{player.name}</div>
                <div className="text-xs text-muted-foreground">
                  Score: {player.score}
                </div>
              </div>
              {hasGuessed && (
                <Badge className="bg-green-500 text-white">
                  <Check className="w-3 h-3 mr-1" />
                  Guessed!
                </Badge>
              )}
            </div>
          );
        })}
      </div>

      {/* Guess Input */}
      <div className="space-y-3 pt-4 border-t border-border">
        {selectedPlayer && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Guessing for:</span>
            <Badge variant="secondary">{selectedPlayer}</Badge>
          </div>
        )}
        
        <div className="flex gap-2">
          <Input
            placeholder="Enter your guess..."
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleGuess()}
            disabled={!selectedPlayer || guessedPlayers.includes(selectedPlayer)}
          />
          <Button
            onClick={handleGuess}
            disabled={!guess.trim() || !selectedPlayer || guessedPlayers.includes(selectedPlayer)}
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {!wordRevealed && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRevealWord}
            className="w-full gap-2"
          >
            <Eye className="w-4 h-4" />
            Give Up & Reveal Word
          </Button>
        )}

        {wordRevealed && (
          <Badge variant="destructive" className="w-full justify-center text-lg py-2">
            Word was: {word.toUpperCase()}
          </Badge>
        )}
      </div>
    </Card>
  );
};

export default GuessingInterface;
