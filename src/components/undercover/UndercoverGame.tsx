import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import WordReveal from "./WordReveal";
import DescriptionPhase from "./DescriptionPhase";
import VotingPhase from "./VotingPhase";
import MrWhiteGuess from "./MrWhiteGuess";
import GameResults from "./GameResults";
import { assignWords } from "@/utils/gameLogic";

interface PlayerWithAvatar {
  name: string;
  icon: string;
  color: string;
}

interface UndercoverGameProps {
  players: PlayerWithAvatar[];
  difficulty: "easy" | "medium" | "hard" | "mixed";
  mrWhiteMode: boolean;
  onGameEnd: () => void;
}

type GamePhase = "word-reveal" | "description" | "voting" | "mrwhite-guess" | "results";

export interface PlayerData {
  name: string;
  word: string;
  role: "civilian" | "spy" | "mrwhite";
  isAlive: boolean;
  description?: string;
  avatar?: {
    icon: string;
    color: string;
  };
}

const UndercoverGame = ({ players, difficulty, mrWhiteMode, onGameEnd }: UndercoverGameProps) => {
  const [gamePhase, setGamePhase] = useState<GamePhase>("word-reveal");
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [playerData, setPlayerData] = useState<PlayerData[]>([]);
  const [round, setRound] = useState(1);
  const [civilianWord, setCivilianWord] = useState("");

  useEffect(() => {
    const playerNames = players.map(p => p.name);
    const initialData = assignWords(playerNames, difficulty, mrWhiteMode);
    
    // Add avatar data to player data
    const dataWithAvatars = initialData.map((player, index) => ({
      ...player,
      avatar: {
        icon: players[index].icon,
        color: players[index].color,
      },
    }));
    
    setPlayerData(dataWithAvatars);
    // Store civilian word for Mr. White guess
    const civilian = dataWithAvatars.find(p => p.role === "civilian");
    if (civilian) setCivilianWord(civilian.word);
  }, [players, difficulty, mrWhiteMode]);

  const handleWordsSeen = () => {
    setGamePhase("description");
  };

  const handleDescriptionsComplete = (descriptions: string[]) => {
    const updatedData = playerData.map((player, index) => ({
      ...player,
      description: descriptions[index],
    }));
    setPlayerData(updatedData);
    setGamePhase("voting");
  };

  const handleVotingComplete = (eliminatedIndex: number) => {
    const updatedData = [...playerData];
    updatedData[eliminatedIndex].isAlive = false;

    const alivePlayers = updatedData.filter((p) => p.isAlive);
    const aliveCivilians = alivePlayers.filter((p) => p.role === "civilian");
    const aliveSpy = alivePlayers.find((p) => p.role === "spy");
    const aliveMrWhite = alivePlayers.find((p) => p.role === "mrwhite");

    // Check if spy was eliminated
    if (!aliveSpy && !aliveMrWhite) {
      setPlayerData(updatedData);
      setGamePhase("results");
    } 
    // Check if Mr. White survived and can guess
    else if (!aliveSpy && aliveMrWhite && aliveCivilians.length >= 1) {
      setPlayerData(updatedData);
      setGamePhase("mrwhite-guess");
    }
    // Check if civilians are outnumbered
    else if (aliveCivilians.length <= 1) {
      setPlayerData(updatedData);
      setGamePhase("results");
    } 
    // Continue game
    else {
      setPlayerData(updatedData);
      setRound(round + 1);
      setGamePhase("description");
    }
  };

  const handleMrWhiteGuess = (guess: string) => {
    const isCorrect = guess.toLowerCase().trim() === civilianWord.toLowerCase().trim();
    
    if (isCorrect) {
      // Mr. White wins - mark as having "won"
      const updatedData = playerData.map(p => ({
        ...p,
        mrWhiteWon: p.role === "mrwhite" ? true : false
      }));
      setPlayerData(updatedData as PlayerData[]);
    }
    setGamePhase("results");
  };

  if (playerData.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {gamePhase === "word-reveal" && (
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

      {gamePhase === "description" && (
        <DescriptionPhase
          players={playerData.filter((p) => p.isAlive)}
          round={round}
          onComplete={handleDescriptionsComplete}
        />
      )}

      {gamePhase === "voting" && (
        <VotingPhase
          players={playerData.filter((p) => p.isAlive)}
          round={round}
          onComplete={handleVotingComplete}
        />
      )}

      {gamePhase === "mrwhite-guess" && (
        <MrWhiteGuess 
          mrWhite={playerData.find(p => p.role === "mrwhite")!}
          onGuess={handleMrWhiteGuess}
        />
      )}

      {gamePhase === "results" && (
        <GameResults players={playerData} civilianWord={civilianWord} onPlayAgain={onGameEnd} />
      )}
    </div>
  );
};

export default UndercoverGame;
