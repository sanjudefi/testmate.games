"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type GamePhase = "intro" | "playing" | "results";

interface MathQuestion {
  num1: number;
  num2: number;
  correctAnswer: number;
  wrongAnswer: number;
}

export default function MathSpeedTest() {
  const router = useRouter();
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [questions, setQuestions] = useState<MathQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [timeouts, setTimeouts] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (phase === "playing" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (phase === "playing" && timeLeft === 0) {
      handleTimeout();
    }
  }, [phase, timeLeft]);

  const generateQuestions = (): MathQuestion[] => {
    const newQuestions: MathQuestion[] = [];

    for (let i = 0; i < 5; i++) {
      // Generate two random 2-digit numbers (10-99)
      const num1 = Math.floor(Math.random() * 90) + 10;
      const num2 = Math.floor(Math.random() * 90) + 10;
      const correctAnswer = num1 + num2;

      // Generate a confusing wrong answer (close to correct)
      const offset = Math.random() > 0.5
        ? Math.floor(Math.random() * 15) + 5  // Add 5-20
        : -(Math.floor(Math.random() * 15) + 5); // Subtract 5-20
      const wrongAnswer = correctAnswer + offset;

      newQuestions.push({
        num1,
        num2,
        correctAnswer,
        wrongAnswer,
      });
    }

    return newQuestions;
  };

  const startTest = () => {
    const newQuestions = generateQuestions();
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setTimeouts(0);
    setTimeLeft(5);
    setPhase("playing");
  };

  const handleAnswer = (selectedAnswer: number) => {
    const currentQuestion = questions[currentQuestionIndex];

    if (selectedAnswer === currentQuestion.correctAnswer) {
      setCorrectAnswers(correctAnswers + 1);
    } else {
      setWrongAnswers(wrongAnswers + 1);
    }

    moveToNextQuestion();
  };

  const handleTimeout = () => {
    setTimeouts(timeouts + 1);
    moveToNextQuestion();
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < 4) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(5);
    } else {
      endGame();
    }
  };

  const endGame = () => {
    // Score: 20 points per correct answer
    const finalScore = Math.min(correctAnswers * 20, 100);
    setScore(finalScore);
    setPhase("results");
  };

  const saveAndContinue = () => {
    localStorage.setItem("mathSpeedScore", score.toString());
    router.push("/brain-test/racing");
  };

  if (phase === "intro") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full card-testmate p-8">
          <h1 className="text-4xl font-bold mb-4 text-[#A855F7]">
            ➕ Math Speed Test
          </h1>
          <div className="space-y-4 text-[#CBD5E1] mb-8">
            <p className="text-lg">
              Solve <strong className="text-white">5 addition problems</strong> as fast as you can!
            </p>
            <p className="text-lg">
              Each question shows <strong className="text-white">two 2-digit numbers</strong> to add.
            </p>
            <p className="text-lg">
              You have <strong className="text-white">5 seconds</strong> per question.
            </p>
            <p className="text-lg">
              Click the correct answer from 2 options. Be careful - one option is close but wrong!
            </p>
          </div>
          <button
            onClick={startTest}
            className="w-full bg-[#A855F7] hover:bg-[#4F7BFE] text-white font-bold py-4 px-8 rounded-lg transition-all shadow-glow-purple hover:shadow-glow-blue"
          >
            Start Test
          </button>
          <button
            onClick={() => router.push("/")}
            className="w-full mt-4 bg-[#334155] hover:bg-[#1E293B] text-white font-bold py-3 px-6 rounded-lg transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (phase === "playing") {
    const currentQuestion = questions[currentQuestionIndex];
    const answers = [currentQuestion.correctAnswer, currentQuestion.wrongAnswer].sort(() => Math.random() - 0.5);

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="text-2xl text-[#CBD5E1] mb-2">
              Question {currentQuestionIndex + 1} of 5
            </div>
            <div className="text-6xl font-bold text-[#A855F7] mb-4">{timeLeft}s</div>
          </div>

          <div className="card-testmate p-12 mb-8">
            <div className="text-center mb-8">
              <p className="text-xl text-[#CBD5E1] mb-4">What is:</p>
              <p className="text-7xl font-bold text-white mb-2">
                {currentQuestion.num1} + {currentQuestion.num2}
              </p>
              <p className="text-2xl text-[#CBD5E1] mt-4">= ?</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {answers.map((answer, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(answer)}
                className="p-8 rounded-lg font-bold text-5xl transition-all bg-[#1E293B] text-white border-2 border-[#334155] hover:border-[#4F7BFE] hover:bg-[#4F7BFE] hover:shadow-glow-blue"
              >
                {answer}
              </button>
            ))}
          </div>

          <div className="mt-6 flex justify-between text-sm text-[#CBD5E1]">
            <span>Correct: <span className="text-[#4F7BFE] font-bold">{correctAnswers}</span></span>
            <span>Wrong: <span className="text-[#A855F7] font-bold">{wrongAnswers}</span></span>
            <span>Timeout: <span className="text-red-400 font-bold">{timeouts}</span></span>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "results") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full card-testmate p-8">
          <h2 className="text-4xl font-bold mb-4 text-center text-[#A855F7]">
            Results
          </h2>
          <div className="text-center mb-8">
            <div className="text-7xl font-bold text-[#4F7BFE] mb-4">
              {score}
            </div>
            <p className="text-2xl text-[#CBD5E1]">out of 100</p>
          </div>
          <div className="space-y-4 mb-8">
            <div className="flex justify-between p-4 bg-[#0F172A] rounded-lg">
              <span className="text-[#CBD5E1]">Correct Answers:</span>
              <span className="text-white font-bold">{correctAnswers} / 5 ✅</span>
            </div>
            <div className="flex justify-between p-4 bg-[#0F172A] rounded-lg">
              <span className="text-[#CBD5E1]">Wrong Answers:</span>
              <span className="text-white font-bold">{wrongAnswers} ❌</span>
            </div>
            <div className="flex justify-between p-4 bg-[#0F172A] rounded-lg">
              <span className="text-[#CBD5E1]">Timeouts:</span>
              <span className="text-white font-bold">{timeouts} ⏱️</span>
            </div>
            <div className="flex justify-between p-4 bg-[#0F172A] rounded-lg border-2 border-[#A855F7]">
              <span className="text-[#CBD5E1]">Final Score:</span>
              <span className="text-white font-bold">{score}%</span>
            </div>
          </div>
          <button
            onClick={saveAndContinue}
            className="w-full bg-[#A855F7] hover:bg-[#4F7BFE] text-white font-bold py-4 px-8 rounded-lg transition-all shadow-glow-purple hover:shadow-glow-blue"
          >
            Continue to Mind Speed Racer
          </button>
        </div>
      </div>
    );
  }

  return null;
}
