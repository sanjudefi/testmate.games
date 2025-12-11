"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type GamePhase = "intro" | "playing" | "results";

interface Target {
  id: number;
  x: number;
  y: number;
}

export default function AimTrainer() {
  const router = useRouter();
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [targets, setTargets] = useState<Target[]>([]);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(10);
  const [score, setScore] = useState(0);
  const targetAppearTime = useRef<number>(0);
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
    if (phase === "playing" && targets.length === 0) {
      spawnTarget();
    }
  }, [phase, targets]);

  const spawnTarget = () => {
    if (!gameAreaRef.current) return;

    const areaWidth = gameAreaRef.current.clientWidth;
    const areaHeight = gameAreaRef.current.clientHeight;
    const targetSize = 80; // Circle diameter

    const x = Math.random() * (areaWidth - targetSize);
    const y = Math.random() * (areaHeight - targetSize);

    const newTarget: Target = {
      id: Date.now(),
      x,
      y,
    };

    setTargets([newTarget]);
    targetAppearTime.current = Date.now();
  };

  const startTest = () => {
    setHits(0);
    setMisses(0);
    setReactionTimes([]);
    setTimeLeft(10);
    setPhase("playing");
  };

  const handleTargetClick = (targetId: number) => {
    const reactionTime = Date.now() - targetAppearTime.current;
    setReactionTimes([...reactionTimes, reactionTime]);
    setHits(hits + 1);
    setTargets([]);

    // Spawn next target after a short delay
    setTimeout(spawnTarget, 300);
  };

  const handleMissClick = () => {
    setMisses(misses + 1);
  };

  const endGame = () => {
    const totalClicks = hits + misses;
    const accuracy = totalClicks > 0 ? hits / totalClicks : 0;
    const avgReactionTime = reactionTimes.length > 0
      ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length
      : 0;

    // Score calculation:
    // 50% accuracy, 30% reaction time, 20% total hits
    const accuracyScore = accuracy * 50;
    const reactionScore = Math.max(0, 30 - (avgReactionTime / 100)) * 1.5;
    const hitsScore = Math.min(hits * 2, 20);

    const finalScore = Math.round(accuracyScore + reactionScore + hitsScore);
    setScore(Math.min(finalScore, 100));
    setPhase("results");
  };

  const saveAndContinue = () => {
    localStorage.setItem("aimTrainerScore", score.toString());
    router.push("/brain-test/results");
  };

  if (phase === "intro") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full card-testmate p-8">
          <h1 className="text-4xl font-bold mb-4 text-[#A855F7]">
            🎯 Aim Trainer
          </h1>
          <div className="space-y-4 text-[#CBD5E1] mb-8">
            <p className="text-lg">
              Click the circles as fast as you can for <strong className="text-white">10 seconds</strong>.
            </p>
            <p className="text-lg">
              Each hit counts! Your score is based on accuracy, reaction time, and total hits.
            </p>
            <p className="text-lg">
              Clicking outside the circles counts as a miss.
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

  if (phase === "playing") {
    return (
      <div className="min-h-screen flex flex-col p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg text-[#CBD5E1]">
            Time: <span className="text-white font-bold">{timeLeft}s</span>
          </div>
          <div className="text-lg text-[#CBD5E1]">
            Hits: <span className="text-[#4F7BFE] font-bold">{hits}</span> |
            Misses: <span className="text-[#A855F7] font-bold">{misses}</span>
          </div>
        </div>
        <div
          ref={gameAreaRef}
          onClick={handleMissClick}
          className="flex-1 relative bg-[#1E293B] rounded-lg border-2 border-[#334155] cursor-crosshair"
        >
          {targets.map((target) => (
            <button
              key={target.id}
              onClick={(e) => {
                e.stopPropagation();
                handleTargetClick(target.id);
              }}
              className="absolute w-20 h-20 rounded-full bg-[#4F7BFE] hover:bg-[#A855F7] shadow-glow-blue hover:shadow-glow-purple transition-all"
              style={{
                left: `${target.x}px`,
                top: `${target.y}px`,
              }}
            >
              <div className="w-6 h-6 bg-white rounded-full mx-auto" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (phase === "results") {
    const avgReactionTime = reactionTimes.length > 0
      ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
      : 0;
    const accuracy = hits + misses > 0
      ? Math.round((hits / (hits + misses)) * 100)
      : 0;

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full card-testmate p-8">
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
              <span className="text-[#CBD5E1]">Total Hits:</span>
              <span className="text-white font-bold">{hits}</span>
            </div>
            <div className="flex justify-between p-4 bg-[#0F172A] rounded-lg">
              <span className="text-[#CBD5E1]">Total Misses:</span>
              <span className="text-white font-bold">{misses}</span>
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
            View Final Results
          </button>
        </div>
      </div>
    );
  }

  return null;
}
