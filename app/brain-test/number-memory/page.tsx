"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type GamePhase = "intro" | "memorize" | "recall" | "results";

export default function NumberMemoryTest() {
  const router = useRouter();
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [targetNumber, setTargetNumber] = useState("");
  const [userInput, setUserInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(5);
  const [score, setScore] = useState(0);

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
    const number = generateRandomNumber();
    setTargetNumber(number);
    setTimeLeft(5);
    setPhase("memorize");
  };

  const calculateScore = () => {
    if (userInput === targetNumber) {
      return 100;
    }

    // Calculate partial score based on correct digits in correct positions
    let correctDigits = 0;
    const minLength = Math.min(userInput.length, targetNumber.length);

    for (let i = 0; i < minLength; i++) {
      if (userInput[i] === targetNumber[i]) {
        correctDigits++;
      }
    }

    // Score based on accuracy
    const accuracy = correctDigits / 6;
    return Math.round(accuracy * 100);
  };

  const submitAnswer = () => {
    const scoreValue = calculateScore();
    setScore(scoreValue);
    setPhase("results");
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
              You'll see a <strong className="text-white">6-digit number</strong> for 5 seconds.
            </p>
            <p className="text-lg">
              After it disappears, type the number from memory.
            </p>
            <p className="text-lg">
              The more accurate you are, the higher your score!
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
            <div className="text-6xl font-bold text-[#4F7BFE] mb-4">{timeLeft}s</div>
            <p className="text-xl text-[#CBD5E1]">Memorize this number</p>
          </div>
          <div className="card-testmate p-12 text-center hover:shadow-glow-blue">
            <span className="text-7xl font-bold text-white tracking-widest">
              {targetNumber}
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
              What was the number?
            </h2>
            <p className="text-xl text-[#CBD5E1]">
              Type the 6-digit number you memorized
            </p>
          </div>
          <div className="card-testmate p-8 mb-8">
            <input
              type="text"
              maxLength={6}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value.replace(/\D/g, ""))}
              className="w-full bg-[#0F172A] text-white text-5xl text-center font-bold py-6 px-4 rounded-lg border-2 border-[#334155] focus:border-[#4F7BFE] focus:outline-none tracking-widest"
              placeholder="000000"
              autoFocus
            />
          </div>
          <button
            onClick={submitAnswer}
            disabled={userInput.length !== 6}
            className={`w-full font-bold py-4 px-8 rounded-lg transition-all ${
              userInput.length === 6
                ? "bg-[#4F7BFE] hover:bg-[#A855F7] text-white shadow-glow-blue hover:shadow-glow-purple"
                : "bg-[#334155] text-[#CBD5E1] cursor-not-allowed"
            }`}
          >
            Submit Answer
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
            <div className="p-4 bg-[#0F172A] rounded-lg">
              <p className="text-[#CBD5E1] mb-2">Correct Number:</p>
              <p className="text-3xl font-bold text-white tracking-widest text-center">
                {targetNumber}
              </p>
            </div>
            <div className="p-4 bg-[#0F172A] rounded-lg">
              <p className="text-[#CBD5E1] mb-2">Your Answer:</p>
              <p className="text-3xl font-bold text-white tracking-widest text-center">
                {userInput}
              </p>
            </div>
            <div className="flex justify-between p-4 bg-[#0F172A] rounded-lg">
              <span className="text-[#CBD5E1]">Accuracy:</span>
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
