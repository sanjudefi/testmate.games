"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface TestResult {
  name: string;
  score: number;
  icon: string;
  color: string;
}

export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<TestResult[]>([]);
  const [overallScore, setOverallScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load all scores from localStorage
    const wordMemory = parseInt(localStorage.getItem("wordMemoryScore") || "0");
    const numberMemory = parseInt(localStorage.getItem("numberMemoryScore") || "0");
    const chimpTest = parseInt(localStorage.getItem("chimpTestScore") || "0");
    const aimTrainer = parseInt(localStorage.getItem("aimTrainerScore") || "0");

    const testResults: TestResult[] = [
      { name: "Word Memory", score: wordMemory, icon: "🧠", color: "#4F7BFE" },
      { name: "Number Memory", score: numberMemory, icon: "🔢", color: "#4F7BFE" },
      { name: "Chimp Test", score: chimpTest, icon: "🐵", color: "#A855F7" },
      { name: "Aim Trainer", score: aimTrainer, icon: "🎯", color: "#A855F7" },
    ];

    setResults(testResults);

    // Calculate overall score
    const total = wordMemory + numberMemory + chimpTest + aimTrainer;
    const average = Math.round(total / 4);
    setOverallScore(average);

    setLoading(false);
  }, []);

  const getScoreRating = (score: number): string => {
    if (score >= 90) return "Excellent!";
    if (score >= 75) return "Great!";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Keep Practicing!";
  };

  const getScoreColor = (score: number): string => {
    if (score >= 75) return "#4F7BFE";
    if (score >= 50) return "#A855F7";
    return "#CBD5E1";
  };

  const resetTests = () => {
    localStorage.removeItem("wordMemoryScore");
    localStorage.removeItem("numberMemoryScore");
    localStorage.removeItem("chimpTestScore");
    localStorage.removeItem("aimTrainerScore");
    router.push("/");
  };

  const retakeTests = () => {
    resetTests();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-[#CBD5E1]">Loading results...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#4F7BFE] to-[#A855F7] bg-clip-text text-transparent">
            Brain Test Complete!
          </h1>
          <p className="text-xl text-[#CBD5E1]">Here's how you performed</p>
        </div>

        {/* Overall Score */}
        <div className="card-testmate p-8 mb-8 text-center">
          <h2 className="text-2xl text-[#CBD5E1] mb-4">Overall Score</h2>
          <div
            className="text-8xl font-bold mb-4"
            style={{ color: getScoreColor(overallScore) }}
          >
            {overallScore}
          </div>
          <p className="text-3xl font-bold text-white mb-2">
            {getScoreRating(overallScore)}
          </p>
          <p className="text-lg text-[#CBD5E1]">out of 100</p>
        </div>

        {/* Individual Test Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {results.map((result, index) => (
            <div
              key={index}
              className="card-testmate p-6 hover:shadow-glow-blue transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{result.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {result.name}
                    </h3>
                    <p className="text-sm text-[#CBD5E1]">
                      {getScoreRating(result.score)}
                    </p>
                  </div>
                </div>
                <div
                  className="text-4xl font-bold"
                  style={{ color: result.color }}
                >
                  {result.score}
                </div>
              </div>
              <div className="mt-4 bg-[#0F172A] rounded-full h-3 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${result.score}%`,
                    backgroundColor: result.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={retakeTests}
            className="bg-[#4F7BFE] hover:bg-[#A855F7] text-white font-bold py-4 px-8 rounded-lg transition-all shadow-glow-blue hover:shadow-glow-purple"
          >
            Retake All Tests
          </button>
          <button
            onClick={() => router.push("/")}
            className="bg-[#334155] hover:bg-[#1E293B] text-white font-bold py-4 px-8 rounded-lg transition-all"
          >
            Back to Home
          </button>
        </div>

        {/* Detailed Breakdown */}
        <div className="card-testmate p-8 mt-8">
          <h3 className="text-2xl font-bold text-white mb-6">
            Performance Breakdown
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-[#0F172A] rounded-lg">
              <span className="text-[#CBD5E1]">Memory Skills:</span>
              <span className="text-white font-bold">
                {Math.round((results[0].score + results[1].score) / 2)}%
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-[#0F172A] rounded-lg">
              <span className="text-[#CBD5E1]">Visual Processing:</span>
              <span className="text-white font-bold">{results[2].score}%</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-[#0F172A] rounded-lg">
              <span className="text-[#CBD5E1]">Reaction Speed:</span>
              <span className="text-white font-bold">{results[3].score}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
