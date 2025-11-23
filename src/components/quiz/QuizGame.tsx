import { useState, useEffect } from "react";
import { PlayerData } from "@/pages/Quiz";
import QuestionRound from "./QuestionRound";
import GameResults from "./GameResults";

interface QuizGameProps {
  players: PlayerData[];
  questionTime: number;
  questionCount: number;
  category: "mixed" | "science" | "history" | "entertainment" | "sports";
  difficulty: "easy" | "medium" | "hard";
  onGameEnd: () => void;
}

export interface PlayerScore extends PlayerData {
  score: number;
  correctAnswers: number;
}

type GamePhase = "question" | "results";

const QuizGame = ({ players, questionTime, questionCount, category, difficulty, onGameEnd }: QuizGameProps) => {
  const [gamePhase, setGamePhase] = useState<GamePhase>("question");
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [playerScores, setPlayerScores] = useState<PlayerScore[]>(
    players.map(p => ({ ...p, score: 0, correctAnswers: 0 }))
  );

  const handleQuestionComplete = (correctPlayers: string[]) => {
    // Award points based on difficulty
    const pointsMap = { easy: 100, medium: 200, hard: 300 };
    const points = pointsMap[difficulty];

    const updatedScores = playerScores.map((player) => {
      if (correctPlayers.includes(player.name)) {
        return {
          ...player,
          score: player.score + points,
          correctAnswers: player.correctAnswers + 1,
        };
      }
      return player;
    });

    setPlayerScores(updatedScores);

    // Check if quiz is complete
    if (currentQuestion >= questionCount) {
      setGamePhase("results");
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {gamePhase === "question" && (
        <QuestionRound
          players={playerScores}
          questionTime={questionTime}
          currentQuestion={currentQuestion}
          totalQuestions={questionCount}
          category={category}
          difficulty={difficulty}
          onQuestionComplete={handleQuestionComplete}
        />
      )}

      {gamePhase === "results" && (
        <GameResults playerScores={playerScores} onPlayAgain={onGameEnd} />
      )}
    </div>
  );
};

export default QuizGame;
