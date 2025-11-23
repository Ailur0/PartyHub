import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Plus, Minus, Play, Atom, History, Film, Trophy, Shuffle } from "lucide-react";
import PlayerAvatar from "@/components/undercover/PlayerAvatar";
import { PlayerData } from "@/pages/Quiz";

const AVATAR_ICONS = ["user", "star", "heart", "crown", "sparkles", "trophy", "rocket", "pizza", "coffee", "music"];
const AVATAR_COLORS = [
  "#ef4444", "#f97316", "#f59e0b", "#eab308",
  "#84cc16", "#22c55e", "#10b981", "#14b8a6",
  "#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6",
  "#a855f7", "#d946ef", "#ec4899", "#f43f5e"
];

const CATEGORIES = [
  { value: "mixed", label: "Mixed", icon: Shuffle, description: "All topics" },
  { value: "science", label: "Science", icon: Atom, description: "Nature & tech" },
  { value: "history", label: "History", icon: History, description: "Past events" },
  { value: "entertainment", label: "Entertainment", icon: Film, description: "Movies & music" },
  { value: "sports", label: "Sports", icon: Trophy, description: "Athletics" },
] as const;

const DIFFICULTIES = [
  { value: "easy", label: "Easy", description: "Simple questions" },
  { value: "medium", label: "Medium", description: "Moderate challenge" },
  { value: "hard", label: "Hard", description: "Expert level" },
] as const;

interface QuizLobbyProps {
  onStartGame: (
    players: PlayerData[],
    questionTime: number,
    questionCount: number,
    category: "mixed" | "science" | "history" | "entertainment" | "sports",
    difficulty: "easy" | "medium" | "hard"
  ) => void;
}

const QuizLobby = ({ onStartGame }: QuizLobbyProps) => {
  const [playerName, setPlayerName] = useState("");
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [selectedIcon, setSelectedIcon] = useState("user");
  const [selectedColor, setSelectedColor] = useState("#3b82f6");
  const [questionTime, setQuestionTime] = useState(15);
  const [questionCount, setQuestionCount] = useState(10);
  const [category, setCategory] = useState<"mixed" | "science" | "history" | "entertainment" | "sports">("mixed");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");

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
      onStartGame(players, questionTime, questionCount, category, difficulty);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="p-8 bg-gradient-card backdrop-blur border-2 border-border">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black mb-2">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Quiz Battle
            </span>
          </h1>
          <p className="text-muted-foreground">Race to answer trivia questions correctly!</p>
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
                <Button
                  onClick={addPlayer}
                  disabled={!playerName.trim() || players.length >= 8}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </Button>
              </div>

              {/* Avatar Selection */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="space-y-2">
                  <Label className="text-sm">Choose Icon</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {AVATAR_ICONS.map((icon) => (
                      <button
                        key={icon}
                        onClick={() => setSelectedIcon(icon)}
                        className={`p-2 rounded-lg border-2 transition-all ${
                          selectedIcon === icon
                            ? "border-accent bg-accent/10"
                            : "border-border hover:border-accent/50"
                        }`}
                      >
                        <PlayerAvatar icon={icon} color={selectedColor} size="sm" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Choose Color</Label>
                  <div className="grid grid-cols-8 gap-2">
                    {AVATAR_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-lg border-2 transition-all ${
                          selectedColor === color
                            ? "border-accent scale-110"
                            : "border-border hover:border-accent/50"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
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
            
            {/* Category Selection */}
            <div className="space-y-3">
              <Label>Category</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.value}
                      onClick={() => setCategory(cat.value)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        category === cat.value
                          ? "border-purple-600 bg-purple-600/10"
                          : "border-border hover:border-purple-600/50"
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
                        ? "border-purple-600 bg-purple-600/10"
                        : "border-border hover:border-purple-600/50"
                    }`}
                  >
                    <span className="font-semibold block mb-1">{diff.label}</span>
                    <p className="text-xs text-muted-foreground">{diff.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Time Per Question</Label>
                <Badge variant="secondary">{questionTime}s</Badge>
              </div>
              <Slider
                value={[questionTime]}
                onValueChange={(value) => setQuestionTime(value[0])}
                min={10}
                max={30}
                step={5}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Number of Questions</Label>
                <Badge variant="secondary">{questionCount}</Badge>
              </div>
              <Slider
                value={[questionCount]}
                onValueChange={(value) => setQuestionCount(value[0])}
                min={5}
                max={20}
                step={5}
              />
            </div>
          </div>

          {/* Start Button */}
          <Button
            onClick={handleStartGame}
            disabled={players.length < 2}
            size="lg"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Quiz {players.length < 2 && `(Need ${2 - players.length} more)`}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default QuizLobby;
