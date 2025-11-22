import { useState, useEffect } from "react";
import { PlayerWithAvatar } from "@/pages/OneWordSpy";
import { assignWords } from "@/utils/gameLogic";
import WordReveal from "./WordReveal";
import OneWordHintPhase from "./OneWordHintPhase";
import VotingPhase from "./VotingPhase";
import GameResults from "./GameResults";

interface OneWordSpyGameProps {
  players: PlayerWithAvatar[];
  difficulty: "easy" | "medium" | "hard" | "mixed";
  hintTime: number;
  rounds: number;
  onGameEnd: () => void;
}

export interface PlayerData extends PlayerWithAvatar {
  word: string;
  role: "civilian" | "spy";
  isAlive: boolean;
}

type GamePhase = "wordReveal" | "hints" | "voting" | "results";

const OneWordSpyGame = ({ 
  players, 
  difficulty, 
  hintTime,
  rounds,
  onGameEnd 
}: OneWordSpyGameProps) => {
  const [gamePhase, setGamePhase] = useState<GamePhase>("wordReveal");
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [playerData, setPlayerData] = useState<PlayerData[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [civilianWord, setCivilianWord] = useState("");

  useEffect(() => {
    const assigned = assignWords(
      players.map((p) => p.name),
      difficulty,
      false // No Mr. White in One Word Spy
    );

    const enrichedData: PlayerData[] = assigned.map((p, index) => ({
      ...players[index],
      word: p.word,
      role: p.role === "spy" ? "spy" : "civilian",
      isAlive: true,
    }));

    setPlayerData(enrichedData);
    const civilian = enrichedData.find((p) => p.role === "civilian");
    if (civilian) setCivilianWord(civilian.word);
  }, [players, difficulty, currentRound]);

  const handleWordsSeen = () => {
    setGamePhase("hints");
    setCurrentPlayerIndex(0);
  };

  const handleHintsComplete = () => {
    setGamePhase("voting");
  };

  const handleVotingComplete = (votedOutPlayerId: string) => {
    const votedOutPlayer = playerData.find((p) => p.name === votedOutPlayerId);
    
    const updatedPlayers = playerData.map((p) =>
      p.name === votedOutPlayerId ? { ...p, isAlive: false } : p
    );
    setPlayerData(updatedPlayers);

    const alivePlayers = updatedPlayers.filter((p) => p.isAlive);
    const aliveCivilians = alivePlayers.filter((p) => p.role === "civilian");
    const aliveSpy = alivePlayers.find((p) => p.role === "spy");

    if (!aliveSpy || votedOutPlayer?.role === "spy") {
      // Spy eliminated - civilians win
      setGamePhase("results");
    } else if (aliveCivilians.length <= 1) {
      // Too few civilians - spy wins
      setGamePhase("results");
    } else if (currentRound >= rounds) {
      // Max rounds reached - game over
      setGamePhase("results");
    } else {
      // Continue to next round
      setCurrentRound(currentRound + 1);
      setGamePhase("wordReveal");
      setCurrentPlayerIndex(0);
    }
  };

  if (playerData.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Assigning words...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {gamePhase === "wordReveal" && (
        <WordReveal
          players={playerData}
          currentIndex={currentPlayerIndex}
          onNext={() => {
            if (currentPlayerIndex < playerData.length - 1) {
              setCurrentPlayerIndex(currentPlayerIndex + 1);
            } else {
              handleWordsSeen();
            }
          }}
        />
      )}

      {gamePhase === "hints" && (
        <OneWordHintPhase
          players={playerData.filter((p) => p.isAlive)}
          hintTime={hintTime}
          currentRound={currentRound}
          totalRounds={rounds}
          onComplete={handleHintsComplete}
        />
      )}

      {gamePhase === "voting" && (
        <VotingPhase
          players={playerData.filter((p) => p.isAlive)}
          onVotingComplete={handleVotingComplete}
          currentRound={currentRound}
        />
      )}

      {gamePhase === "results" && (
        <GameResults
          players={playerData}
          civilianWord={civilianWord}
          onPlayAgain={onGameEnd}
        />
      )}
    </div>
  );
};

export default OneWordSpyGame;
