import { useState } from "react";
import MiniGameLobby from "@/components/minigame/MiniGameLobby";
import MiniGameMarathon from "@/components/minigame/MiniGameMarathon";
import GameResults from "@/components/minigame/GameResults";

export type Player = {
  id: string;
  name: string;
  avatar: string;
  color: string;
  wins: number;
};

export type GamePhase = "lobby" | "playing" | "results";

const MiniGameMarathonPage = () => {
  const [phase, setPhase] = useState<GamePhase>("lobby");
  const [players, setPlayers] = useState<Player[]>([]);

  const handleStart = (gamePlayers: Player[]) => {
    setPlayers(gamePlayers);
    setPhase("playing");
  };

  const handleGameEnd = (finalPlayers: Player[]) => {
    setPlayers(finalPlayers);
    setPhase("results");
  };

  const handlePlayAgain = () => {
    setPlayers(players.map(p => ({ ...p, wins: 0 })));
    setPhase("playing");
  };

  const handleBackToLobby = () => {
    setPhase("lobby");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-indigo-950/20 to-background">
      {phase === "lobby" && <MiniGameLobby onStart={handleStart} />}
      {phase === "playing" && (
        <MiniGameMarathon players={players} onGameEnd={handleGameEnd} />
      )}
      {phase === "results" && (
        <GameResults
          players={players}
          onPlayAgain={handlePlayAgain}
          onBackToLobby={handleBackToLobby}
        />
      )}
    </div>
  );
};

export default MiniGameMarathonPage;
