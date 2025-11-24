import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Plus, Minus, Pencil, Play } from "lucide-react";
import PlayerAvatar from "@/components/undercover/PlayerAvatar";
import { PlayerData } from "@/pages/SketchIt";

const AVATAR_ICONS = ["user", "star", "heart", "crown", "sparkles", "trophy", "rocket", "pizza", "coffee", "music"];
const AVATAR_COLORS = [
  "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500",
  "bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-indigo-500",
  "bg-cyan-500", "bg-teal-500", "bg-lime-500", "bg-rose-500",
  "bg-fuchsia-500", "bg-violet-500", "bg-sky-500", "bg-emerald-500"
];

interface SketchItLobbyProps {
  onStartGame: (players: PlayerData[], roundTime: number, rounds: number) => void;
}

const SketchItLobby = ({ onStartGame }: SketchItLobbyProps) => {
  const [playerName, setPlayerName] = useState("");
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [selectedIcon, setSelectedIcon] = useState("user");
  const [selectedColor, setSelectedColor] = useState("bg-blue-500");
  const [roundTime, setRoundTime] = useState(60);
  const [rounds, setRounds] = useState(3);

  const addPlayer = () => {
    if (playerName.trim() && players.length < 8) {
      const newPlayer: PlayerData = {
        name: playerName.trim(),
        avatar: {
          icon: selectedIcon,
          color: selectedColor,
        },
      };
      setPlayers([...players, newPlayer]);
      setPlayerName("");
      
      // Auto-select next available icon and color
      const nextIconIndex = (AVATAR_ICONS.indexOf(selectedIcon) + 1) % AVATAR_ICONS.length;
      const nextColorIndex = (AVATAR_COLORS.indexOf(selectedColor) + 1) % AVATAR_COLORS.length;
      setSelectedIcon(AVATAR_ICONS[nextIconIndex]);
      setSelectedColor(AVATAR_COLORS[nextColorIndex]);
    }
  };

  const removePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  const handleStartGame = () => {
    if (players.length >= 2) {
      onStartGame(players, roundTime, rounds);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="p-8 bg-gradient-card backdrop-blur border-2 border-border">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black mb-2">
            <span className="bg-gradient-secondary bg-clip-text text-transparent">Sketch It!</span>
          </h1>
          <p className="text-muted-foreground">Draw and guess your way to victory</p>
        </div>

        <div className="space-y-6">
          {/* Add Player Section */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Add Players</Label>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Enter player name"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addPlayer()}
                    maxLength={20}
                  />
                </div>
                <Button onClick={addPlayer} disabled={!playerName.trim() || players.length >= 8}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>

              {/* Avatar Selection */}
              <div className="space-y-3">
                <Label className="text-sm">Choose Avatar</Label>
                <div className="flex gap-2 flex-wrap">
                  {AVATAR_ICONS.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setSelectedIcon(icon)}
                      className={`p-2 rounded-lg border-2 transition-all ${
                        selectedIcon === icon
                          ? "border-primary scale-110"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <PlayerAvatar icon={icon} color={selectedColor} size="sm" />
                    </button>
                  ))}
                </div>
                
                <div className="flex gap-2 flex-wrap mt-2">
                  {AVATAR_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full ${color} border-2 transition-all ${
                        selectedColor === color
                          ? "border-foreground scale-110"
                          : "border-border hover:border-foreground/50"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Players List */}
          {players.length > 0 && (
            <div className="space-y-3">
              <Label className="text-lg font-semibold">
                Players ({players.length}/8)
              </Label>
              <div className="grid gap-2">
                {players.map((player, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border"
                  >
                    <PlayerAvatar
                      icon={player.avatar.icon}
                      color={player.avatar.color}
                      size="md"
                    />
                    <span className="flex-1 font-medium">{player.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePlayer(index)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Game Settings */}
          <div className="space-y-4 pt-4 border-t border-border">
            <Label className="text-lg font-semibold">Game Settings</Label>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Drawing Time</Label>
                <Badge variant="secondary">{roundTime}s</Badge>
              </div>
              <Slider
                value={[roundTime]}
                onValueChange={(value) => setRoundTime(value[0])}
                min={30}
                max={120}
                step={15}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Number of Rounds</Label>
                <Badge variant="secondary">{rounds}</Badge>
              </div>
              <Slider
                value={[rounds]}
                onValueChange={(value) => setRounds(value[0])}
                min={1}
                max={10}
                step={1}
              />
            </div>
          </div>

          {/* Start Button */}
          <Button
            onClick={handleStartGame}
            disabled={players.length < 2}
            size="lg"
            className="w-full bg-gradient-secondary hover:opacity-90 text-secondary-foreground"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Game {players.length < 2 && `(Need ${2 - players.length} more)`}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SketchItLobby;
