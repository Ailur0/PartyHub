import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import OneWordSpyLobby from "@/components/onewordspy/OneWordSpyLobby";
import OneWordSpyGame from "@/components/onewordspy/OneWordSpyGame";

type GamePhase = "lobby" | "playing" | "finished";

export interface PlayerWithAvatar {
  name: string;
  icon: string;
  color: string;
}

const OneWordSpy = () => {
  const navigate = useNavigate();
  const [gamePhase, setGamePhase] = useState<GamePhase>("lobby");
  const [players, setPlayers] = useState<PlayerWithAvatar[]>([]);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | "mixed">("mixed");
  const [hintTime, setHintTime] = useState(30);
  const [rounds, setRounds] = useState(3);

  const startGame = (
    playerList: PlayerWithAvatar[],
    selectedDifficulty: "easy" | "medium" | "hard" | "mixed",
    selectedHintTime: number,
    selectedRounds: number
  ) => {
    setPlayers(playerList);
    setDifficulty(selectedDifficulty);
    setHintTime(selectedHintTime);
    setRounds(selectedRounds);
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
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-4 py-2 text-lg font-bold">
            One Word Spy
          </Badge>
          <div className="w-20" />
        </div>
      </nav>

      {gamePhase === "lobby" && (
        <OneWordSpyLobby onStartGame={startGame} />
      )}

      {gamePhase === "playing" && (
        <OneWordSpyGame
          players={players}
          difficulty={difficulty}
          hintTime={hintTime}
          rounds={rounds}
          onGameEnd={resetGame}
        />
      )}
    </div>
  );
};

export default OneWordSpy;
