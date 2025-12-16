import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ObstacleDashLobby from "@/components/obstacledash/ObstacleDashLobby";
import ObstacleDashGame from "@/components/obstacledash/ObstacleDashGame";

type GamePhase = "lobby" | "playing" | "finished";

export interface PlayerWithAvatar {
  name: string;
  icon: string;
  color: string;
}

const ObstacleDash = () => {
  const navigate = useNavigate();
  const [gamePhase, setGamePhase] = useState<GamePhase>("lobby");
  const [players, setPlayers] = useState<PlayerWithAvatar[]>([]);
  const [raceLength, setRaceLength] = useState(1000);
  const [obstacleCount, setObstacleCount] = useState(15);

  const startGame = (
    playerList: PlayerWithAvatar[],
    selectedRaceLength: number,
    selectedObstacleCount: number
  ) => {
    setPlayers(playerList);
    setRaceLength(selectedRaceLength);
    setObstacleCount(selectedObstacleCount);
    setGamePhase("playing");
  };

  const resetGame = () => {
    setGamePhase("lobby");
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 text-lg font-bold">
            Obstacle Dash
          </Badge>
          <div className="w-20" />
        </div>
      </nav>

      {gamePhase === "lobby" && (
        <ObstacleDashLobby onStartGame={startGame} />
      )}

      {gamePhase === "playing" && (
        <ObstacleDashGame
          players={players}
          raceLength={raceLength}
          obstacleCount={obstacleCount}
          onGameEnd={resetGame}
        />
      )}
    </div>
  );
};

export default ObstacleDash;
