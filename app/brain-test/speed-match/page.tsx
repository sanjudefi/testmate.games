"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type GamePhase = "intro" | "memorize" | "question" | "transition" | "results";
type Shape = "circle" | "square" | "triangle" | "hexagon" | "pentagon";

const SHAPES: Shape[] = ["circle", "square", "triangle", "hexagon", "pentagon"];

export default function SpeedMatchTest() {
  const router = useRouter();
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [currentRound, setCurrentRound] = useState(0);
  const [previousShape, setPreviousShape] = useState<Shape>("circle");
  const [currentShape, setCurrentShape] = useState<Shape>("circle");
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState(0);
  const [score, setScore] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"in" | "out">("in");

  const totalRounds = 15;

  // Get random shape
  const getRandomShape = (): Shape => {
    return SHAPES[Math.floor(Math.random() * SHAPES.length)];
  };

  // Start test
  const startTest = () => {
    const firstShape = getRandomShape();
    setPreviousShape(firstShape);
    setCurrentRound(0);
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setReactionTimes([]);
    setPhase("memorize");

    // After 1.5 seconds, move to question
    setTimeout(() => {
      showQuestion(firstShape);
    }, 1500);
  };

  // Show question
  const showQuestion = (prevShape: Shape) => {
    const shouldMatch = Math.random() > 0.5;
    const nextShape = shouldMatch ? prevShape : getRandomShape();

    // Make sure it's actually different if not matching
    let finalShape = nextShape;
    if (!shouldMatch) {
      while (finalShape === prevShape) {
        finalShape = getRandomShape();
      }
    }

    setCurrentShape(finalShape);
    setQuestionStartTime(Date.now());
    setPhase("question");
  };

  // Handle answer
  const handleAnswer = (userSaysMatch: boolean) => {
    const reactionTime = Date.now() - questionStartTime;
    setReactionTimes([...reactionTimes, reactionTime]);

    const actualMatch = previousShape === currentShape;
    const isCorrect = userSaysMatch === actualMatch;

    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
    } else {
      setWrongAnswers(wrongAnswers + 1);
    }

    // Move to next round
    const nextRound = currentRound + 1;
    if (nextRound < totalRounds) {
      setCurrentRound(nextRound);

      // Slide out current shape
      setSlideDirection("out");
      setPhase("transition");

      setTimeout(() => {
        // Current shape becomes previous shape
        setPreviousShape(currentShape);

        // Generate next shape
        const shouldMatch = Math.random() > 0.5;
        let nextShape = shouldMatch ? currentShape : getRandomShape();

        if (!shouldMatch) {
          while (nextShape === currentShape) {
            nextShape = getRandomShape();
          }
        }

        setCurrentShape(nextShape);
        setSlideDirection("in");

        // Show question immediately
        setTimeout(() => {
          setQuestionStartTime(Date.now());
          setPhase("question");
        }, 100);
      }, 400);
    } else {
      endGame();
    }
  };

  // End game
  const endGame = () => {
    const total = correctAnswers + wrongAnswers;
    const accuracy = total > 0 ? (correctAnswers / total) * 100 : 0;
    const avgReaction = reactionTimes.length > 0
      ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length
      : 0;

    // Score: 70% accuracy, 30% reaction speed
    const accuracyScore = (accuracy / 100) * 70;
    const reactionScore = Math.max(0, 30 - (avgReaction / 100));

    const finalScore = Math.round(accuracyScore + reactionScore);
    setScore(Math.min(finalScore, 100));
    setPhase("results");
  };

  const saveAndContinue = () => {
    localStorage.setItem("speedMatchScore", score.toString());
    router.push("/brain-test/results");
  };

  // Render shape
  const renderShape = (shape: Shape, size: string = "200px") => {
    const shapeStyles = {
      circle: (
        <div
          className="mx-auto bg-[#4DD4AC]"
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
          }}
        />
      ),
      square: (
        <div
          className="mx-auto bg-[#D63864]"
          style={{
            width: size,
            height: size,
          }}
        />
      ),
      triangle: (
        <div
          className="mx-auto"
          style={{
            width: 0,
            height: 0,
            borderLeft: `${parseInt(size) / 2}px solid transparent`,
            borderRight: `${parseInt(size) / 2}px solid transparent`,
            borderBottom: `${parseInt(size)}px solid #F6A623`,
          }}
        />
      ),
      hexagon: (
        <div
          className="mx-auto bg-[#7B68EE]"
          style={{
            width: size,
            height: size,
            clipPath: "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)",
          }}
        />
      ),
      pentagon: (
        <div
          className="mx-auto bg-[#FF6B6B]"
          style={{
            width: size,
            height: size,
            clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
          }}
        />
      ),
    };

    return shapeStyles[shape];
  };

  if (phase === "intro") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full card-testmate p-8">
          <h1 className="text-4xl font-bold mb-4 text-[#4F7BFE]">
            🔷 Speed Match
          </h1>
          <div className="space-y-4 text-[#CBD5E1] mb-8">
            <p className="text-lg">
              Test your <strong className="text-white">visual memory</strong> and <strong className="text-white">pattern recognition</strong>!
            </p>
            <p className="text-lg">
              You'll see a shape, then another shape appears.
            </p>
            <p className="text-lg">
              Decide if the <strong className="text-white">second shape matches the first</strong>.
            </p>
            <p className="text-lg">
              Answer as <strong className="text-white">quickly and accurately</strong> as possible for <strong className="text-white">15 rounds</strong>.
            </p>
          </div>
          <button
            onClick={startTest}
            className="w-full bg-[#4F7BFE] hover:bg-[#A855F7] text-white font-bold py-4 px-8 rounded-lg transition-all shadow-glow-blue hover:shadow-glow-purple"
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

  if (phase === "memorize") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#1a365d] to-[#0F172A]">
        <div className="text-center mb-8">
          <p className="text-xl text-[#CBD5E1] mb-2">Round {currentRound + 1} of {totalRounds}</p>
        </div>

        <div className="w-full max-w-md aspect-square bg-white rounded-2xl shadow-2xl flex items-center justify-center mb-8 p-12 animate-slide-in">
          {renderShape(currentShape)}
        </div>

        <p className="text-2xl text-white font-semibold">Remember the shape.</p>

        <style jsx>{`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }

          .animate-slide-in {
            animation: slideIn 0.5s ease-out;
          }
        `}</style>
      </div>
    );
  }

  if (phase === "transition") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#1a365d] to-[#0F172A]">
        <div className="text-center mb-8">
          <p className="text-xl text-[#CBD5E1] mb-2">Round {currentRound + 1} of {totalRounds}</p>
        </div>

        <div
          className={`w-full max-w-md aspect-square bg-white rounded-2xl shadow-2xl flex items-center justify-center mb-8 p-12 ${
            slideDirection === "out" ? "animate-slide-out" : "animate-slide-in"
          }`}
        >
          {renderShape(slideDirection === "out" ? previousShape : currentShape)}
        </div>

        <style jsx>{`
          @keyframes slideOut {
            from {
              transform: translateX(0);
              opacity: 1;
            }
            to {
              transform: translateX(-100%);
              opacity: 0;
            }
          }

          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }

          .animate-slide-out {
            animation: slideOut 0.4s ease-in;
          }

          .animate-slide-in {
            animation: slideIn 0.4s ease-out;
          }
        `}</style>
      </div>
    );
  }

  if (phase === "question") {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#1a365d] to-[#0F172A]">
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="text-center mb-8">
            <p className="text-xl text-[#CBD5E1] mb-2">Round {currentRound + 1} of {totalRounds}</p>
          </div>

          <div className="w-full max-w-md aspect-square bg-white rounded-2xl shadow-2xl flex items-center justify-center mb-8 p-12 animate-slide-in">
            {renderShape(currentShape)}
          </div>

          <p className="text-2xl text-white font-semibold mb-12">
            Does this shape match the<br />previous shape?
          </p>
        </div>

        <div className="grid grid-cols-2 gap-0">
          <button
            onClick={() => handleAnswer(false)}
            className="bg-[#0F172A] hover:bg-[#1E293B] text-[#4DD4AC] font-bold py-8 text-3xl border-t-2 border-r border-[#334155] transition-all"
          >
            NO
          </button>
          <button
            onClick={() => handleAnswer(true)}
            className="bg-[#0F172A] hover:bg-[#1E293B] text-[#4DD4AC] font-bold py-8 text-3xl border-t-2 border-l border-[#334155] transition-all"
          >
            YES
          </button>
        </div>

        <style jsx>{`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }

          .animate-slide-in {
            animation: slideIn 0.4s ease-out;
          }
        `}</style>
      </div>
    );
  }

  if (phase === "results") {
    const avgReaction = reactionTimes.length > 0
      ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
      : 0;
    const accuracy = Math.round((correctAnswers / totalRounds) * 100);

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full card-testmate p-8">
          <h2 className="text-4xl font-bold mb-4 text-center text-[#4F7BFE]">
            Test Complete! 🔷
          </h2>
          <div className="text-center mb-8">
            <div className="text-7xl font-bold text-[#A855F7] mb-4">
              {score}
            </div>
            <p className="text-2xl text-[#CBD5E1]">out of 100</p>
          </div>
          <div className="space-y-4 mb-8">
            <div className="flex justify-between p-4 bg-[#0F172A] rounded-lg">
              <span className="text-[#CBD5E1]">Correct Matches:</span>
              <span className="text-white font-bold">{correctAnswers} / {totalRounds}</span>
            </div>
            <div className="flex justify-between p-4 bg-[#0F172A] rounded-lg">
              <span className="text-[#CBD5E1]">Wrong Answers:</span>
              <span className="text-white font-bold">{wrongAnswers}</span>
            </div>
            <div className="flex justify-between p-4 bg-[#0F172A] rounded-lg">
              <span className="text-[#CBD5E1]">Accuracy:</span>
              <span className="text-white font-bold">{accuracy}%</span>
            </div>
            <div className="flex justify-between p-4 bg-[#0F172A] rounded-lg">
              <span className="text-[#CBD5E1]">Avg Reaction Time:</span>
              <span className="text-white font-bold">{avgReaction}ms</span>
            </div>
          </div>
          <button
            onClick={saveAndContinue}
            className="w-full bg-[#4F7BFE] hover:bg-[#A855F7] text-white font-bold py-4 px-8 rounded-lg transition-all shadow-glow-blue hover:shadow-glow-purple"
          >
            View Final Results
          </button>
        </div>
      </div>
    );
  }

  return null;
}
