import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Sparkles, Timer, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import undercoverIcon from "@/assets/undercover-icon.jpg";
import drawingIcon from "@/assets/drawing-icon.jpg";
import charadesIcon from "@/assets/charades-icon.jpg";
import quizIcon from "@/assets/quiz-icon.jpg";

const gameModes = [
  {
    title: "Undercover",
    description: "Social deduction at its finest. Find the spy before they blend in!",
    icon: undercoverIcon,
    players: "3-10 Players",
    difficulty: "Medium",
    gradient: "from-primary to-orange-600",
  },
  {
    title: "Sketch It!",
    description: "Draw and guess in real-time. Unleash your inner artist!",
    icon: drawingIcon,
    players: "2-8 Players",
    difficulty: "Easy",
    gradient: "from-secondary to-purple-600",
  },
  {
    title: "Act It Out",
    description: "Charades reimagined. Act, guess, and laugh together!",
    icon: charadesIcon,
    players: "2-10 Players",
    difficulty: "Easy",
    gradient: "from-accent to-blue-600",
  },
  {
    title: "Quick Quiz",
    description: "Test your knowledge with AI-generated trivia challenges.",
    icon: quizIcon,
    players: "1-10 Players",
    difficulty: "Medium",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    title: "One Word Spy",
    description: "Give one-word hints. The spy must blend in seamlessly.",
    icon: undercoverIcon,
    players: "3-8 Players",
    difficulty: "Hard",
    gradient: "from-yellow-500 to-orange-600",
  },
  {
    title: "Obstacle Dash",
    description: "Race through physics-based challenges. Last one standing wins!",
    icon: charadesIcon,
    players: "2-10 Players",
    difficulty: "Medium",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    title: "Mini-Game Marathon",
    description: "10 rapid-fire mini-games. Win the most to claim victory!",
    icon: quizIcon,
    players: "2-8 Players",
    difficulty: "Hard",
    gradient: "from-indigo-500 to-purple-600",
  },
];

const GameModes = () => {
  const navigate = useNavigate();

  const handleModeClick = (title: string) => {
    if (title === "Undercover") {
      navigate("/undercover");
    } else if (title === "Sketch It!") {
      navigate("/sketch-it");
    } else if (title === "Act It Out") {
      navigate("/act-it-out");
    } else if (title === "Quick Quiz") {
      navigate("/quiz");
    } else if (title === "One Word Spy") {
      navigate("/one-word-spy");
    } else if (title === "Obstacle Dash") {
      navigate("/obstacle-dash");
    } else if (title === "Mini-Game Marathon") {
      navigate("/mini-game-marathon");
    }
  };

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-purple-950/10 to-background" />
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <Badge className="bg-gradient-secondary text-secondary-foreground px-4 py-2 text-sm font-semibold">
            <Sparkles className="w-4 h-4 mr-2 inline" />
            7 Unique Modes
          </Badge>
          <h2 className="text-4xl md:text-6xl font-black">
            Choose Your <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Adventure</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From social deduction to action-packed races, there's something for everyone
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gameModes.map((mode, index) => (
            <Card
              key={index}
              onClick={() => handleModeClick(mode.title)}
              className="group relative overflow-hidden bg-gradient-card backdrop-blur border-2 border-border hover:border-primary transition-all duration-300 hover:scale-105 hover:shadow-glow cursor-pointer"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${mode.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              <div className="p-6 space-y-4 relative z-10">
                <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4">
                  <img
                    src={mode.icon}
                    alt={mode.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {mode.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {mode.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{mode.players}</span>
                  </div>
                  <Badge variant="secondary" className="font-semibold">
                    {mode.difficulty}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">More modes coming soon!</p>
          <div className="flex items-center justify-center gap-2">
            <Trophy className="w-5 h-5 text-primary animate-pulse" />
            <span className="font-semibold">Seasonal events & limited-time modes</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GameModes;
