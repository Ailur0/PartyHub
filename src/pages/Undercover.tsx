import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GameLobby from "@/components/undercover/GameLobby";
import UndercoverGame from "@/components/undercover/UndercoverGame";

type GamePhase = "lobby" | "playing" | "finished";

interface PlayerWithAvatar {
  name: string;
  icon: string;
  color: string;
}

const Undercover = () => {
  const navigate = useNavigate();
  const [gamePhase, setGamePhase] = useState<GamePhase>("lobby");
  const [players, setPlayers] = useState<PlayerWithAvatar[]>([]);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | "mixed">("mixed");
  const [mrWhiteMode, setMrWhiteMode] = useState(false);

  const startGame = (playersWithAvatars: PlayerWithAvatar[], selectedDifficulty: "easy" | "medium" | "hard" | "mixed", mrWhite: boolean) => {
    setPlayers(playersWithAvatars);
    setDifficulty(selectedDifficulty);
    setMrWhiteMode(mrWhite);
    setGamePhase("playing");
  };

  const resetGame = () => {
    setGamePhase("lobby");
    setPlayers([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/40 bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          <Badge className="bg-gradient-primary text-primary-foreground">
            <Users className="w-4 h-4 mr-2" />
            Undercover Mode
          </Badge>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {gamePhase === "lobby" && <GameLobby onStartGame={startGame} />}
        {gamePhase === "playing" && (
          <UndercoverGame players={players} difficulty={difficulty} mrWhiteMode={mrWhiteMode} onGameEnd={resetGame} />
        )}
      </main>
    </div>
  );
};

export default Undercover;
