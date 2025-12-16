import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import QuizLobby from "@/components/quiz/QuizLobby";
import QuizGame from "@/components/quiz/QuizGame";

type GamePhase = "lobby" | "playing";

export interface PlayerData {
  name: string;
  avatar: {
    icon: string;
    color: string;
  };
}

const Quiz = () => {
  const navigate = useNavigate();
  const [gamePhase, setGamePhase] = useState<GamePhase>("lobby");
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [questionTime, setQuestionTime] = useState(15);
  const [questionCount, setQuestionCount] = useState(10);
  const [category, setCategory] = useState<"mixed" | "science" | "history" | "entertainment" | "sports">("mixed");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");

  const startGame = (
    playersData: PlayerData[],
    selectedQuestionTime: number,
    selectedQuestionCount: number,
    selectedCategory: "mixed" | "science" | "history" | "entertainment" | "sports",
    selectedDifficulty: "easy" | "medium" | "hard"
  ) => {
    setPlayers(playersData);
    setQuestionTime(selectedQuestionTime);
    setQuestionCount(selectedQuestionCount);
    setCategory(selectedCategory);
    setDifficulty(selectedDifficulty);
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
          <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <Brain className="w-4 h-4 mr-2" />
            Quiz Battle Mode
          </Badge>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {gamePhase === "lobby" && <QuizLobby onStartGame={startGame} />}
        {gamePhase === "playing" && (
          <QuizGame
            players={players}
            questionTime={questionTime}
            questionCount={questionCount}
            category={category}
            difficulty={difficulty}
            onGameEnd={resetGame}
          />
        )}
      </main>
    </div>
  );
};

export default Quiz;
