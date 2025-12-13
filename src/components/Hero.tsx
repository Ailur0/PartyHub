import { Button } from "@/components/ui/button";
import { Sparkles, Users, Zap, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-purple-950/20 to-background">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="container relative z-10 px-4 py-20 mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-primary rounded-full text-primary-foreground text-sm font-semibold shadow-glow">
              <Sparkles className="w-4 h-4" />
              <span>One App. Infinite Party Games</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                PartyVerse
              </span>
              <br />
              <span className="text-foreground">Where Friends Play</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl">
              Jump into social deduction, drawing challenges, charades, and more! 
              Play online with friends or pass-and-play locally. Powered by AI for endless fun.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90 text-primary-foreground font-bold text-lg px-8 py-6 rounded-full shadow-glow transition-all hover:scale-105">
                <Users className="w-5 h-5 mr-2" />
                Start Playing Now
              </Button>
              <Button size="lg" variant="outline" className="font-bold text-lg px-8 py-6 rounded-full border-2 border-primary hover:bg-primary/10 transition-all hover:scale-105">
                <Zap className="w-5 h-5 mr-2" />
                Explore Games
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/leaderboard")} className="font-bold text-lg px-8 py-6 rounded-full border-2 border-yellow-500 hover:bg-yellow-500/10 transition-all hover:scale-105">
                <Trophy className="w-5 h-5 mr-2" />
                Leaderboard
              </Button>
            </div>

            <div className="flex items-center gap-8 justify-center lg:justify-start text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                <span className="text-muted-foreground">10K+ Active Players</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
                <span className="text-muted-foreground">7 Game Modes</span>
              </div>
            </div>
          </div>

          {/* Right content - Hero image */}
          <div className="relative animate-fade-in-delayed">
            <div className="absolute inset-0 bg-gradient-hero opacity-20 blur-3xl rounded-full" />
            <img 
              src={heroImage} 
              alt="Friends playing party games together" 
              className="relative rounded-3xl shadow-2xl w-full h-auto transform hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
