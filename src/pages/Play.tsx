import GameModes from "@/components/GameModes";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";

const Play = () => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <section className="px-4 pt-20 pb-12 bg-gradient-to-b from-background via-purple-950/10 to-background">
        <div className="container mx-auto flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4">
            <Badge variant="secondary" className="text-sm">Welcome back</Badge>
            <h1 className="text-4xl md:text-5xl font-black">Choose a mode and start the party</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              You now have full access to every PartyHub experience. Pick a game, open a lobby, and send the code to your friends.
            </p>
          </div>
          <Button variant="outline" size="lg" className="self-start" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </section>

      <GameModes />
      <CTA />
      <Footer />
    </div>
  );
};

export default Play;
