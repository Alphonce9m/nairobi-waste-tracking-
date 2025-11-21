import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { learningModules, quizQuestions } from "@/lib/climateData";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { BookOpen, Trophy, CheckCircle2, Lock, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Learn = () => {
  const { toast } = useToast();
  const [userProgress, setUserProgress] = useLocalStorage("climateProgress", {
    completedModules: [] as string[],
    quizScores: {} as Record<string, number>,
  });
  
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentModuleData = learningModules.find((m) => m.id === selectedModule);
  const currentQuiz = selectedModule ? quizQuestions[selectedModule as keyof typeof quizQuestions] : null;

  const startQuiz = () => {
    setQuizMode(true);
    setCurrentQuestion(0);
    setQuizScore(0);
    setQuizCompleted(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswer(answerIndex);
  };

  const checkAnswer = () => {
    if (selectedAnswer === null || !currentQuiz) return;

    const isCorrect = selectedAnswer === currentQuiz[currentQuestion].correct;
    setShowExplanation(true);

    if (isCorrect) {
      setQuizScore(quizScore + 1);
    }
  };

  const nextQuestion = () => {
    if (!currentQuiz) return;

    if (currentQuestion < currentQuiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Quiz completed
      const finalScore = Math.round((quizScore / currentQuiz.length) * 100);
      setUserProgress({
        ...userProgress,
        quizScores: { ...userProgress.quizScores, [selectedModule!]: finalScore },
        completedModules: userProgress.completedModules.includes(selectedModule!)
          ? userProgress.completedModules
          : [...userProgress.completedModules, selectedModule!],
      });
      setQuizCompleted(true);

      toast({
        title: finalScore === 100 ? "Perfect Score! 🎉" : "Quiz Complete!",
        description: `You scored ${quizScore}/${currentQuiz.length} (${finalScore}%)`,
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-success text-white";
      case "Intermediate":
        return "bg-secondary text-white";
      case "Advanced":
        return "bg-accent text-white";
      default:
        return "bg-muted";
    }
  };

  const calculateProgress = () => {
    return (userProgress.completedModules.length / learningModules.length) * 100;
  };

  return (
    <div className="pb-20 px-4 pt-6 max-w-screen-xl mx-auto">
      <header className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold text-foreground mb-2">Learn</h1>
        <p className="text-muted-foreground text-lg">
          Master climate science and solutions
        </p>
      </header>

      {/* Progress Overview */}
      <Card className="p-6 mb-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">Your Progress</span>
          </div>
          <span className="text-2xl font-bold text-primary">
            {userProgress.completedModules.length}/{learningModules.length}
          </span>
        </div>
        <Progress value={calculateProgress()} className="h-3" />
        <p className="text-sm text-muted-foreground mt-2">
          {calculateProgress() === 100
            ? "All modules completed! 🎉"
            : `${Math.round(calculateProgress())}% complete`}
        </p>
      </Card>

      {/* Learning Modules */}
      <div className="space-y-4 mb-6">
        {learningModules.map((module, index) => {
          const isCompleted = userProgress.completedModules.includes(module.id);
          const quizScore = userProgress.quizScores[module.id];
          const isLocked = index > 0 && !userProgress.completedModules.includes(learningModules[index - 1].id);

          return (
            <Card
              key={module.id}
              className={`p-5 transition-all hover:shadow-lg ${
                isLocked ? "opacity-60" : "cursor-pointer hover:border-primary"
              }`}
              onClick={() => !isLocked && setSelectedModule(module.id)}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${isCompleted ? "bg-success/20" : "bg-primary/20"}`}>
                  {isLocked ? (
                    <Lock className="h-6 w-6 text-muted-foreground" />
                  ) : isCompleted ? (
                    <CheckCircle2 className="h-6 w-6 text-success" />
                  ) : (
                    <BookOpen className="h-6 w-6 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-foreground text-lg">
                      {module.title}
                    </h3>
                    <Badge className={getDifficultyColor(module.difficulty)}>
                      {module.difficulty}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {module.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">⏱️ {module.duration}</span>
                    {quizScore !== undefined && (
                      <span className="text-success font-medium">
                        Quiz: {quizScore}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Module Dialog */}
      <Dialog open={selectedModule !== null} onOpenChange={() => setSelectedModule(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{currentModuleData?.title}</DialogTitle>
          </DialogHeader>

          {!quizMode ? (
            <div className="space-y-6">
              {currentModuleData?.content.sections.map((section, idx) => (
                <div key={idx}>
                  <h4 className="font-semibold text-lg text-foreground mb-2">
                    {section.title}
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {section.text}
                  </p>
                </div>
              ))}

              <div className="bg-primary/10 p-4 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">Key Takeaways:</h4>
                <ul className="space-y-2">
                  {currentModuleData?.content.keyTakeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button onClick={startQuiz} className="w-full" size="lg">
                <Play className="mr-2 h-5 w-5" />
                Start Quiz
              </Button>
            </div>
          ) : quizCompleted ? (
            <div className="text-center py-8">
              <Trophy className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Quiz Complete!
              </h3>
              <p className="text-4xl font-bold text-primary mb-4">
                {Math.round((quizScore / (currentQuiz?.length || 1)) * 100)}%
              </p>
              <p className="text-muted-foreground mb-6">
                You got {quizScore} out of {currentQuiz?.length} questions correct
              </p>
              <Button onClick={() => setSelectedModule(null)} size="lg">
                Continue Learning
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Question {currentQuestion + 1} of {currentQuiz?.length}
                  </span>
                  <span className="text-sm font-medium text-primary">
                    Score: {quizScore}/{currentQuestion + (showExplanation ? 1 : 0)}
                  </span>
                </div>
                <Progress
                  value={((currentQuestion + 1) / (currentQuiz?.length || 1)) * 100}
                  className="h-2"
                />
              </div>

              <h4 className="text-lg font-semibold text-foreground">
                {currentQuiz?.[currentQuestion].question}
              </h4>

              <div className="space-y-3">
                {currentQuiz?.[currentQuestion].options.map((option, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const isCorrect = idx === currentQuiz[currentQuestion].correct;
                  const showResult = showExplanation;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswerSelect(idx)}
                      disabled={showExplanation}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        showResult
                          ? isCorrect
                            ? "border-success bg-success/10"
                            : isSelected
                            ? "border-destructive bg-destructive/10"
                            : "border-border"
                          : isSelected
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-foreground">{option}</span>
                        {showResult && isCorrect && (
                          <CheckCircle2 className="h-5 w-5 text-success" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {showExplanation && (
                <div className="bg-muted p-4 rounded-lg animate-fade-in">
                  <p className="text-sm text-foreground">
                    {currentQuiz?.[currentQuestion].explanation}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                {!showExplanation ? (
                  <Button
                    onClick={checkAnswer}
                    disabled={selectedAnswer === null}
                    className="w-full"
                    size="lg"
                  >
                    Check Answer
                  </Button>
                ) : (
                  <Button onClick={nextQuestion} className="w-full" size="lg">
                    {currentQuestion < (currentQuiz?.length || 0) - 1
                      ? "Next Question"
                      : "Complete Quiz"}
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Learn;
