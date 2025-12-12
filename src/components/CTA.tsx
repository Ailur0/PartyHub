import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 bg-gradient-card backdrop-blur-xl rounded-3xl p-12 border-2 border-primary/50 shadow-glow">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-primary rounded-full text-primary-foreground text-sm font-semibold">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>Join the Party Revolution</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black leading-tight">
            Ready to <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Party?</span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of players already having the time of their lives. 
            Create a room, invite friends, and let the games begin!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="bg-gradient-primary hover:opacity-90 text-primary-foreground font-bold text-lg px-8 py-6 rounded-full shadow-glow transition-all hover:scale-105">
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="font-bold text-lg px-8 py-6 rounded-full border-2 border-primary hover:bg-primary/10 transition-all hover:scale-105">
              Watch Demo
            </Button>
          </div>

          <div className="pt-8 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span>Free to play</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-secondary rounded-full" />
              <span>No download needed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full" />
              <span>Play instantly</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
