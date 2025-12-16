import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GlobalLeaderboard from "@/components/leaderboard/GlobalLeaderboard";

const Leaderboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/40 bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <GlobalLeaderboard />
      </main>
    </div>
  );
};

export default Leaderboard;
