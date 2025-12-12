import { Card } from "@/components/ui/card";
import { Sparkles, Brain, Users, Zap, Trophy, Palette } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered",
    description: "Dynamic content generation, smart hosting, and hilarious round summaries",
    color: "text-primary",
  },
  {
    icon: Users,
    title: "Cross-Platform Play",
    description: "Online multiplayer or local pass-and-play. Your choice, your fun!",
    color: "text-secondary",
  },
  {
    icon: Zap,
    title: "Instant Matches",
    description: "Join with a room code or quick match. Get playing in seconds!",
    color: "text-accent",
  },
  {
    icon: Trophy,
    title: "XP & Achievements",
    description: "Level up, unlock cosmetics, and earn badges as you play",
    color: "text-yellow-500",
  },
  {
    icon: Palette,
    title: "Customization",
    description: "Avatars, themes, sound packs, and custom game modes",
    color: "text-pink-500",
  },
  {
    icon: Sparkles,
    title: "Regular Updates",
    description: "New game modes, seasonal events, and community features",
    color: "text-purple-500",
  },
];

const Features = () => {
  return (
    <section className="py-20 px-4 relative">
      <div className="container mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-6xl font-black">
            Packed with <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Features</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need for the ultimate party experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="group p-8 bg-gradient-card backdrop-blur border-2 border-border hover:border-primary transition-all duration-300 hover:scale-105 hover:shadow-glow cursor-pointer"
              >
                <div className="space-y-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-foreground">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
