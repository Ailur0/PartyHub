import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Play from "./pages/Play";
import Undercover from "./pages/Undercover";
import SketchIt from "./pages/SketchIt";
import ActItOut from "./pages/ActItOut";
import Quiz from "./pages/Quiz";
import OneWordSpy from "./pages/OneWordSpy";
import ObstacleDash from "./pages/ObstacleDash";
import MiniGameMarathon from "./pages/MiniGameMarathon";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/play" element={<ProtectedRoute><Play /></ProtectedRoute>} />
            <Route path="/undercover" element={<ProtectedRoute><Undercover /></ProtectedRoute>} />
            <Route path="/sketch-it" element={<ProtectedRoute><SketchIt /></ProtectedRoute>} />
            <Route path="/act-it-out" element={<ProtectedRoute><ActItOut /></ProtectedRoute>} />
            <Route path="/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
            <Route path="/one-word-spy" element={<ProtectedRoute><OneWordSpy /></ProtectedRoute>} />
            <Route path="/obstacle-dash" element={<ProtectedRoute><ObstacleDash /></ProtectedRoute>} />
            <Route path="/mini-game-marathon" element={<ProtectedRoute><MiniGameMarathon /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;
