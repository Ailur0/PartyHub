import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Timer, Check, X } from "lucide-react";
import { PlayerScore } from "./QuizGame";
import PlayerAvatar from "@/components/undercover/PlayerAvatar";
import { toast } from "sonner";

const QUESTIONS = {
  science: {
    easy: [
      { question: "What planet is known as the Red Planet?", options: ["Mars", "Venus", "Jupiter", "Saturn"], correct: 0 },
      { question: "What gas do plants absorb from the atmosphere?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Helium"], correct: 2 },
      { question: "How many legs does a spider have?", options: ["6", "8", "10", "12"], correct: 1 },
      { question: "What is H2O commonly known as?", options: ["Salt", "Water", "Sugar", "Acid"], correct: 1 },
      { question: "What is the center of an atom called?", options: ["Electron", "Proton", "Nucleus", "Neutron"], correct: 2 },
    ],
    medium: [
      { question: "What is the speed of light?", options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"], correct: 0 },
      { question: "What is the hardest natural substance?", options: ["Gold", "Iron", "Diamond", "Platinum"], correct: 2 },
      { question: "What percentage of Earth is covered by water?", options: ["50%", "60%", "71%", "80%"], correct: 2 },
      { question: "What is the smallest bone in the human body?", options: ["Stapes", "Femur", "Radius", "Tibia"], correct: 0 },
      { question: "How many chromosomes do humans have?", options: ["23", "46", "92", "44"], correct: 1 },
    ],
    hard: [
      { question: "What is the Heisenberg Uncertainty Principle?", options: ["Energy conservation", "Position-momentum trade-off", "Time dilation", "Wave-particle duality"], correct: 1 },
      { question: "What is the half-life of Carbon-14?", options: ["5,730 years", "10,000 years", "1,000 years", "50,000 years"], correct: 0 },
      { question: "What is the strongest force in nature?", options: ["Gravity", "Electromagnetic", "Strong Nuclear", "Weak Nuclear"], correct: 2 },
      { question: "What is Avogadro's number?", options: ["6.02 × 10²³", "3.14 × 10⁸", "9.81 × 10⁹", "1.38 × 10²³"], correct: 0 },
      { question: "What particle mediates the weak nuclear force?", options: ["Gluon", "Photon", "W and Z bosons", "Graviton"], correct: 2 },
    ],
  },
  history: {
    easy: [
      { question: "Who was the first President of the United States?", options: ["Thomas Jefferson", "George Washington", "Abraham Lincoln", "John Adams"], correct: 1 },
      { question: "In what year did World War II end?", options: ["1943", "1944", "1945", "1946"], correct: 2 },
      { question: "What ancient wonder is located in Egypt?", options: ["Colossus", "Lighthouse", "Pyramids", "Gardens"], correct: 2 },
      { question: "Who discovered America in 1492?", options: ["Magellan", "Columbus", "Vespucci", "Cortez"], correct: 1 },
      { question: "What city was the capital of the Roman Empire?", options: ["Athens", "Constantinople", "Rome", "Alexandria"], correct: 2 },
    ],
    medium: [
      { question: "When did the French Revolution begin?", options: ["1776", "1789", "1799", "1804"], correct: 1 },
      { question: "Who painted the Mona Lisa?", options: ["Michelangelo", "Raphael", "Leonardo da Vinci", "Donatello"], correct: 2 },
      { question: "What year did the Berlin Wall fall?", options: ["1987", "1989", "1991", "1993"], correct: 1 },
      { question: "Who was the first person to walk on the moon?", options: ["Buzz Aldrin", "Neil Armstrong", "Yuri Gagarin", "John Glenn"], correct: 1 },
      { question: "What empire was ruled by Julius Caesar?", options: ["Greek", "Persian", "Roman", "Ottoman"], correct: 2 },
    ],
    hard: [
      { question: "What year was the Magna Carta signed?", options: ["1066", "1215", "1337", "1453"], correct: 1 },
      { question: "Who was the longest-reigning British monarch before Elizabeth II?", options: ["Victoria", "George III", "Henry VIII", "Edward III"], correct: 0 },
      { question: "What battle ended Napoleon's rule?", options: ["Austerlitz", "Leipzig", "Waterloo", "Borodino"], correct: 2 },
      { question: "When did the Byzantine Empire fall?", options: ["1204", "1453", "1492", "1517"], correct: 1 },
      { question: "Who wrote 'The Art of War'?", options: ["Confucius", "Sun Tzu", "Lao Tzu", "Mencius"], correct: 1 },
    ],
  },
  entertainment: {
    easy: [
      { question: "Who played Iron Man in the Marvel movies?", options: ["Chris Evans", "Robert Downey Jr.", "Chris Hemsworth", "Mark Ruffalo"], correct: 1 },
      { question: "What is the highest-grossing film of all time?", options: ["Titanic", "Avatar", "Avengers: Endgame", "Star Wars"], correct: 1 },
      { question: "Who sang 'Thriller'?", options: ["Prince", "Michael Jackson", "Elvis", "Madonna"], correct: 1 },
      { question: "What streaming service is known for 'Stranger Things'?", options: ["Hulu", "Netflix", "Disney+", "Prime"], correct: 1 },
      { question: "What movie features the song 'Let It Go'?", options: ["Moana", "Tangled", "Frozen", "Brave"], correct: 2 },
    ],
    medium: [
      { question: "Who directed 'Pulp Fiction'?", options: ["Scorsese", "Tarantino", "Spielberg", "Nolan"], correct: 1 },
      { question: "What year was the first Star Wars movie released?", options: ["1975", "1977", "1979", "1981"], correct: 1 },
      { question: "Who played Jack in 'Titanic'?", options: ["Brad Pitt", "Leonardo DiCaprio", "Tom Cruise", "Johnny Depp"], correct: 1 },
      { question: "What band wrote 'Bohemian Rhapsody'?", options: ["The Beatles", "Led Zeppelin", "Queen", "The Rolling Stones"], correct: 2 },
      { question: "How many seasons does 'Breaking Bad' have?", options: ["4", "5", "6", "7"], correct: 1 },
    ],
    hard: [
      { question: "Who composed the score for 'Inception'?", options: ["Hans Zimmer", "John Williams", "Ennio Morricone", "Howard Shore"], correct: 0 },
      { question: "What was the first feature-length animated film?", options: ["Fantasia", "Pinocchio", "Snow White", "Bambi"], correct: 2 },
      { question: "Who won the first season of American Idol?", options: ["Carrie Underwood", "Kelly Clarkson", "Ruben Studdard", "Clay Aiken"], correct: 1 },
      { question: "What year did MTV launch?", options: ["1979", "1981", "1983", "1985"], correct: 1 },
      { question: "Who directed '2001: A Space Odyssey'?", options: ["Kubrick", "Hitchcock", "Coppola", "Ridley Scott"], correct: 0 },
    ],
  },
  sports: {
    easy: [
      { question: "How many players are on a soccer team?", options: ["9", "10", "11", "12"], correct: 2 },
      { question: "What sport is played at Wimbledon?", options: ["Golf", "Tennis", "Cricket", "Rugby"], correct: 1 },
      { question: "How many points is a touchdown in American football?", options: ["3", "6", "7", "8"], correct: 1 },
      { question: "What color is the center of an archery target?", options: ["Red", "Yellow", "Blue", "White"], correct: 1 },
      { question: "How many rings are on the Olympic flag?", options: ["4", "5", "6", "7"], correct: 1 },
    ],
    medium: [
      { question: "Who has won the most NBA championships?", options: ["Lakers", "Celtics", "Bulls", "Warriors"], correct: 1 },
      { question: "What country has won the most World Cups?", options: ["Germany", "Argentina", "Brazil", "Italy"], correct: 2 },
      { question: "How long is a marathon?", options: ["26.2 miles", "24.8 miles", "28.4 miles", "30.1 miles"], correct: 0 },
      { question: "What is Tiger Woods' real first name?", options: ["Timothy", "Thomas", "Eldrick", "Edward"], correct: 2 },
      { question: "How many Grand Slam tournaments are there in tennis?", options: ["3", "4", "5", "6"], correct: 1 },
    ],
    hard: [
      { question: "Who holds the record for most home runs in a single MLB season?", options: ["Babe Ruth", "Barry Bonds", "Mark McGwire", "Sammy Sosa"], correct: 1 },
      { question: "What year were the first modern Olympics held?", options: ["1892", "1896", "1900", "1904"], correct: 1 },
      { question: "Who was the first athlete to run a sub-4-minute mile?", options: ["Jesse Owens", "Roger Bannister", "Emil Zátopek", "Paavo Nurmi"], correct: 1 },
      { question: "How many Super Bowl rings does Tom Brady have?", options: ["5", "6", "7", "8"], correct: 2 },
      { question: "What is the maximum break in snooker?", options: ["147", "150", "155", "160"], correct: 0 },
    ],
  },
};

// Generate mixed questions
const MIXED_QUESTIONS = {
  easy: [...QUESTIONS.science.easy, ...QUESTIONS.history.easy, ...QUESTIONS.entertainment.easy, ...QUESTIONS.sports.easy],
  medium: [...QUESTIONS.science.medium, ...QUESTIONS.history.medium, ...QUESTIONS.entertainment.medium, ...QUESTIONS.sports.medium],
  hard: [...QUESTIONS.science.hard, ...QUESTIONS.history.hard, ...QUESTIONS.entertainment.hard, ...QUESTIONS.sports.hard],
};

interface QuestionRoundProps {
  players: PlayerScore[];
  questionTime: number;
  currentQuestion: number;
  totalQuestions: number;
  category: "mixed" | "science" | "history" | "entertainment" | "sports";
  difficulty: "easy" | "medium" | "hard";
  onQuestionComplete: (correctPlayers: string[]) => void;
}

const QuestionRound = ({
  players,
  questionTime,
  currentQuestion,
  totalQuestions,
  category,
  difficulty,
  onQuestionComplete,
}: QuestionRoundProps) => {
  const [question, setQuestion] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(questionTime);
  const [playerAnswers, setPlayerAnswers] = useState<Record<string, number | null>>({});
  const [showResults, setShowResults] = useState(false);
  const [usedQuestions, setUsedQuestions] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Select random question
    const questionPool = category === "mixed" ? MIXED_QUESTIONS[difficulty] : QUESTIONS[category][difficulty];
    let availableIndices = questionPool.map((_, i) => i).filter(i => !usedQuestions.has(i));
    
    if (availableIndices.length === 0) {
      // Reset if we've used all questions
      setUsedQuestions(new Set());
      availableIndices = questionPool.map((_, i) => i);
    }
    
    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    setQuestion(questionPool[randomIndex]);
    setUsedQuestions(prev => new Set([...prev, randomIndex]));
    setTimeLeft(questionTime);
    setPlayerAnswers({});
    setShowResults(false);
  }, [currentQuestion, category, difficulty, questionTime]);

  useEffect(() => {
    if (timeLeft <= 0 || Object.keys(playerAnswers).length === players.length) {
      if (!showResults) {
        handleTimeUp();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, playerAnswers, players.length, showResults]);

  const handleTimeUp = () => {
    setShowResults(true);
    
    // Determine correct players
    const correctPlayers = Object.entries(playerAnswers)
      .filter(([_, answer]) => answer === question?.correct)
      .map(([name]) => name);

    setTimeout(() => {
      onQuestionComplete(correctPlayers);
    }, 3000);
  };

  const handleAnswer = (playerName: string, answerIndex: number) => {
    if (!showResults && !(playerName in playerAnswers)) {
      setPlayerAnswers(prev => ({ ...prev, [playerName]: answerIndex }));
    }
  };

  if (!question) return null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="p-4 bg-gradient-card backdrop-blur border-2 border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge variant="secondary">
              Question {currentQuestion}/{totalQuestions}
            </Badge>
            <Badge className="bg-purple-600 text-white capitalize">
              {category}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {difficulty}
            </Badge>
          </div>
          <Badge
            variant={timeLeft <= 5 ? "destructive" : "default"}
            className="text-lg px-4 py-2"
          >
            <Timer className="w-4 h-4 mr-2" />
            {timeLeft}s
          </Badge>
        </div>
      </Card>

      {/* Question Area */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-8 bg-gradient-card backdrop-blur border-2 border-border">
            <h2 className="text-2xl font-bold mb-6">{question.question}</h2>
            
            <div className="grid gap-3">
              {question.options.map((option: string, index: number) => {
                const isCorrect = index === question.correct;
                const showCorrectAnswer = showResults && isCorrect;
                const showWrongAnswer = showResults && !isCorrect;

                return (
                  <button
                    key={index}
                    disabled={showResults}
                    className={`p-4 rounded-lg border-2 text-left font-medium transition-all ${
                      showCorrectAnswer
                        ? "border-green-500 bg-green-500/20"
                        : showWrongAnswer
                        ? "border-red-500/50 bg-red-500/5 opacity-50"
                        : "border-border hover:border-purple-600 hover:bg-purple-600/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {showCorrectAnswer && <Check className="w-5 h-5 text-green-500" />}
                      {showWrongAnswer && <X className="w-5 h-5 text-red-500" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Players Panel */}
        <div className="lg:col-span-1">
          <Card className="p-4 bg-gradient-card backdrop-blur border-2 border-border h-full">
            <h3 className="text-xl font-bold mb-4">Players</h3>
            
            <div className="space-y-2">
              {players.map((player) => {
                const hasAnswered = player.name in playerAnswers;
                const isCorrect = showResults && playerAnswers[player.name] === question.correct;
                
                return (
                  <div
                    key={player.name}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      showResults && isCorrect
                        ? "bg-green-500/20 border-green-500"
                        : hasAnswered
                        ? "bg-blue-500/20 border-blue-500"
                        : "bg-muted/50 border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <PlayerAvatar
                        icon={player.avatar.icon}
                        color={player.avatar.color}
                        size="sm"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{player.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Score: {player.score}
                        </div>
                      </div>
                      {hasAnswered && !showResults && <Check className="w-5 h-5 text-blue-500" />}
                      {showResults && isCorrect && <Check className="w-5 h-5 text-green-500" />}
                      {showResults && hasAnswered && !isCorrect && <X className="w-5 h-5 text-red-500" />}
                    </div>

                    {!showResults && !hasAnswered && (
                      <div className="grid grid-cols-4 gap-1 mt-2">
                        {question.options.map((_: any, index: number) => (
                          <Button
                            key={index}
                            size="sm"
                            variant="outline"
                            onClick={() => handleAnswer(player.name, index)}
                            className="h-8 text-xs"
                          >
                            {String.fromCharCode(65 + index)}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuestionRound;
