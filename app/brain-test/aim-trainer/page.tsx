"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type GamePhase = "intro" | "playing" | "results";

interface Fish {
  id: number;
  x: number;
  y: number;
  isAngry?: boolean; // Track if fish was just caught
}

export default function CatchTheFish() {
  const router = useRouter();
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [fishes, setFishes] = useState<Fish[]>([]);
  const [caught, setCaught] = useState(0);
  const [missed, setMissed] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(10);
  const [score, setScore] = useState(0);
  const fishAppearTime = useRef<number>(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (phase === "playing" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (phase === "playing" && timeLeft === 0) {
      endGame();
    }
  }, [phase, timeLeft]);

  useEffect(() => {
    if (phase === "playing" && fishes.length === 0) {
      spawnFish();
    }
  }, [phase, fishes]);

  const spawnFish = () => {
    if (!gameAreaRef.current) return;

    const areaWidth = gameAreaRef.current.clientWidth;
    const areaHeight = gameAreaRef.current.clientHeight;
    const fishSize = 120; // Increased from 80 for larger fish

    const x = Math.random() * (areaWidth - fishSize);
    const y = Math.random() * (areaHeight - fishSize);

    const newFish: Fish = {
      id: Date.now(),
      x,
      y,
    };

    setFishes([newFish]);
    fishAppearTime.current = Date.now();
  };

  const startTest = () => {
    setCaught(0);
    setMissed(0);
    setReactionTimes([]);
    setTimeLeft(10);
    setPhase("playing");
  };

  const handleFishClick = (fishId: number, fishX: number, fishY: number) => {
    const reactionTime = Date.now() - fishAppearTime.current;
    setReactionTimes([...reactionTimes, reactionTime]);
    setCaught(caught + 1);

    // Make fish turn red/angry
    setFishes(current =>
      current.map(f => f.id === fishId ? { ...f, isAngry: true } : f)
    );

    // Remove fish after showing angry state
    setTimeout(() => {
      setFishes(current => current.filter(f => f.id !== fishId));
      // Spawn next fish
      setTimeout(spawnFish, 100);
    }, 200);
  };

  const handleMissClick = () => {
    setMissed(missed + 1);
  };

  const endGame = () => {
    const totalClicks = caught + missed;
    const accuracy = totalClicks > 0 ? caught / totalClicks : 0;
    const avgReactionTime = reactionTimes.length > 0
      ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length
      : 0;

    // Score calculation:
    // 50% accuracy, 30% reaction time, 20% total catches
    const accuracyScore = accuracy * 50;
    const reactionScore = Math.max(0, 30 - (avgReactionTime / 100)) * 1.5;
    const catchScore = Math.min(caught * 2, 20);

    const finalScore = Math.round(accuracyScore + reactionScore + catchScore);
    setScore(Math.min(finalScore, 100));
    setPhase("results");
  };

  const saveAndContinue = () => {
    localStorage.setItem("catchFishScore", score.toString());
    router.push("/brain-test/math-speed");
  };

  if (phase === "intro") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full card-tutortom p-8">
          <h1 className="text-4xl font-bold mb-4 text-[#A855F7]">
            🐟 Catch the Fish
          </h1>
          <div className="space-y-4 text-[#CBD5E1] mb-8">
            <p className="text-lg">
              Catch as many fish as you can in <strong className="text-white">10 seconds</strong>!
            </p>
            <p className="text-lg">
              Click on the fish quickly to catch them.
            </p>
            <p className="text-lg">
              Your score is based on accuracy, reaction time, and total catches.
            </p>
          </div>
          <button
            onClick={startTest}
            className="w-full bg-[#A855F7] hover:bg-[#4F7BFE] text-white font-bold py-4 px-8 rounded-lg transition-all shadow-glow-purple hover:shadow-glow-blue"
          >
            Start Fishing
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
    return (
      <div className="min-h-screen flex flex-col p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg text-[#CBD5E1]">
            Time: <span className="text-white font-bold">{timeLeft}s</span>
          </div>
          <div className="text-lg text-[#CBD5E1]">
            Caught: <span className="text-[#4F7BFE] font-bold">{caught}</span> |
            Missed: <span className="text-[#A855F7] font-bold">{missed}</span>
          </div>
        </div>
        <div
          ref={gameAreaRef}
          onClick={handleMissClick}
          className="flex-1 relative rounded-lg border-2 border-[#4F7BFE] cursor-crosshair overflow-hidden"
          style={{
            background: "linear-gradient(180deg, rgba(30, 64, 175, 0.3) 0%, rgba(15, 23, 42, 0.8) 50%, rgba(30, 41, 59, 0.5) 100%)",
            backgroundImage: `
              linear-gradient(180deg, rgba(30, 64, 175, 0.3) 0%, rgba(15, 23, 42, 0.8) 50%, rgba(30, 41, 59, 0.5) 100%),
              repeating-linear-gradient(
                90deg,
                rgba(79, 123, 254, 0.03) 0px,
                rgba(79, 123, 254, 0.08) 20px,
                rgba(79, 123, 254, 0.03) 40px
              ),
              radial-gradient(circle at 30% 40%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 70% 60%, rgba(79, 123, 254, 0.1) 0%, transparent 50%)
            `
          }}
        >
          {/* Animated wave effect */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="wave-animation"></div>
          </div>

          {/* Fish */}
          {fishes.map((fish) => (
            <button
              key={fish.id}
              onClick={(e) => {
                e.stopPropagation();
                handleFishClick(fish.id, fish.x, fish.y);
              }}
              className="absolute text-9xl hover:scale-110 transition-transform cursor-pointer animate-swim"
              style={{
                left: `${fish.x}px`,
                top: `${fish.y}px`,
                filter: fish.isAngry
                  ? "drop-shadow(0 0 20px rgba(239, 68, 68, 0.8)) brightness(1.5) hue-rotate(180deg)"
                  : "drop-shadow(0 0 15px rgba(79, 123, 254, 0.6))"
              }}
            >
              🐟
            </button>
          ))}
        </div>

        <style jsx>{`
          @keyframes swim {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          @keyframes wave {
            0% {
              transform: translateX(0) translateY(0);
            }
            50% {
              transform: translateX(-25px) translateY(-5px);
            }
            100% {
              transform: translateX(0) translateY(0);
            }
          }

          .animate-swim {
            animation: swim 2s ease-in-out infinite;
          }

          .wave-animation {
            width: 200%;
            height: 100%;
            background: repeating-linear-gradient(
              0deg,
              rgba(79, 123, 254, 0.1) 0px,
              transparent 3px,
              transparent 8px,
              rgba(79, 123, 254, 0.05) 11px
            );
            animation: wave 8s linear infinite;
          }
        `}</style>
      </div>
    );
  }

  if (phase === "results") {
    const avgReactionTime = reactionTimes.length > 0
      ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
      : 0;
    const accuracy = caught + missed > 0
      ? Math.round((caught / (caught + missed)) * 100)
      : 0;

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
              <span className="text-[#CBD5E1]">Fish Caught:</span>
              <span className="text-white font-bold">{caught} 🐟</span>
            </div>
            <div className="flex justify-between p-4 bg-[#0F172A] rounded-lg">
              <span className="text-[#CBD5E1]">Missed Clicks:</span>
              <span className="text-white font-bold">{missed}</span>
            </div>
            <div className="flex justify-between p-4 bg-[#0F172A] rounded-lg">
              <span className="text-[#CBD5E1]">Accuracy:</span>
              <span className="text-white font-bold">{accuracy}%</span>
            </div>
            <div className="flex justify-between p-4 bg-[#0F172A] rounded-lg">
              <span className="text-[#CBD5E1]">Avg Reaction Time:</span>
              <span className="text-white font-bold">{avgReactionTime}ms</span>
            </div>
          </div>
          <button
            onClick={saveAndContinue}
            className="w-full bg-[#A855F7] hover:bg-[#4F7BFE] text-white font-bold py-4 px-8 rounded-lg transition-all shadow-glow-purple hover:shadow-glow-blue"
          >
            Continue to Math Speed Test
          </button>
        </div>
      </div>
    );
  }

  return null;
}
