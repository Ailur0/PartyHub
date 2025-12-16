import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Drama } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ActItOutLobby from "@/components/actitout/ActItOutLobby";
import ActItOutGame from "@/components/actitout/ActItOutGame";

type GamePhase = "lobby" | "playing";

export interface PlayerData {
  name: string;
  avatar: {
    icon: string;
    color: string;
  };
}

const ActItOut = () => {
  const navigate = useNavigate();
  const [gamePhase, setGamePhase] = useState<GamePhase>("lobby");
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [roundTime, setRoundTime] = useState(60);
  const [rounds, setRounds] = useState(3);
  const [category, setCategory] = useState<"mixed" | "movies" | "actions" | "objects">("mixed");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [skipsPerPlayer, setSkipsPerPlayer] = useState(1);

  const startGame = (
    playersData: PlayerData[],
    selectedRoundTime: number,
    selectedRounds: number,
    selectedCategory: "mixed" | "movies" | "actions" | "objects",
    selectedDifficulty: "easy" | "medium" | "hard",
    selectedSkipsPerPlayer: number
  ) => {
    setPlayers(playersData);
    setRoundTime(selectedRoundTime);
    setRounds(selectedRounds);
    setCategory(selectedCategory);
    setDifficulty(selectedDifficulty);
    setSkipsPerPlayer(selectedSkipsPerPlayer);
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
          <Badge className="bg-gradient-to-r from-accent to-blue-600 text-accent-foreground">
            <Drama className="w-4 h-4 mr-2" />
            Act It Out Mode
          </Badge>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {gamePhase === "lobby" && <ActItOutLobby onStartGame={startGame} />}
        {gamePhase === "playing" && (
          <ActItOutGame
            players={players}
            roundTime={roundTime}
            rounds={rounds}
            category={category}
            difficulty={difficulty}
            skipsPerPlayer={skipsPerPlayer}
            onGameEnd={resetGame}
          />
        )}
      </main>
    </div>
  );
};

export default ActItOut;
