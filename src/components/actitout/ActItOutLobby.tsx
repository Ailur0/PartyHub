import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Plus, Minus, Play, Film, Zap, Package, Shuffle } from "lucide-react";
import PlayerAvatar from "@/components/undercover/PlayerAvatar";
import { PlayerData } from "@/pages/ActItOut";

const AVATAR_ICONS = ["user", "star", "heart", "crown", "sparkles", "trophy", "rocket", "pizza", "coffee", "music"];
const AVATAR_COLORS = [
  "#ef4444", "#f97316", "#f59e0b", "#eab308",
  "#84cc16", "#22c55e", "#10b981", "#14b8a6",
  "#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6",
  "#a855f7", "#d946ef", "#ec4899", "#f43f5e"
];

const CATEGORIES = [
  { value: "mixed", label: "Mixed", icon: Shuffle, description: "All categories" },
  { value: "movies", label: "Movies", icon: Film, description: "Films & TV shows" },
  { value: "actions", label: "Actions", icon: Zap, description: "Activities & verbs" },
  { value: "objects", label: "Objects", icon: Package, description: "Things & items" },
] as const;

const DIFFICULTIES = [
  { value: "easy", label: "Easy", description: "Simple & common words" },
  { value: "medium", label: "Medium", description: "Moderate challenge" },
  { value: "hard", label: "Hard", description: "Complex words" },
] as const;

interface ActItOutLobbyProps {
  onStartGame: (
    players: PlayerData[],
    roundTime: number,
    rounds: number,
    category: "mixed" | "movies" | "actions" | "objects",
    difficulty: "easy" | "medium" | "hard",
    skipsPerPlayer: number
  ) => void;
}

const ActItOutLobby = ({ onStartGame }: ActItOutLobbyProps) => {
  const [playerName, setPlayerName] = useState("");
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [selectedIcon, setSelectedIcon] = useState("user");
  const [selectedColor, setSelectedColor] = useState("#3b82f6");
  const [roundTime, setRoundTime] = useState(60);
  const [rounds, setRounds] = useState(3);
  const [category, setCategory] = useState<"mixed" | "movies" | "actions" | "objects">("mixed");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [skipsPerPlayer, setSkipsPerPlayer] = useState(1);

  const addPlayer = () => {
    if (playerName.trim() && players.length < 10) {
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
      onStartGame(players, roundTime, rounds, category, difficulty, skipsPerPlayer);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="p-8 bg-gradient-card backdrop-blur border-2 border-border">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black mb-2">
            <span className="bg-gradient-to-r from-accent to-blue-600 bg-clip-text text-transparent">
              Act It Out
            </span>
          </h1>
          <p className="text-muted-foreground">Charades reimagined - act, guess, and laugh together!</p>
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
                <Button onClick={addPlayer} disabled={!playerName.trim() || players.length >= 10}>
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
                          ? "border-accent scale-110"
                          : "border-border hover:border-accent/50"
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
                      className={`w-8 h-8 rounded-full border-2 transition-all`}
                      style={{
                        backgroundColor: color,
                        borderColor: selectedColor === color ? "hsl(var(--foreground))" : "hsl(var(--border))",
                        transform: selectedColor === color ? "scale(1.1)" : "scale(1)",
                      }}
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
                Players ({players.length}/10)
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
            
            {/* Category Selection */}
            <div className="space-y-3">
              <Label>Category</Label>
              <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.value}
                      onClick={() => setCategory(cat.value)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        category === cat.value
                          ? "border-accent bg-accent/10"
                          : "border-border hover:border-accent/50"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="w-5 h-5" />
                        <span className="font-semibold">{cat.label}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{cat.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Acting Time</Label>
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

            {/* Difficulty Selection */}
            <div className="space-y-3">
              <Label>Difficulty</Label>
              <div className="grid grid-cols-3 gap-3">
                {DIFFICULTIES.map((diff) => (
                  <button
                    key={diff.value}
                    onClick={() => setDifficulty(diff.value)}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      difficulty === diff.value
                        ? "border-accent bg-accent/10"
                        : "border-border hover:border-accent/50"
                    }`}
                  >
                    <span className="font-semibold block mb-1">{diff.label}</span>
                    <p className="text-xs text-muted-foreground">{diff.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Skips Per Player */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Skips Per Player</Label>
                <Badge variant="secondary">{skipsPerPlayer}</Badge>
              </div>
              <Slider
                value={[skipsPerPlayer]}
                onValueChange={(value) => setSkipsPerPlayer(value[0])}
                min={0}
                max={3}
                step={1}
              />
            </div>
          </div>

          {/* Start Button */}
          <Button
            onClick={handleStartGame}
            disabled={players.length < 2}
            size="lg"
            className="w-full bg-gradient-to-r from-accent to-blue-600 hover:opacity-90 text-accent-foreground"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Game {players.length < 2 && `(Need ${2 - players.length} more)`}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ActItOutLobby;
