import { useState, useEffect, useRef } from "react";
import { PlayerWithAvatar } from "@/pages/ObstacleDash";
import GameResults from "./GameResults";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";

interface ObstacleDashGameProps {
  players: PlayerWithAvatar[];
  raceLength: number;
  obstacleCount: number;
  onGameEnd: () => void;
}

interface PlayerState extends PlayerWithAvatar {
  x: number;
  y: number;
  velocityY: number;
  isJumping: boolean;
  isEliminated: boolean;
  finishTime?: number;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: "box" | "gap" | "spike";
}

interface PowerUp {
  x: number;
  y: number;
  type: "speed" | "jump" | "shield";
  collected: boolean;
}

const ObstacleDashGame = ({
  players,
  raceLength,
  obstacleCount,
  onGameEnd,
}: ObstacleDashGameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<"playing" | "finished">("playing");
  const [playerStates, setPlayerStates] = useState<PlayerState[]>([]);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [cameraX, setCameraX] = useState(0);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());

  const GRAVITY = 0.8;
  const GROUND_Y = 400;
  const JUMP_FORCE = -15;
  const MOVE_SPEED = 5;

  useEffect(() => {
    // Initialize player states
    const initialStates: PlayerState[] = players.map((player, index) => ({
      ...player,
      x: 50,
      y: GROUND_Y,
      velocityY: 0,
      isJumping: false,
      isEliminated: false,
    }));
    setPlayerStates(initialStates);

    // Generate obstacles
    const newObstacles: Obstacle[] = [];
    for (let i = 0; i < obstacleCount; i++) {
      const x = 200 + (raceLength / obstacleCount) * i + Math.random() * 100;
      const type = ["box", "gap", "spike"][Math.floor(Math.random() * 3)] as Obstacle["type"];
      
      if (type === "box") {
        newObstacles.push({
          x,
          y: GROUND_Y - 40,
          width: 40,
          height: 40,
          type,
        });
      } else if (type === "gap") {
        newObstacles.push({
          x,
          y: GROUND_Y,
          width: 80,
          height: 50,
          type,
        });
      } else {
        newObstacles.push({
          x,
          y: GROUND_Y - 20,
          width: 30,
          height: 20,
          type,
        });
      }
    }
    setObstacles(newObstacles);

    // Generate power-ups
    const newPowerUps: PowerUp[] = [];
    for (let i = 0; i < 8; i++) {
      newPowerUps.push({
        x: 300 + (raceLength / 8) * i + Math.random() * 100,
        y: GROUND_Y - 100,
        type: ["speed", "jump", "shield"][Math.floor(Math.random() * 3)] as PowerUp["type"],
        collected: false,
      });
    }
    setPowerUps(newPowerUps);
  }, [players, raceLength, obstacleCount]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeysPressed((prev) => new Set(prev).add(e.key));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeysPressed((prev) => {
        const newSet = new Set(prev);
        newSet.delete(e.key);
        return newSet;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (gameState !== "playing") return;

    const gameLoop = setInterval(() => {
      setPlayerStates((prevStates) => {
        const newStates = prevStates.map((player, index) => {
          if (player.isEliminated || player.finishTime) return player;

          let newPlayer = { ...player };

          // Only control current player
          if (index === currentPlayerIndex) {
            if (keysPressed.has("ArrowLeft")) {
              newPlayer.x = Math.max(0, newPlayer.x - MOVE_SPEED);
            }
            if (keysPressed.has("ArrowRight")) {
              newPlayer.x = Math.min(raceLength, newPlayer.x + MOVE_SPEED);
            }
            if ((keysPressed.has("ArrowUp") || keysPressed.has(" ")) && !newPlayer.isJumping) {
              newPlayer.velocityY = JUMP_FORCE;
              newPlayer.isJumping = true;
            }
          } else {
            // AI for other players
            newPlayer.x += MOVE_SPEED * 0.8 + Math.random() * 0.5;
            
            // Simple AI jumping
            const nearObstacle = obstacles.find(
              (obs) => obs.x > newPlayer.x && obs.x < newPlayer.x + 100
            );
            if (nearObstacle && !newPlayer.isJumping && Math.random() > 0.7) {
              newPlayer.velocityY = JUMP_FORCE;
              newPlayer.isJumping = true;
            }
          }

          // Apply gravity
          newPlayer.velocityY += GRAVITY;
          newPlayer.y += newPlayer.velocityY;

          // Ground collision
          if (newPlayer.y >= GROUND_Y) {
            newPlayer.y = GROUND_Y;
            newPlayer.velocityY = 0;
            newPlayer.isJumping = false;
          }

          // Check obstacles
          obstacles.forEach((obstacle) => {
            if (
              newPlayer.x + 30 > obstacle.x &&
              newPlayer.x < obstacle.x + obstacle.width &&
              newPlayer.y + 30 > obstacle.y &&
              newPlayer.y < obstacle.y + obstacle.height
            ) {
              if (obstacle.type === "gap" || obstacle.type === "spike") {
                newPlayer.isEliminated = true;
              }
            }
          });

          // Check power-ups
          powerUps.forEach((powerUp) => {
            if (
              !powerUp.collected &&
              Math.abs(newPlayer.x - powerUp.x) < 30 &&
              Math.abs(newPlayer.y - powerUp.y) < 30
            ) {
              powerUp.collected = true;
              // Power-up effects would be applied here
            }
          });

          // Check finish line
          if (newPlayer.x >= raceLength && !newPlayer.finishTime) {
            newPlayer.finishTime = Date.now();
          }

          return newPlayer;
        });

        // Check if race is over
        const finishedPlayers = newStates.filter((p) => p.finishTime || p.isEliminated);
        if (finishedPlayers.length === newStates.length) {
          setGameState("finished");
        }

        // Update camera to follow current player
        const currentPlayer = newStates[currentPlayerIndex];
        if (currentPlayer) {
          setCameraX(currentPlayer.x - 200);
        }

        return newStates;
      });
    }, 1000 / 60);

    return () => clearInterval(gameLoop);
  }, [gameState, keysPressed, currentPlayerIndex, obstacles, powerUps, raceLength]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw ground
    ctx.fillStyle = "#16a34a";
    ctx.fillRect(-cameraX, GROUND_Y, canvas.width + cameraX + raceLength, 150);

    // Draw finish line
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(raceLength - cameraX, 0);
    ctx.lineTo(raceLength - cameraX, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw obstacles
    obstacles.forEach((obstacle) => {
      const x = obstacle.x - cameraX;
      if (x > -100 && x < canvas.width + 100) {
        if (obstacle.type === "box") {
          ctx.fillStyle = "#ef4444";
          ctx.fillRect(x, obstacle.y, obstacle.width, obstacle.height);
        } else if (obstacle.type === "gap") {
          ctx.fillStyle = "#0f172a";
          ctx.fillRect(x, obstacle.y, obstacle.width, obstacle.height);
        } else if (obstacle.type === "spike") {
          ctx.fillStyle = "#dc2626";
          ctx.beginPath();
          ctx.moveTo(x, obstacle.y + obstacle.height);
          ctx.lineTo(x + obstacle.width / 2, obstacle.y);
          ctx.lineTo(x + obstacle.width, obstacle.y + obstacle.height);
          ctx.closePath();
          ctx.fill();
        }
      }
    });

    // Draw power-ups
    powerUps.forEach((powerUp) => {
      if (powerUp.collected) return;
      const x = powerUp.x - cameraX;
      if (x > -50 && x < canvas.width + 50) {
        ctx.fillStyle = powerUp.type === "speed" ? "#fbbf24" : powerUp.type === "jump" ? "#3b82f6" : "#a855f7";
        ctx.beginPath();
        ctx.arc(x, powerUp.y, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
          powerUp.type === "speed" ? "⚡" : powerUp.type === "jump" ? "🦘" : "🛡️",
          x,
          powerUp.y + 7
        );
      }
    });

    // Draw players
    playerStates.forEach((player, index) => {
      if (player.isEliminated) return;
      const x = player.x - cameraX;
      if (x > -50 && x < canvas.width + 50) {
        // Player body
        const colorMap: Record<string, string> = {
          "bg-red-500": "#ef4444",
          "bg-blue-500": "#3b82f6",
          "bg-green-500": "#22c55e",
          "bg-yellow-500": "#eab308",
          "bg-purple-500": "#a855f7",
          "bg-pink-500": "#ec4899",
          "bg-indigo-500": "#6366f1",
          "bg-orange-500": "#f97316",
          "bg-teal-500": "#14b8a6",
          "bg-cyan-500": "#06b6d4",
        };
        ctx.fillStyle = colorMap[player.color] || "#3b82f6";
        ctx.fillRect(x, player.y, 30, 30);
        
        // Player icon
        ctx.fillStyle = "#fff";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillText(player.icon, x + 15, player.y + 23);

        // Highlight current player
        if (index === currentPlayerIndex) {
          ctx.strokeStyle = "#fbbf24";
          ctx.lineWidth = 3;
          ctx.strokeRect(x - 2, player.y - 2, 34, 34);
        }
      }
    });
  }, [playerStates, obstacles, powerUps, cameraX, currentPlayerIndex]);

  const handleSwipe = (direction: "left" | "right" | "jump") => {
    if (direction === "left") {
      setKeysPressed((prev) => new Set(prev).add("ArrowLeft"));
      setTimeout(() => setKeysPressed((prev) => {
        const newSet = new Set(prev);
        newSet.delete("ArrowLeft");
        return newSet;
      }), 200);
    } else if (direction === "right") {
      setKeysPressed((prev) => new Set(prev).add("ArrowRight"));
      setTimeout(() => setKeysPressed((prev) => {
        const newSet = new Set(prev);
        newSet.delete("ArrowRight");
        return newSet;
      }), 200);
    } else if (direction === "jump") {
      setKeysPressed((prev) => new Set(prev).add(" "));
      setTimeout(() => setKeysPressed((prev) => {
        const newSet = new Set(prev);
        newSet.delete(" ");
        return newSet;
      }), 100);
    }
  };

  if (gameState === "finished") {
    const sortedPlayers = [...playerStates].sort((a, b) => {
      if (a.isEliminated && !b.isEliminated) return 1;
      if (!a.isEliminated && b.isEliminated) return -1;
      if (a.finishTime && b.finishTime) return a.finishTime - b.finishTime;
      if (a.finishTime) return -1;
      if (b.finishTime) return 1;
      return 0;
    });

    return <GameResults players={sortedPlayers} onPlayAgain={onGameEnd} />;
  }

  const currentPlayer = playerStates[currentPlayerIndex];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 text-sm font-semibold">
            Obstacle Dash
          </Badge>
          <h2 className="text-2xl font-bold">
            Controlling: {currentPlayer?.name || "Loading..."}
          </h2>
          <p className="text-muted-foreground">Use Arrow Keys or Buttons to Control</p>
        </div>

        <Card className="p-4 bg-gradient-card backdrop-blur border-2">
          <canvas
            ref={canvasRef}
            width={800}
            height={500}
            className="w-full border border-border rounded-lg bg-background"
          />
        </Card>

        <div className="grid grid-cols-3 gap-4">
          <Button
            size="lg"
            variant="outline"
            onClick={() => handleSwipe("left")}
            className="h-20"
          >
            <ArrowLeft className="w-8 h-8" />
          </Button>
          <Button
            size="lg"
            variant="default"
            onClick={() => handleSwipe("jump")}
            className="h-20 bg-gradient-to-r from-green-500 to-emerald-600"
          >
            <ArrowUp className="w-8 h-8" />
            <span className="ml-2">Jump</span>
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => handleSwipe("right")}
            className="h-20"
          >
            <ArrowRight className="w-8 h-8" />
          </Button>
        </div>

        <Card className="p-4 bg-background/50 backdrop-blur">
          <h3 className="font-bold mb-3">Leaderboard</h3>
          <div className="grid gap-2">
            {playerStates
              .filter((p) => !p.isEliminated)
              .sort((a, b) => b.x - a.x)
              .map((player, index) => (
                <div
                  key={player.name}
                  className="flex items-center justify-between p-2 rounded bg-background border border-border"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-muted-foreground">#{index + 1}</span>
                    <span className="text-2xl">{player.icon}</span>
                    <span className="font-semibold">{player.name}</span>
                  </div>
                  <Badge variant="secondary">{Math.floor((player.x / raceLength) * 100)}%</Badge>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ObstacleDashGame;
