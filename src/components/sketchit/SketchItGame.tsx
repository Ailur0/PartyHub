import { useState, useEffect } from "react";
import { PlayerData } from "@/pages/SketchIt";
import DrawingRound from "./DrawingRound";
import GameResults from "./GameResults";

interface SketchItGameProps {
  players: PlayerData[];
  roundTime: number;
  rounds: number;
  onGameEnd: () => void;
}

export interface PlayerScore extends PlayerData {
  score: number;
  correctGuesses: number;
}

type GamePhase = "drawing" | "results";

const SketchItGame = ({ players, roundTime, rounds, onGameEnd }: SketchItGameProps) => {
  const [gamePhase, setGamePhase] = useState<GamePhase>("drawing");
  const [currentRound, setCurrentRound] = useState(1);
  const [currentDrawerIndex, setCurrentDrawerIndex] = useState(0);
  const [playerScores, setPlayerScores] = useState<PlayerScore[]>(
    players.map(p => ({ ...p, score: 0, correctGuesses: 0 }))
  );

  const handleRoundComplete = (guessedPlayers: string[], word: string) => {
    // Award points: drawer gets 10 points per correct guess, guessers get 20 points
    const updatedScores = playerScores.map((player) => {
      const isDrawer = player.name === players[currentDrawerIndex].name;
      const didGuess = guessedPlayers.includes(player.name);

      if (isDrawer) {
        return {
          ...player,
          score: player.score + (guessedPlayers.length * 10),
        };
      } else if (didGuess) {
        return {
          ...player,
          score: player.score + 20,
          correctGuesses: player.correctGuesses + 1,
        };
      }
      return player;
    });

    setPlayerScores(updatedScores);

    // Move to next drawer
    const nextDrawerIndex = currentDrawerIndex + 1;
    
    if (nextDrawerIndex >= players.length) {
      // Round complete, check if game is over
      if (currentRound >= rounds) {
        setGamePhase("results");
      } else {
        setCurrentRound(currentRound + 1);
        setCurrentDrawerIndex(0);
      }
    } else {
      setCurrentDrawerIndex(nextDrawerIndex);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {gamePhase === "drawing" && (
        <DrawingRound
          drawer={players[currentDrawerIndex]}
          allPlayers={playerScores}
          roundTime={roundTime}
          currentRound={currentRound}
          totalRounds={rounds}
          onRoundComplete={handleRoundComplete}
        />
      )}

      {gamePhase === "results" && (
        <GameResults playerScores={playerScores} onPlayAgain={onGameEnd} />
      )}
    </div>
  );
};

export default SketchItGame;
