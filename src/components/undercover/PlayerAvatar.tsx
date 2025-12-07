import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";

interface PlayerAvatarProps {
  icon: string;
  color: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const PlayerAvatar = ({ icon, color, size = "md", className }: PlayerAvatarProps) => {
  // Map icon names to Lucide components
  const iconMap: Record<string, React.ComponentType<any>> = {
    user: Icons.User,
    star: Icons.Star,
    heart: Icons.Heart,
    crown: Icons.Crown,
    sparkles: Icons.Sparkles,
    trophy: Icons.Trophy,
    rocket: Icons.Rocket,
    pizza: Icons.Pizza,
    coffee: Icons.Coffee,
    music: Icons.Music,
    shield: Icons.Shield,
    sword: Icons.Sword,
    target: Icons.Target,
    zap: Icons.Zap,
  };

  const Icon = iconMap[icon] || Icons.User;
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center border-2 transition-all",
        sizeClasses[size],
        className
      )}
      style={{
        backgroundColor: `${color}20`,
        borderColor: color,
      }}
    >
      <Icon size={iconSizes[size]} style={{ color }} />
    </div>
  );
};

export default PlayerAvatar;
