"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type GamePhase = "intro" | "memorize" | "playing" | "results";

interface Square {
  id: number;
  number: number;
  x: number;
  y: number;
  visible: boolean;
}

export default function ChimpTest() {
  const router = useRouter();
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [squares, setSquares] = useState<Square[]>([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [timeLeft, setTimeLeft] = useState(5);
  const [mistakes, setMistakes] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (phase === "memorize" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (phase === "memorize" && timeLeft === 0) {
      hideNumbers();
    }
  }, [phase, timeLeft]);

  const generateSquares = () => {
    const newSquares: Square[] = [];
    const gridSize = 5; // 5x5 grid positions
    const positions = new Set<string>();

    for (let i = 1; i <= 5; i++) {
      let x, y;
      do {
        x = Math.floor(Math.random() * gridSize);
        y = Math.floor(Math.random() * gridSize);
      } while (positions.has(`${x}-${y}`));

      positions.add(`${x}-${y}`);
      newSquares.push({
        id: i,
        number: i,
        x,
        y,
        visible: true,
      });
    }

    return newSquares;
  };

  const startTest = () => {
    const newSquares = generateSquares();
    setSquares(newSquares);
    setCurrentNumber(1);
    setMistakes(0);
    setPhase("memorize");
    setTimeLeft(5);
  };

  const hideNumbers = () => {
    setSquares(squares.map(sq => ({ ...sq, visible: false })));
    setPhase("playing");
  };

  const handleSquareClick = (square: Square) => {
    if (square.number === currentNumber) {
      // Correct click
      const newSquares = squares.filter(sq => sq.id !== square.id);
      setSquares(newSquares);
      setCurrentNumber(currentNumber + 1);

      if (newSquares.length === 0) {
        // All squares clicked correctly
        calculateScore();
      }
    } else {
      // Wrong click
      setMistakes(mistakes + 1);
      if (mistakes + 1 >= 3) {
        // Game over after 3 mistakes
        calculateScore();
      }
    }
  };

  const calculateScore = () => {
    // Score based on correct clicks and mistakes
    const correctClicks = currentNumber - 1;
    const maxClicks = 5;
    const accuracy = correctClicks / maxClicks;
    const mistakePenalty = mistakes * 0.1;
    const finalScore = Math.max(0, Math.round((accuracy - mistakePenalty) * 100));
    setScore(finalScore);
    setPhase("results");
  };

  const saveAndContinue = () => {
    localStorage.setItem("chimpTestScore", score.toString());
    router.push("/brain-test/aim-trainer");
  };

  if (phase === "intro") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full card-tutortom p-8">
          <h1 className="text-4xl font-bold mb-4 text-[#A855F7]">
            🐵 Chimp Test
          </h1>
          <div className="space-y-4 text-[#CBD5E1] mb-8">
            <p className="text-lg">
              You'll see <strong className="text-white">5 numbered squares</strong> for 5 seconds.
            </p>
            <p className="text-lg">
              After the numbers disappear, click the squares in order from 1 to 5.
            </p>
            <p className="text-lg">
              You can make up to <strong className="text-white">3 mistakes</strong> before the test ends.
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

  if (phase === "memorize") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <div className="text-6xl font-bold text-[#A855F7] mb-4">{timeLeft}s</div>
            <p className="text-xl text-[#CBD5E1]">Memorize the positions</p>
          </div>
          <div className="relative w-full aspect-square max-w-2xl mx-auto">
            {squares.map((square) => (
              <div
                key={square.id}
                className="absolute w-20 h-20 md:w-24 md:h-24 card-tutortom flex items-center justify-center shadow-glow-purple cursor-not-allowed"
                style={{
                  left: `${square.x * 20}%`,
                  top: `${square.y * 20}%`,
                }}
              >
                <span className="text-4xl font-bold text-white">
                  {square.number}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (phase === "playing") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <p className="text-xl text-[#CBD5E1] mb-2">
              Click the squares in order: <span className="text-white font-bold">{currentNumber}</span>
            </p>
            <p className="text-lg text-[#CBD5E1]">
              Mistakes: <span className={mistakes >= 2 ? "text-red-500 font-bold" : "text-white"}>{mistakes} / 3</span>
            </p>
          </div>
          <div className="relative w-full aspect-square max-w-2xl mx-auto">
            {squares.map((square) => (
              <button
                key={square.id}
                onClick={() => handleSquareClick(square)}
                className="absolute w-20 h-20 md:w-24 md:h-24 bg-[#A855F7] hover:bg-[#4F7BFE] rounded-lg flex items-center justify-center shadow-glow-purple hover:shadow-glow-blue transition-all"
                style={{
                  left: `${square.x * 20}%`,
                  top: `${square.y * 20}%`,
                }}
              >
                <span className="text-4xl font-bold text-white opacity-0">
                  {square.number}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (phase === "results") {
    const correctClicks = currentNumber - 1;

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full card-tutortom p-8">
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
              <span className="text-[#CBD5E1]">Correct Clicks:</span>
              <span className="text-white font-bold">{correctClicks} / 5</span>
            </div>
            <div className="flex justify-between p-4 bg-[#0F172A] rounded-lg">
              <span className="text-[#CBD5E1]">Mistakes:</span>
              <span className="text-white font-bold">{mistakes}</span>
            </div>
            <div className="flex justify-between p-4 bg-[#0F172A] rounded-lg">
              <span className="text-[#CBD5E1]">Accuracy:</span>
              <span className="text-white font-bold">{score}%</span>
            </div>
          </div>
          <button
            onClick={saveAndContinue}
            className="w-full bg-[#A855F7] hover:bg-[#4F7BFE] text-white font-bold py-4 px-8 rounded-lg transition-all shadow-glow-purple hover:shadow-glow-blue"
          >
            Continue to Aim Trainer
          </button>
        </div>
      </div>
    );
  }

  return null;
}
