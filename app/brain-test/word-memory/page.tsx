"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getRandomWords, getConfusingWords } from "@/lib/data/words";

type GamePhase = "intro" | "memorize" | "recall" | "results";

export default function WordMemoryTest() {
  const router = useRouter();
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [originalWords, setOriginalWords] = useState<string[]>([]);
  const [allWords, setAllWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(5);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (phase === "memorize" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (phase === "memorize" && timeLeft === 0) {
      startRecallPhase();
    }
  }, [phase, timeLeft]);

  const startTest = () => {
    const words = getRandomWords(5);
    setOriginalWords(words);
    setTimeLeft(5);
    setPhase("memorize");
  };

  const startRecallPhase = () => {
    const confusing = getConfusingWords(originalWords, 5);
    const mixed = [...originalWords, ...confusing].sort(() => Math.random() - 0.5);
    setAllWords(mixed);
    setPhase("recall");
  };

  const toggleWord = (word: string) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter(w => w !== word));
    } else if (selectedWords.length < 5) {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const submitAnswers = () => {
    const correct = selectedWords.filter(word => originalWords.includes(word)).length;
    const scoreValue = (correct / 5) * 100;
    setScore(Math.round(scoreValue));
    setPhase("results");
  };

  const saveAndContinue = () => {
    localStorage.setItem("wordMemoryScore", score.toString());
    router.push("/brain-test/number-memory");
  };

  if (phase === "intro") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full card-testmate p-8">
          <h1 className="text-4xl font-bold mb-4 text-[#4F7BFE]">
            🧠 Word Memory Test
          </h1>
          <div className="space-y-4 text-[#CBD5E1] mb-8">
            <p className="text-lg">
              In this test, you'll see <strong className="text-white">5 words</strong> for 5 seconds.
            </p>
            <p className="text-lg">
              After they disappear, you'll see <strong className="text-white">10 words</strong> (5 original + 5 confusing).
            </p>
            <p className="text-lg">
              Select the <strong className="text-white">5 original words</strong> you memorized.
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
            <p className="text-xl text-[#CBD5E1]">Memorize these words</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {originalWords.map((word, index) => (
              <div
                key={index}
                className="card-testmate p-8 text-center hover:shadow-glow-blue transition-all"
              >
                <span className="text-3xl font-bold text-white capitalize">
                  {word}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (phase === "recall") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#4F7BFE] mb-2">
              Select the 5 words you memorized
            </h2>
            <p className="text-xl text-[#CBD5E1]">
              Selected: {selectedWords.length} / 5
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {allWords.map((word, index) => (
              <button
                key={index}
                onClick={() => toggleWord(word)}
                className={`p-6 rounded-lg font-bold text-lg transition-all ${
                  selectedWords.includes(word)
                    ? "bg-[#4F7BFE] text-white shadow-glow-blue"
                    : "bg-[#1E293B] text-[#CBD5E1] border border-[#334155] hover:border-[#4F7BFE]"
                }`}
              >
                {word}
              </button>
            ))}
          </div>
          <button
            onClick={submitAnswers}
            disabled={selectedWords.length !== 5}
            className={`w-full font-bold py-4 px-8 rounded-lg transition-all ${
              selectedWords.length === 5
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
            <div className="flex justify-between p-4 bg-[#0F172A] rounded-lg">
              <span className="text-[#CBD5E1]">Correct Words:</span>
              <span className="text-white font-bold">
                {selectedWords.filter(w => originalWords.includes(w)).length} / 5
              </span>
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
            Continue to Number Memory Test
          </button>
        </div>
      </div>
    );
  }

  return null;
}
