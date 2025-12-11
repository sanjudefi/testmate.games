"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type GamePhase = "intro" | "memorize" | "recall" | "results";

export default function NumberMemoryTest() {
  const router = useRouter();
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [targetNumbers, setTargetNumbers] = useState<string[]>([]);
  const [userInputs, setUserInputs] = useState<string[]>(["", "", ""]);
  const [timeLeft, setTimeLeft] = useState(4);
  const [currentNumberIndex, setCurrentNumberIndex] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (phase === "memorize" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (phase === "memorize" && timeLeft === 0) {
      if (currentNumberIndex < 2) {
        // Move to next number
        setCurrentNumberIndex(currentNumberIndex + 1);
        setTimeLeft(4);
      } else {
        // All 3 numbers shown, move to recall
        setPhase("recall");
      }
    }
  }, [phase, timeLeft, currentNumberIndex]);

  const generateRandomNumber = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const startTest = () => {
    const numbers = [
      generateRandomNumber(),
      generateRandomNumber(),
      generateRandomNumber(),
    ];
    setTargetNumbers(numbers);
    setCurrentNumberIndex(0);
    setTimeLeft(4);
    setPhase("memorize");
  };

  const calculateScore = () => {
    let totalCorrectDigits = 0;

    for (let i = 0; i < 3; i++) {
      const target = targetNumbers[i];
      const input = userInputs[i];

      if (input === target) {
        totalCorrectDigits += 6; // Full marks for exact match
      } else {
        // Partial credit for correct digits in correct positions
        const minLength = Math.min(input.length, target.length);
        for (let j = 0; j < minLength; j++) {
          if (input[j] === target[j]) {
            totalCorrectDigits++;
          }
        }
      }
    }

    // Total possible correct digits: 18 (3 numbers × 6 digits)
    const accuracy = totalCorrectDigits / 18;
    return Math.round(accuracy * 100);
  };

  const submitAnswer = () => {
    const scoreValue = calculateScore();
    setScore(scoreValue);
    setPhase("results");
  };

  const updateUserInput = (index: number, value: string) => {
    const newInputs = [...userInputs];
    newInputs[index] = value.replace(/\D/g, "");
    setUserInputs(newInputs);
  };

  const saveAndContinue = () => {
    localStorage.setItem("numberMemoryScore", score.toString());
    router.push("/brain-test/chimp-test");
  };

  if (phase === "intro") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full card-testmate p-8">
          <h1 className="text-4xl font-bold mb-4 text-[#4F7BFE]">
            🔢 Number Memory Test
          </h1>
          <div className="space-y-4 text-[#CBD5E1] mb-8">
            <p className="text-lg">
              You'll see <strong className="text-white">3 different 6-digit numbers</strong>.
            </p>
            <p className="text-lg">
              Each number is shown for <strong className="text-white">4 seconds</strong>.
            </p>
            <p className="text-lg">
              After all 3 numbers, recall each one in order.
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
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <div className="text-2xl text-[#CBD5E1] mb-2">
              Number {currentNumberIndex + 1} of 3
            </div>
            <div className="text-6xl font-bold text-[#4F7BFE] mb-4">{timeLeft}s</div>
            <p className="text-xl text-[#CBD5E1]">Memorize this number</p>
          </div>
          <div className="card-testmate p-12 text-center hover:shadow-glow-blue">
            <span className="text-7xl font-bold text-white tracking-widest">
              {targetNumbers[currentNumberIndex]}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "recall") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#4F7BFE] mb-2">
              Recall all 3 numbers
            </h2>
            <p className="text-xl text-[#CBD5E1]">
              Type each 6-digit number you memorized
            </p>
          </div>
          <div className="space-y-4 mb-8">
            {[0, 1, 2].map((index) => (
              <div key={index} className="card-testmate p-6">
                <p className="text-lg text-[#CBD5E1] mb-3 text-center">
                  Number {index + 1}
                </p>
                <input
                  type="text"
                  maxLength={6}
                  value={userInputs[index]}
                  onChange={(e) => updateUserInput(index, e.target.value)}
                  className="w-full bg-[#0F172A] text-white text-4xl text-center font-bold py-4 px-4 rounded-lg border-2 border-[#334155] focus:border-[#4F7BFE] focus:outline-none tracking-widest"
                  placeholder="000000"
                />
              </div>
            ))}
          </div>
          <button
            onClick={submitAnswer}
            disabled={userInputs.some(input => input.length !== 6)}
            className={`w-full font-bold py-4 px-8 rounded-lg transition-all ${
              userInputs.every(input => input.length === 6)
                ? "bg-[#4F7BFE] hover:bg-[#A855F7] text-white shadow-glow-blue hover:shadow-glow-purple"
                : "bg-[#334155] text-[#CBD5E1] cursor-not-allowed"
            }`}
          >
            Submit Answers
          </button>
        </div>
      </div>
    );
  }

  if (phase === "results") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full card-testmate p-8">
          <h2 className="text-4xl font-bold mb-4 text-center text-[#4F7BFE]">
            Results
          </h2>
          <div className="text-center mb-8">
            <div className="text-7xl font-bold text-[#A855F7] mb-4">
              {score}
            </div>
            <p className="text-2xl text-[#CBD5E1]">out of 100</p>
          </div>
          <div className="space-y-4 mb-8">
            {targetNumbers.map((target, index) => (
              <div key={index} className="p-4 bg-[#0F172A] rounded-lg">
                <p className="text-[#CBD5E1] mb-2">Number {index + 1}:</p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-[#CBD5E1]">Correct:</p>
                    <p className="text-2xl font-bold text-white tracking-wider">
                      {target}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#CBD5E1]">Your Answer:</p>
                    <p className="text-2xl font-bold text-white tracking-wider">
                      {userInputs[index]}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-between p-4 bg-[#0F172A] rounded-lg">
              <span className="text-[#CBD5E1]">Overall Accuracy:</span>
              <span className="text-white font-bold">{score}%</span>
            </div>
          </div>
          <button
            onClick={saveAndContinue}
            className="w-full bg-[#4F7BFE] hover:bg-[#A855F7] text-white font-bold py-4 px-8 rounded-lg transition-all shadow-glow-blue hover:shadow-glow-purple"
          >
            Continue to Chimp Test
          </button>
        </div>
      </div>
    );
  }

  return null;
}
