import { useState, useEffect } from "react";
import { Player } from "@/pages/MiniGameMarathon";
import TapRace from "./games/TapRace";
import MemoryTiles from "./games/MemoryTiles";
import BalloonPop from "./games/BalloonPop";
import ReactionTest from "./games/ReactionTest";
import ColorMatch from "./games/ColorMatch";
import SimonSays from "./games/SimonSays";
import MathQuick from "./games/MathQuick";
import WordScramble from "./games/WordScramble";
import RhythmTap from "./games/RhythmTap";
import QuickDraw from "./games/QuickDraw";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";

type Props = {
  players: Player[];
  onGameEnd: (players: Player[]) => void;
};

const MINI_GAMES = [
  { name: "Tap Race", component: TapRace },
  { name: "Memory Tiles", component: MemoryTiles },
  { name: "Balloon Pop", component: BalloonPop },
  { name: "Reaction Test", component: ReactionTest },
  { name: "Color Match", component: ColorMatch },
  { name: "Simon Says", component: SimonSays },
  { name: "Math Quick", component: MathQuick },
  { name: "Word Scramble", component: WordScramble },
  { name: "Rhythm Tap", component: RhythmTap },
  { name: "Quick Draw", component: QuickDraw },
];

const MiniGameMarathon = ({ players, onGameEnd }: Props) => {
  const [currentGame, setCurrentGame] = useState(0);
  const [gamePlayers, setGamePlayers] = useState<Player[]>(players);
  const [showTransition, setShowTransition] = useState(false);

  const handleGameComplete = (winnerId: string) => {
    const updatedPlayers = gamePlayers.map((p) =>
      p.id === winnerId ? { ...p, wins: p.wins + 1 } : p
    );
    setGamePlayers(updatedPlayers);

    if (currentGame < MINI_GAMES.length - 1) {
      setShowTransition(true);
      setTimeout(() => {
        setShowTransition(false);
        setCurrentGame(currentGame + 1);
      }, 2000);
    } else {
      onGameEnd(updatedPlayers);
    }
  };

  const CurrentGameComponent = MINI_GAMES[currentGame].component;

  if (showTransition) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-12 text-center bg-gradient-card backdrop-blur border-2 border-border animate-scale-in">
          <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 text-xl mb-4">
            Game {currentGame + 2} of {MINI_GAMES.length}
          </Badge>
          <h2 className="text-4xl font-black mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            {MINI_GAMES[currentGame + 1].name}
          </h2>
          <p className="text-2xl text-muted-foreground">Get Ready!</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2">
            Game {currentGame + 1} of {MINI_GAMES.length}
          </Badge>
          <div className="flex gap-4">
            {gamePlayers.map((player) => (
              <Card
                key={player.id}
                className="px-4 py-2 bg-background/80 flex items-center gap-2"
              >
                <div className={`w-8 h-8 rounded-full ${player.color} flex items-center justify-center`}>
                  {player.avatar}
                </div>
                <span className="font-semibold">{player.name}</span>
                <Badge variant="secondary" className="ml-2">
                  <Trophy className="w-3 h-3 mr-1" />
                  {player.wins}
                </Badge>
              </Card>
            ))}
          </div>
        </div>

        <CurrentGameComponent
          players={gamePlayers}
          onComplete={handleGameComplete}
        />
      </div>
    </div>
  );
};

export default MiniGameMarathon;
