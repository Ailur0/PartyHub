import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <section className="py-12 px-4">
        <div className="container mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-gradient-card border border-border rounded-3xl p-8">
          <div>
            <p className="text-sm uppercase tracking-wide text-muted-foreground">Ready to jump in?</p>
            <h2 className="text-3xl font-bold">Create an account or log in to access all game modes.</h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" variant="outline" className="font-semibold">
              <Link to="/login">Log In</Link>
            </Button>
            <Button asChild size="lg" className="font-semibold">
              <Link to="/play">
                Enter Lobby
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <Features />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
