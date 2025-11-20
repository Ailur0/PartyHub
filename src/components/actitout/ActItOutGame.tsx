import { useState, useEffect } from "react";
import { PlayerData } from "@/pages/ActItOut";
import ActingRound from "./ActingRound";
import GameResults from "./GameResults";

interface ActItOutGameProps {
  players: PlayerData[];
  roundTime: number;
  rounds: number;
  category: "mixed" | "movies" | "actions" | "objects";
  difficulty: "easy" | "medium" | "hard";
  skipsPerPlayer: number;
  onGameEnd: () => void;
}

export interface PlayerScore extends PlayerData {
  score: number;
  successfulActs: number;
}

type GamePhase = "acting" | "results";

const ActItOutGame = ({ players, roundTime, rounds, category, difficulty, skipsPerPlayer, onGameEnd }: ActItOutGameProps) => {
  const [gamePhase, setGamePhase] = useState<GamePhase>("acting");
  const [currentRound, setCurrentRound] = useState(1);
  const [currentActorIndex, setCurrentActorIndex] = useState(0);
  const [playerScores, setPlayerScores] = useState<PlayerScore[]>(
    players.map(p => ({ ...p, score: 0, successfulActs: 0 }))
  );
  const [skipsRemaining, setSkipsRemaining] = useState<Record<string, number>>(
    Object.fromEntries(players.map(p => [p.name, skipsPerPlayer]))
  );

  const handleRoundComplete = (wasGuessed: boolean, guessers: string[], wasSkipped: boolean) => {
    // Award points based on difficulty and whether it was skipped
    const difficultyMultiplier = difficulty === "easy" ? 1 : difficulty === "medium" ? 1.5 : 2;
    const actorPoints = wasSkipped ? 0 : Math.round(30 * difficultyMultiplier);
    const guesserPoints = wasSkipped ? 0 : Math.round(15 * difficultyMultiplier);
    
    const updatedScores = playerScores.map((player) => {
      const isActor = player.name === players[currentActorIndex].name;
      const didGuess = guessers.includes(player.name);

      if (isActor && wasGuessed && !wasSkipped) {
        return {
          ...player,
          score: player.score + actorPoints,
          successfulActs: player.successfulActs + 1,
        };
      } else if (didGuess && !wasSkipped) {
        return {
          ...player,
          score: player.score + guesserPoints,
        };
      }
      return player;
    });

    setPlayerScores(updatedScores);

    // Move to next actor
    const nextActorIndex = currentActorIndex + 1;
    
    if (nextActorIndex >= players.length) {
      // Round complete, check if game is over
      if (currentRound >= rounds) {
        setGamePhase("results");
      } else {
        setCurrentRound(currentRound + 1);
        setCurrentActorIndex(0);
      }
    } else {
      setCurrentActorIndex(nextActorIndex);
    }
  };

  const handleSkip = () => {
    const actorName = players[currentActorIndex].name;
    if (skipsRemaining[actorName] > 0) {
      setSkipsRemaining(prev => ({
        ...prev,
        [actorName]: prev[actorName] - 1
      }));
      return true;
    }
    return false;
  };

  return (
    <div className="max-w-6xl mx-auto">
      {gamePhase === "acting" && (
        <ActingRound
          actor={players[currentActorIndex]}
          allPlayers={playerScores}
          roundTime={roundTime}
          currentRound={currentRound}
          totalRounds={rounds}
          category={category}
          difficulty={difficulty}
          skipsRemaining={skipsRemaining[players[currentActorIndex].name]}
          onRoundComplete={handleRoundComplete}
          onSkip={handleSkip}
        />
      )}

      {gamePhase === "results" && (
        <GameResults playerScores={playerScores} onPlayAgain={onGameEnd} />
      )}
    </div>
  );
};

export default ActItOutGame;
