"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type GamePhase = "intro" | "memorize" | "recall" | "results";

export default function NumberMemoryTest() {
  const router = useRouter();
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [currentNumberIndex, setCurrentNumberIndex] = useState(0);
  const [targetNumbers, setTargetNumbers] = useState<string[]>([]);
  const [userInput, setUserInput] = useState("");
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(4);
  const [numberScores, setNumberScores] = useState<number[]>([]);
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    if (phase === "memorize" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (phase === "memorize" && timeLeft === 0) {
      setPhase("recall");
    }
  }, [phase, timeLeft]);

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
    setUserAnswers([]);
    setNumberScores([]);
    setTimeLeft(4);
    setPhase("memorize");
  };

  const calculateNumberScore = (target: string, input: string): number => {
    if (input === target) {
      return 100;
    }

    // Partial credit for correct digits in correct positions
    let correctDigits = 0;
    const minLength = Math.min(input.length, target.length);
    for (let i = 0; i < minLength; i++) {
      if (input[i] === target[i]) {
        correctDigits++;
      }
    }

    const accuracy = correctDigits / 6;
    return Math.round(accuracy * 100);
  };

  const submitNumberAnswer = () => {
    const target = targetNumbers[currentNumberIndex];
    const score = calculateNumberScore(target, userInput);
    const newScores = [...numberScores, score];
    const newAnswers = [...userAnswers, userInput];

    setNumberScores(newScores);
    setUserAnswers(newAnswers);
    setUserInput("");

    if (currentNumberIndex < 2) {
      // Move to next number
      setCurrentNumberIndex(currentNumberIndex + 1);
      setTimeLeft(4);
      setPhase("memorize");
    } else {
      // All numbers complete
      const avgScore = Math.round(newScores.reduce((a, b) => a + b, 0) / 3);
      setTotalScore(avgScore);
      setPhase("results");
    }
  };

  const saveAndContinue = () => {
    localStorage.setItem("numberMemoryScore", totalScore.toString());
    router.push("/brain-test/chimp-test");
  };

  if (phase === "intro") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full card-tutortom p-8">
          <h1 className="text-4xl font-bold mb-4 text-[#4F7BFE]">
            🔢 Number Memory Test
          </h1>
          <div className="space-y-4 text-[#CBD5E1] mb-8">
            <p className="text-lg">
              You'll see a <strong className="text-white">6-digit number</strong> for <strong className="text-white">4 seconds</strong>.
            </p>
            <p className="text-lg">
              After each number disappears, type it immediately.
            </p>
            <p className="text-lg">
              This repeats <strong className="text-white">3 times</strong> with different numbers.
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
          <div className="card-tutortom p-12 text-center hover:shadow-glow-blue">
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
              Number {currentNumberIndex + 1}: What was it?
            </h2>
            <p className="text-xl text-[#CBD5E1]">
              Type the 6-digit number you just saw
            </p>
          </div>
          <div className="card-tutortom p-8 mb-8">
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value.replace(/\D/g, ""))}
              className="w-full bg-[#0F172A] text-white text-5xl text-center font-bold py-6 px-4 rounded-lg border-2 border-[#334155] focus:border-[#4F7BFE] focus:outline-none tracking-widest"
              placeholder="000000"
              autoFocus
            />
          </div>
          <button
            onClick={submitNumberAnswer}
            disabled={userInput.length !== 6}
            className={`w-full font-bold py-4 px-8 rounded-lg transition-all ${
              userInput.length === 6
                ? "bg-[#4F7BFE] hover:bg-[#A855F7] text-white shadow-glow-blue hover:shadow-glow-purple"
                : "bg-[#334155] text-[#CBD5E1] cursor-not-allowed"
            }`}
          >
            {currentNumberIndex < 2 ? "Next Number" : "Finish Test"}
          </button>
        </div>
      </div>
    );
  }

  if (phase === "results") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full card-tutortom p-8">
          <h2 className="text-4xl font-bold mb-4 text-center text-[#4F7BFE]">
            Results
          </h2>
          <div className="text-center mb-8">
            <div className="text-7xl font-bold text-[#A855F7] mb-4">
              {totalScore}
            </div>
            <p className="text-2xl text-[#CBD5E1]">out of 100</p>
          </div>
          <div className="space-y-4 mb-8">
            {targetNumbers.map((target, index) => (
              <div key={index} className="p-4 bg-[#0F172A] rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[#CBD5E1]">Number {index + 1}:</span>
                  <span className="text-white font-bold">{numberScores[index]}%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div>
                    <p className="text-[#CBD5E1]">Correct:</p>
                    <p className="text-xl font-bold text-white tracking-wider">
                      {target}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#CBD5E1]">Your Answer:</p>
                    <p className="text-xl font-bold text-white tracking-wider">
                      {userAnswers[index]}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-between p-4 bg-[#0F172A] rounded-lg border-2 border-[#4F7BFE]">
              <span className="text-[#CBD5E1]">Average Score:</span>
              <span className="text-white font-bold">{totalScore}%</span>
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
