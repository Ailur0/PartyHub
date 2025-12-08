import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { User, Plus, Trash2, Play, Trophy } from "lucide-react";
import { Player } from "@/pages/MiniGameMarathon";
import { useNavigate } from "react-router-dom";

const AVATAR_ICONS = ["🎮", "🎯", "⚡", "🔥", "💎", "⭐", "🎨", "🎭"];
const AVATAR_COLORS = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-orange-500",
  "bg-cyan-500",
];

type Props = {
  onStart: (players: Player[]) => void;
};

const MiniGameLobby = ({ onStart }: Props) => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>([
    {
      id: "1",
      name: "Player 1",
      avatar: "🎮",
      color: "bg-red-500",
      wins: 0,
    },
  ]);

  const addPlayer = () => {
    if (players.length >= 8) return;
    const newPlayer: Player = {
      id: Date.now().toString(),
      name: `Player ${players.length + 1}`,
      avatar: AVATAR_ICONS[players.length % AVATAR_ICONS.length],
      color: AVATAR_COLORS[players.length % AVATAR_COLORS.length],
      wins: 0,
    };
    setPlayers([...players, newPlayer]);
  };

  const removePlayer = (id: string) => {
    if (players.length <= 1) return;
    setPlayers(players.filter((p) => p.id !== id));
  };

  const updatePlayer = (id: string, updates: Partial<Player>) => {
    setPlayers(players.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const handleStart = () => {
    if (players.length >= 2) {
      onStart(players);
    }
  };

  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <Card className="w-full max-w-4xl p-8 bg-gradient-card backdrop-blur border-2 border-border">
        <div className="text-center mb-8">
          <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 mb-4">
            <Trophy className="w-4 h-4 mr-2 inline" />
            10 Mini-Games
          </Badge>
          <h1 className="text-5xl font-black mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Mini-Game Marathon
          </h1>
          <p className="text-muted-foreground text-lg">
            Compete in 10 rapid-fire challenges. Win the most to claim victory!
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <User className="w-6 h-6" />
              Players ({players.length}/8)
            </h2>
            <Button
              onClick={addPlayer}
              disabled={players.length >= 8}
              variant="outline"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Player
            </Button>
          </div>

          <div className="grid gap-4">
            {players.map((player, index) => (
              <Card key={player.id} className="p-4 bg-background/50">
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    {AVATAR_ICONS.map((icon) => (
                      <button
                        key={icon}
                        onClick={() => updatePlayer(player.id, { avatar: icon })}
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all ${
                          player.avatar === icon
                            ? player.color
                            : "bg-muted hover:bg-muted/80"
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>

                  <Input
                    value={player.name}
                    onChange={(e) =>
                      updatePlayer(player.id, { name: e.target.value })
                    }
                    className="flex-1"
                    placeholder="Player name"
                  />

                  <div className="flex gap-1">
                    {AVATAR_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => updatePlayer(player.id, { color })}
                        className={`w-8 h-8 rounded-full ${color} ${
                          player.color === color
                            ? "ring-2 ring-foreground ring-offset-2"
                            : ""
                        }`}
                      />
                    ))}
                  </div>

                  {players.length > 1 && (
                    <Button
                      onClick={() => removePlayer(player.id)}
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              Back to Home
            </Button>
            <Button
              onClick={handleStart}
              disabled={players.length < 2}
              className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
              size="lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Marathon
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MiniGameLobby;
