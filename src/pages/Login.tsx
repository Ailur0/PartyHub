import { useState, FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LogIn, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname ?? "/play";

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !name) {
      setError("Please enter both your display name and email.");
      return;
    }

    setError(null);
    login();
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-950/20 to-background flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg border-border/60 bg-gradient-card backdrop-blur">
        <CardHeader className="space-y-2 text-center">
          <div className="inline-flex items-center justify-center gap-2 p-2 rounded-full bg-primary/10 text-primary">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-sm font-semibold">Secure lobby access</span>
          </div>
          <CardTitle className="text-3xl">Log in to PartyHub</CardTitle>
          <CardDescription>Enter your party name and contact email to access every game mode.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Display name</Label>
              <Input id="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Captain Fun" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="submit" size="lg" className="w-full font-bold">
              <LogIn className="w-4 h-4 mr-2" />
              Enter the lobby
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              This demo login simply unlocks the experience locally—no password required.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
