import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, User, Clock, Target, Zap } from "lucide-react";
import { PlayerWithAvatar } from "@/pages/OneWordSpy";
import { toast } from "sonner";

const AVATAR_ICONS = ["👤", "🎭", "🎪", "🎨", "🎯", "🎲", "🎸", "🎺", "🎻", "🎬"];
const AVATAR_COLORS = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-orange-500",
  "bg-teal-500",
  "bg-cyan-500",
];

const DIFFICULTIES = [
  { value: "easy", label: "Easy", description: "Very similar words" },
  { value: "medium", label: "Medium", description: "Moderately similar" },
  { value: "hard", label: "Hard", description: "Subtly different" },
  { value: "mixed", label: "Mixed", description: "Random difficulty" },
];

interface OneWordSpyLobbyProps {
  onStartGame: (
    players: PlayerWithAvatar[],
    difficulty: "easy" | "medium" | "hard" | "mixed",
    hintTime: number,
    rounds: number
  ) => void;
}

const OneWordSpyLobby = ({ onStartGame }: OneWordSpyLobbyProps) => {
  const [players, setPlayers] = useState<PlayerWithAvatar[]>([
    { name: "Player 1", icon: AVATAR_ICONS[0], color: AVATAR_COLORS[0] },
  ]);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | "mixed">("mixed");
  const [hintTime, setHintTime] = useState(30);
  const [rounds, setRounds] = useState(3);

  const addPlayer = () => {
    if (players.length >= 8) {
      toast.error("Maximum 8 players allowed");
      return;
    }
    const newPlayer: PlayerWithAvatar = {
      name: `Player ${players.length + 1}`,
      icon: AVATAR_ICONS[players.length % AVATAR_ICONS.length],
      color: AVATAR_COLORS[players.length % AVATAR_COLORS.length],
    };
    setPlayers([...players, newPlayer]);
  };

  const removePlayer = (index: number) => {
    if (players.length <= 1) {
      toast.error("Need at least 1 player");
      return;
    }
    setPlayers(players.filter((_, i) => i !== index));
  };

  const updatePlayerName = (index: number, name: string) => {
    const updated = [...players];
    updated[index].name = name;
    setPlayers(updated);
  };

  const updatePlayerIcon = (index: number) => {
    const updated = [...players];
    const currentIconIndex = AVATAR_ICONS.indexOf(updated[index].icon);
    updated[index].icon = AVATAR_ICONS[(currentIconIndex + 1) % AVATAR_ICONS.length];
    setPlayers(updated);
  };

  const updatePlayerColor = (index: number) => {
    const updated = [...players];
    const currentColorIndex = AVATAR_COLORS.indexOf(updated[index].color);
    updated[index].color = AVATAR_COLORS[(currentColorIndex + 1) % AVATAR_COLORS.length];
    setPlayers(updated);
  };

  const handleStartGame = () => {
    if (players.length < 3) {
      toast.error("Need at least 3 players to start");
      return;
    }
    onStartGame(players, difficulty, hintTime, rounds);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent">
            One Word Spy Setup
          </h1>
          <p className="text-muted-foreground text-lg">
            Give ONE WORD hints. Spy must blend in!
          </p>
        </div>

        <Card className="p-6 space-y-6 bg-gradient-card backdrop-blur border-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold">Players ({players.length}/8)</h2>
            </div>
            <Button onClick={addPlayer} size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Player
            </Button>
          </div>

          <div className="grid gap-4">
            {players.map((player, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 rounded-lg bg-background/50 border border-border"
              >
                <button
                  onClick={() => updatePlayerIcon(index)}
                  className={`w-12 h-12 rounded-full ${player.color} flex items-center justify-center text-2xl hover:scale-110 transition-transform cursor-pointer`}
                >
                  {player.icon}
                </button>
                <Input
                  value={player.name}
                  onChange={(e) => updatePlayerName(index, e.target.value)}
                  className="flex-1"
                  placeholder="Player name"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => updatePlayerColor(index)}
                  className="shrink-0"
                >
                  <div className={`w-6 h-6 rounded-full ${player.color}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removePlayer(index)}
                  className="shrink-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 space-y-6 bg-gradient-card backdrop-blur border-2">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-bold">Game Settings</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Difficulty
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {DIFFICULTIES.map((diff) => (
                  <Button
                    key={diff.value}
                    variant={difficulty === diff.value ? "default" : "outline"}
                    onClick={() => setDifficulty(diff.value as any)}
                    className="flex flex-col h-auto py-3"
                  >
                    <span className="font-bold">{diff.label}</span>
                    <span className="text-xs opacity-80">{diff.description}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Hint Time: {hintTime}s
              </Label>
              <div className="flex gap-2">
                {[20, 30, 40, 60].map((time) => (
                  <Button
                    key={time}
                    variant={hintTime === time ? "default" : "outline"}
                    onClick={() => setHintTime(time)}
                    size="sm"
                  >
                    {time}s
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Number of Rounds: {rounds}</Label>
              <div className="flex gap-2">
                {[2, 3, 4, 5].map((r) => (
                  <Button
                    key={r}
                    variant={rounds === r ? "default" : "outline"}
                    onClick={() => setRounds(r)}
                    size="sm"
                  >
                    {r}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Button
          onClick={handleStartGame}
          size="lg"
          className="w-full text-lg font-bold bg-gradient-to-r from-yellow-500 to-orange-600 hover:opacity-90"
        >
          Start Game
        </Button>
      </div>
    </div>
  );
};

export default OneWordSpyLobby;
