import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LeaderboardButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => navigate("/leaderboard")}
      className="gap-2"
    >
      <Trophy className="w-4 h-4" />
      Leaderboard
    </Button>
  );
};

export default LeaderboardButton;
