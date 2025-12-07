import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Trash2, Play, Zap, Brain, Flame, Ghost, User, Heart, Star, Sparkles, Crown, Shield, Sword, Target, Rocket, Zap as ZapIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import PlayerAvatar from "./PlayerAvatar";

interface PlayerWithAvatar {
  name: string;
  icon: string;
  color: string;
}

interface GameLobbyProps {
  onStartGame: (players: PlayerWithAvatar[], difficulty: "easy" | "medium" | "hard" | "mixed", mrWhiteMode: boolean) => void;
}

const avatarIcons = [
  { name: "User", iconName: "user" },
  { name: "Heart", iconName: "heart" },
  { name: "Star", iconName: "star" },
  { name: "Sparkles", iconName: "sparkles" },
  { name: "Crown", iconName: "crown" },
  { name: "Shield", iconName: "shield" },
  { name: "Sword", iconName: "sword" },
  { name: "Target", iconName: "target" },
  { name: "Rocket", iconName: "rocket" },
  { name: "Zap", iconName: "zap" },
];

const avatarColors = [
  "#ef4444", "#f97316", "#f59e0b", "#eab308", 
  "#84cc16", "#22c55e", "#10b981", "#14b8a6",
  "#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6",
  "#a855f7", "#d946ef", "#ec4899", "#f43f5e"
];

const GameLobby = ({ onStartGame }: GameLobbyProps) => {
  const [playerName, setPlayerName] = useState("");
  const [players, setPlayers] = useState<PlayerWithAvatar[]>([]);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | "mixed">("mixed");
  const [mrWhiteMode, setMrWhiteMode] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const { toast } = useToast();

  const addPlayer = () => {
    if (!playerName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a player name",
        variant: "destructive",
      });
      return;
    }

    if (players.some(p => p.name === playerName.trim())) {
      toast({
        title: "Error",
        description: "Player name already exists",
        variant: "destructive",
      });
      return;
    }

    const newPlayer: PlayerWithAvatar = {
      name: playerName.trim(),
      icon: avatarIcons[selectedIcon].iconName,
      color: avatarColors[selectedColor],
    };

    setPlayers([...players, newPlayer]);
    setPlayerName("");
    
    // Auto-select next icon and color
    setSelectedIcon((selectedIcon + 1) % avatarIcons.length);
    setSelectedColor((selectedColor + 1) % avatarColors.length);
  };

  const removePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  const handleStartGame = () => {
    if (players.length < 3) {
      toast({
        title: "Not enough players",
        description: "You need at least 3 players to start",
        variant: "destructive",
      });
      return;
    }
    if (mrWhiteMode && players.length < 4) {
      toast({
        title: "Not enough players for Mr. White mode",
        description: "You need at least 4 players for Mr. White variant",
        variant: "destructive",
      });
      return;
    }
    onStartGame(players, difficulty, mrWhiteMode);
  };

  const difficultyOptions = [
    { value: "easy" as const, label: "Easy", icon: Zap, desc: "Very similar words" },
    { value: "medium" as const, label: "Medium", icon: Brain, desc: "Moderately similar" },
    { value: "hard" as const, label: "Hard", icon: Flame, desc: "Subtly different" },
    { value: "mixed" as const, label: "Mixed", icon: Play, desc: "Random difficulty" },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-black">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Undercover
          </span>
        </h1>
        <p className="text-muted-foreground">
          Find the spy before they blend in!
        </p>
      </div>

      <Card className="p-6 space-y-4 bg-gradient-card backdrop-blur border-2">
        <div className="space-y-4">
          <div className="flex gap-2 items-center">
            <PlayerAvatar 
              icon={avatarIcons[selectedIcon].iconName}
              color={avatarColors[selectedColor]}
              size="md"
            />
            <Input
              placeholder="Enter player name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addPlayer()}
              className="flex-1"
            />
            <Button onClick={addPlayer} className="gap-2">
              <UserPlus className="w-4 h-4" />
              Add
            </Button>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Choose Icon</Label>
            <div className="flex gap-2 flex-wrap">
              {avatarIcons.map((avatar, index) => (
                <button
                  key={avatar.name}
                  onClick={() => setSelectedIcon(index)}
                  className={`p-2 rounded-lg border-2 transition-all ${
                    selectedIcon === index
                      ? "border-primary scale-110"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <PlayerAvatar
                    icon={avatar.iconName}
                    color={avatarColors[selectedColor]}
                    size="sm"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Choose Color</Label>
            <div className="flex gap-2 flex-wrap">
              {avatarColors.map((color, index) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(index)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    selectedColor === index ? "border-foreground scale-110" : "border-border"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">
              Players ({players.length}/10)
            </h3>
            <Badge variant="secondary">Min: 3 players</Badge>
          </div>

          {players.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Add players to start the game
            </div>
          ) : (
            <div className="space-y-2">
              {players.map((player, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50"
                >
                  <div className="flex items-center gap-3">
                    <PlayerAvatar 
                      icon={player.icon}
                      color={player.color}
                      size="sm"
                    />
                      <span className="font-medium">{player.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePlayer(index)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6 bg-gradient-card backdrop-blur border-2 space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-bold">Select Difficulty</h3>
          <p className="text-sm text-muted-foreground">
            Choose how similar the words should be
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {difficultyOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Button
                key={option.value}
                variant={difficulty === option.value ? "default" : "outline"}
                className="h-auto flex-col gap-2 p-4"
                onClick={() => setDifficulty(option.value)}
              >
                <Icon className="w-5 h-5" />
                <div className="text-center">
                  <div className="font-bold">{option.label}</div>
                  <div className="text-xs opacity-80">{option.desc}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </Card>

      <Card className="p-6 bg-gradient-card backdrop-blur border-2 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Ghost className="w-5 h-5 text-primary" />
              <Label htmlFor="mrwhite-mode" className="text-lg font-bold cursor-pointer">
                Mr. White Variant
              </Label>
            </div>
            <p className="text-sm text-muted-foreground">
              One player gets no word and must guess the civilian word to win (requires 4+ players)
            </p>
          </div>
          <Switch
            id="mrwhite-mode"
            checked={mrWhiteMode}
            onCheckedChange={setMrWhiteMode}
          />
        </div>
      </Card>

      <Button
        onClick={handleStartGame}
        disabled={players.length < 3}
        className="w-full gap-2"
        size="lg"
      >
        <Play className="w-4 h-4" />
        Start Game
      </Button>
    </div>
  );
};

export default GameLobby;
