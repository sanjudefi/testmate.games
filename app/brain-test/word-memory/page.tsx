"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getRandomWords, getConfusingWords } from "@/lib/data/words";

type GamePhase = "intro" | "memorize" | "recall" | "results";

export default function WordMemoryTest() {
  const router = useRouter();
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [currentRound, setCurrentRound] = useState(1);
  const [allRoundWords, setAllRoundWords] = useState<string[][]>([]);
  const [currentWords, setCurrentWords] = useState<string[]>([]);
  const [allWords, setAllWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(5);
  const [roundScores, setRoundScores] = useState<number[]>([]);
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    if (phase === "memorize" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (phase === "memorize" && timeLeft === 0) {
      startRecallPhase();
    }
  }, [phase, timeLeft]);

  const startTest = () => {
    // Generate 3 DIFFERENT sets of 5 words each
    const round1Words = getRandomWords(5);
    const round2Words = getRandomWords(5);
    const round3Words = getRandomWords(5);

    setAllRoundWords([round1Words, round2Words, round3Words]);
    setCurrentWords(round1Words);
    setCurrentRound(1);
    setRoundScores([]);
    setTimeLeft(5);
    setPhase("memorize");
  };

  const startRecallPhase = () => {
    const confusing = getConfusingWords(currentWords, 5);
    const mixed = [...currentWords, ...confusing].sort(() => Math.random() - 0.5);
    setAllWords(mixed);
    setSelectedWords([]);
    setPhase("recall");
  };

  const toggleWord = (word: string) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter(w => w !== word));
    } else if (selectedWords.length < 5) {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const submitRoundAnswers = () => {
    const correct = selectedWords.filter(word => currentWords.includes(word)).length;
    const roundScore = (correct / 5) * 100;
    const newRoundScores = [...roundScores, Math.round(roundScore)];
    setRoundScores(newRoundScores);

    if (currentRound < 3) {
      // Move to next round with NEW words
      const nextRound = currentRound + 1;
      setCurrentRound(nextRound);
      setCurrentWords(allRoundWords[nextRound - 1]);
      setTimeLeft(5);
      setPhase("memorize");
    } else {
      // All rounds complete
      const avgScore = Math.round(newRoundScores.reduce((a, b) => a + b, 0) / 3);
      setTotalScore(avgScore);
      setPhase("results");
    }
  };

  const saveAndContinue = () => {
    localStorage.setItem("wordMemoryScore", totalScore.toString());
    router.push("/brain-test/number-memory");
  };

  if (phase === "intro") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full card-tutortom p-8">
          <h1 className="text-4xl font-bold mb-4 text-[#4F7BFE]">
            🧠 Word Memory Test
          </h1>
          <div className="space-y-4 text-[#CBD5E1] mb-8">
            <p className="text-lg">
              You'll see <strong className="text-white">5 DIFFERENT words</strong> for <strong className="text-white">5 seconds</strong>.
            </p>
            <p className="text-lg">
              After each round, immediately select the 5 words you saw.
            </p>
            <p className="text-lg">
              This repeats <strong className="text-white">3 times</strong> with NEW words each time.
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
              Round {currentRound} of 3
            </div>
            <div className="text-6xl font-bold text-[#4F7BFE] mb-4">{timeLeft}s</div>
            <p className="text-xl text-[#CBD5E1]">Memorize these NEW words</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentWords.map((word, index) => (
              <div
                key={index}
                className="card-tutortom p-8 text-center hover:shadow-glow-blue transition-all"
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
              Round {currentRound}: Select the 5 words
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
            onClick={submitRoundAnswers}
            disabled={selectedWords.length !== 5}
            className={`w-full font-bold py-4 px-8 rounded-lg transition-all ${
              selectedWords.length === 5
                ? "bg-[#4F7BFE] hover:bg-[#A855F7] text-white shadow-glow-blue hover:shadow-glow-purple"
                : "bg-[#334155] text-[#CBD5E1] cursor-not-allowed"
            }`}
          >
            {currentRound < 3 ? "Next Round" : "Finish Test"}
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
            {roundScores.map((score, index) => (
              <div key={index} className="flex justify-between p-4 bg-[#0F172A] rounded-lg">
                <span className="text-[#CBD5E1]">Round {index + 1}:</span>
                <span className="text-white font-bold">{score}%</span>
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
            Continue to Number Memory Test
          </button>
        </div>
      </div>
    );
  }

  return null;
}
