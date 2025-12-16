import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SketchItLobby from "@/components/sketchit/SketchItLobby";
import SketchItGame from "@/components/sketchit/SketchItGame";

type GamePhase = "lobby" | "playing";

export interface PlayerData {
  name: string;
  avatar: {
    icon: string;
    color: string;
  };
}

const SketchIt = () => {
  const navigate = useNavigate();
  const [gamePhase, setGamePhase] = useState<GamePhase>("lobby");
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [roundTime, setRoundTime] = useState(60);
  const [rounds, setRounds] = useState(3);

  const startGame = (
    playersData: PlayerData[],
    selectedRoundTime: number,
    selectedRounds: number
  ) => {
    setPlayers(playersData);
    setRoundTime(selectedRoundTime);
    setRounds(selectedRounds);
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
          <Badge className="bg-gradient-secondary text-secondary-foreground">
            <Pencil className="w-4 h-4 mr-2" />
            Sketch It! Mode
          </Badge>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {gamePhase === "lobby" && <SketchItLobby onStartGame={startGame} />}
        {gamePhase === "playing" && (
          <SketchItGame
            players={players}
            roundTime={roundTime}
            rounds={rounds}
            onGameEnd={resetGame}
          />
        )}
      </main>
    </div>
  );
};

export default SketchIt;
