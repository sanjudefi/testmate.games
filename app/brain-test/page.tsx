"use client";

import { useRouter } from "next/navigation";

export default function BrainTestPage() {
  const router = useRouter();

  const startFullTest = () => {
    // Clear any previous scores
    localStorage.removeItem("wordMemoryScore");
    localStorage.removeItem("numberMemoryScore");
    localStorage.removeItem("chimpTestScore");
    localStorage.removeItem("catchFishScore");
    localStorage.removeItem("mathSpeedScore");
    localStorage.removeItem("speedMatchScore");

    // Start with the first test
    router.push("/brain-test/word-memory");
  };

  const tests = [
    {
      name: "Word Memory",
      description: "Remember 5 different words each round, 3 rounds total",
      icon: "🧠",
      color: "#4F7BFE",
      path: "/brain-test/word-memory",
    },
    {
      name: "Number Memory",
      description: "Recall 3 different 6-digit numbers, one at a time",
      icon: "🔢",
      color: "#4F7BFE",
      path: "/brain-test/number-memory",
    },
    {
      name: "Chimp Test",
      description: "Click numbered squares in sequence from memory",
      icon: "🐵",
      color: "#A855F7",
      path: "/brain-test/chimp-test",
    },
    {
      name: "Catch the Fish",
      description: "Catch fish as fast as you can for 10 seconds",
      icon: "🐟",
      color: "#A855F7",
      path: "/brain-test/aim-trainer",
    },
    {
      name: "Math Speed",
      description: "Solve 5 addition problems in 10 seconds each",
      icon: "➕",
      color: "#A855F7",
      path: "/brain-test/math-speed",
    },
    {
      name: "Speed Match",
      description: "Match shapes quickly - visual memory test",
      icon: "🔷",
      color: "#4F7BFE",
      path: "/brain-test/speed-match",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#4F7BFE] to-[#A855F7] bg-clip-text text-transparent">
            Daily Brain Test
          </h1>
          <p className="text-xl text-[#CBD5E1] mb-6">
            Complete all 6 tests to get your comprehensive brain score
          </p>
          <button
            onClick={startFullTest}
            className="bg-gradient-to-r from-[#4F7BFE] to-[#A855F7] hover:from-[#A855F7] hover:to-[#4F7BFE] text-white font-bold py-4 px-12 rounded-lg transition-all shadow-glow-blue hover:shadow-glow-purple text-lg"
          >
            Start Full Test
          </button>
        </div>

        <div className="card-testmate p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            What You'll Test
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tests.map((test, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-[#0F172A] rounded-lg hover:bg-[#1a2332] transition-all"
              >
                <div className="text-4xl">{test.icon}</div>
                <div className="flex-1">
                  <h3
                    className="text-lg font-bold mb-1"
                    style={{ color: test.color }}
                  >
                    {index + 1}. {test.name}
                  </h3>
                  <p className="text-sm text-[#CBD5E1]">{test.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-testmate p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">How It Works</h2>
          <div className="space-y-4 text-[#CBD5E1]">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#4F7BFE] flex items-center justify-center font-bold text-white flex-shrink-0">
                1
              </div>
              <p>
                Complete all 6 brain tests in sequence. Each test measures a
                different cognitive ability.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#4F7BFE] flex items-center justify-center font-bold text-white flex-shrink-0">
                2
              </div>
              <p>
                Each test is scored out of 100 based on accuracy, speed, and
                performance.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#4F7BFE] flex items-center justify-center font-bold text-white flex-shrink-0">
                3
              </div>
              <p>
                After completing all tests, you'll receive an overall brain
                score and detailed breakdown.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#4F7BFE] flex items-center justify-center font-bold text-white flex-shrink-0">
                4
              </div>
              <p>
                Take the test daily to track your progress and improve your
                cognitive abilities!
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => router.push("/")}
            className="bg-[#334155] hover:bg-[#1E293B] text-white font-bold py-4 px-8 rounded-lg transition-all"
          >
            Back to Home
          </button>
          <button
            onClick={startFullTest}
            className="bg-[#4F7BFE] hover:bg-[#A855F7] text-white font-bold py-4 px-8 rounded-lg transition-all shadow-glow-blue hover:shadow-glow-purple"
          >
            Begin Testing
          </button>
        </div>
      </div>
    </div>
  );
}
