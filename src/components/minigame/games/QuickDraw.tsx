import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Player } from "@/pages/MiniGameMarathon";
import { Pencil } from "lucide-react";

type Props = {
  players: Player[];
  onComplete: (winnerId: string) => void;
};

const PROMPTS = ["Circle", "Square", "Star", "Heart", "Arrow", "Smiley"];

const QuickDraw = ({ players, onComplete }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [prompt, setPrompt] = useState("");
  const [drawing, setDrawing] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(players.map((p) => [p.id, 0]))
  );
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [currentPlayer]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (currentPlayer < players.length - 1) {
        setCurrentPlayer(currentPlayer + 1);
        setTimeLeft(10);
      } else {
        const winner = Object.entries(scores).reduce((a, b) =>
          a[1] > b[1] ? a : b
        )[0];
        setTimeout(() => onComplete(winner), 500);
      }
      return;
    }

    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, currentPlayer, players, scores, onComplete]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setDrawing(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing && e.type !== "mousedown") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000000";

    if (e.type === "mousedown") {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const handleDone = () => {
    setScores((prev) => ({
      ...prev,
      [players[currentPlayer].id]: prev[players[currentPlayer].id] + Math.ceil(timeLeft / 2),
    }));
    setTimeLeft(0);
  };

  const player = players[currentPlayer];

  return (
    <Card className="p-8 bg-gradient-card backdrop-blur border-2 border-border">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-black mb-2 flex items-center justify-center gap-2">
          <Pencil className="w-8 h-8 text-purple-500" />
          Quick Draw
        </h2>
        <div className="flex items-center justify-center gap-3 mb-4">
          <div
            className={`w-12 h-12 rounded-full ${player.color} flex items-center justify-center text-2xl`}
          >
            {player.avatar}
          </div>
          <p className="text-2xl font-bold">{player.name}</p>
        </div>
        <p className="text-3xl font-black text-primary mb-2">
          Draw a: {prompt}
        </p>
        <p className="text-4xl font-black text-muted-foreground">{timeLeft}s</p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="border-2 border-border rounded-lg bg-white cursor-crosshair"
        />
        <Button
          onClick={handleDone}
          className="w-48 h-12 text-xl font-bold"
          size="lg"
        >
          Done!
        </Button>
      </div>

      <div className="mt-6 flex justify-center gap-4">
        {players.map((p) => (
          <Card key={p.id} className="px-4 py-2 bg-background/50">
            <p className="font-semibold">{p.name}</p>
            <p className="text-2xl font-black text-primary">{scores[p.id]}</p>
          </Card>
        ))}
      </div>
    </Card>
  );
};

export default QuickDraw;
