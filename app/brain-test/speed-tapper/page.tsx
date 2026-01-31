"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type GamePhase = "intro" | "playing" | "results";

interface Target {
  id: number;
  x: number;
  y: number;
  createdAt: number;
}

export default function SpeedTapperTest() {
  const router = useRouter();
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [score, setScore] = useState(0);
  const [stats, setStats] = useState({
    hits: 0,
    misses: 0,
    avgReactionTime: 0,
    accuracy: 0,
  });

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const gameStateRef = useRef({
    isRunning: false,
    timeElapsed: 0,
    lastTime: 0,

    targets: [] as Target[],
    nextTargetTime: 0.8,
    spawnTimer: 0,

    hits: 0,
    misses: 0,
    reactionTimes: [] as number[],

    spawnInterval: 1.2, // seconds between spawns
  });

  const animationFrameRef = useRef<number>();

  // Spawn target
  const spawnTarget = () => {
    if (!gameAreaRef.current) return;

    const state = gameStateRef.current;
    const area = gameAreaRef.current;
    const targetSize = 80;

    // Remove old targets (older than 2 seconds)
    const now = Date.now();
    state.targets = state.targets.filter(t => {
      const age = (now - t.createdAt) / 1000;
      if (age > 2) {
        state.misses++;
        return false;
      }
      return true;
    });

    const x = Math.random() * (area.clientWidth - targetSize);
    const y = Math.random() * (area.clientHeight - targetSize);

    state.targets.push({
      id: Date.now() + Math.random(),
      x,
      y,
      createdAt: Date.now(),
    });

    // Speed up spawn rate over time
    state.spawnInterval = Math.max(0.5, 1.2 - state.timeElapsed * 0.02);
    state.nextTargetTime = state.spawnInterval;
    state.spawnTimer = 0;
  };

  // Handle target click
  const handleTargetClick = (targetId: number) => {
    const state = gameStateRef.current;
    const target = state.targets.find(t => t.id === targetId);

    if (target) {
      const reactionTime = Date.now() - target.createdAt;
      state.reactionTimes.push(reactionTime);
      state.hits++;
      state.targets = state.targets.filter(t => t.id !== targetId);
    }
  };

  // Handle miss click
  const handleMissClick = () => {
    const state = gameStateRef.current;
    state.misses++;
  };

  // Update game
  const updateGame = (dt: number) => {
    const state = gameStateRef.current;

    state.timeElapsed += dt;

    // Spawn new targets
    state.spawnTimer += dt;
    if (state.spawnTimer >= state.nextTargetTime) {
      spawnTarget();
    }

    // Check if game should end (30 seconds)
    if (state.timeElapsed >= 30) {
      endGame();
    }
  };

  // Game loop
  const gameLoop = (currentTime: number) => {
    if (!gameStateRef.current.isRunning) return;

    const dt = gameStateRef.current.lastTime === 0
      ? 0
      : (currentTime - gameStateRef.current.lastTime) / 1000;

    gameStateRef.current.lastTime = currentTime;

    if (dt > 0 && dt < 0.1) {
      updateGame(dt);
    }

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  };

  // Start game
  const startGame = () => {
    const state = gameStateRef.current;

    state.isRunning = true;
    state.lastTime = 0;
    state.timeElapsed = 0;
    state.targets = [];
    state.nextTargetTime = 0.8;
    state.spawnTimer = 0;
    state.hits = 0;
    state.misses = 0;
    state.reactionTimes = [];
    state.spawnInterval = 1.2;

    setPhase("playing");
    spawnTarget();
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  };

  // End game
  const endGame = () => {
    const state = gameStateRef.current;
    state.isRunning = false;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Calculate stats
    const totalClicks = state.hits + state.misses;
    const accuracy = totalClicks > 0 ? Math.round((state.hits / totalClicks) * 100) : 0;
    const avgReaction = state.reactionTimes.length > 0
      ? Math.round(state.reactionTimes.reduce((a, b) => a + b, 0) / state.reactionTimes.length)
      : 0;

    // Score: 50% accuracy, 30% hits count, 20% reaction speed
    const accuracyScore = (accuracy / 100) * 50;
    const hitsScore = Math.min((state.hits / 30) * 30, 30);
    const reactionScore = avgReaction > 0 ? Math.max(0, 20 - (avgReaction / 100)) : 0;

    const finalScore = Math.round(accuracyScore + hitsScore + reactionScore);

    setScore(Math.min(finalScore, 100));
    setStats({
      hits: state.hits,
      misses: state.misses,
      avgReactionTime: avgReaction,
      accuracy,
    });

    setPhase("results");
  };

  const saveAndContinue = () => {
    localStorage.setItem("speedTapperScore", score.toString());
    router.push("/brain-test/results");
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  if (phase === "intro") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full card-tutortom p-8">
          <h1 className="text-4xl font-bold mb-4 text-[#4F7BFE]">
            ⚡ Speed Tapper
          </h1>
          <div className="space-y-4 text-[#CBD5E1] mb-8">
            <p className="text-lg">
              Tap the <strong className="text-white">targets</strong> as fast as you can for <strong className="text-white">30 seconds</strong>!
            </p>
            <p className="text-lg">
              Targets appear randomly and <strong className="text-white">disappear after 2 seconds</strong>.
            </p>
            <p className="text-lg">
              The game <strong className="text-white">speeds up</strong> as you play - stay focused!
            </p>
            <p className="text-lg">
              Your score is based on <strong className="text-white">accuracy</strong>, <strong className="text-white">reaction time</strong>, and <strong className="text-white">total taps</strong>.
            </p>
          </div>
          <button
            onClick={startGame}
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

  if (phase === "playing") {
    const state = gameStateRef.current;
    const timeLeft = Math.max(0, 30 - state.timeElapsed);

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0F172A]">
        {/* HUD */}
        <div className="w-full max-w-3xl mb-4 p-4 bg-[#1E293B]/90 rounded-lg flex justify-between items-center">
          <div>
            <p className="text-[#CBD5E1] text-sm">Time Left</p>
            <p className="text-white font-bold text-2xl">{Math.ceil(timeLeft)}s</p>
          </div>
          <div>
            <p className="text-[#CBD5E1] text-sm">Hits</p>
            <p className="text-[#4F7BFE] font-bold text-2xl">{state.hits}</p>
          </div>
          <div>
            <p className="text-[#CBD5E1] text-sm">Misses</p>
            <p className="text-red-400 font-bold text-2xl">{state.misses}</p>
          </div>
        </div>

        {/* Game Area */}
        <div
          ref={gameAreaRef}
          onClick={handleMissClick}
          className="relative w-full max-w-3xl h-[500px] bg-gradient-to-b from-[#1E293B] to-[#0F172A] rounded-lg border-2 border-[#4F7BFE] overflow-hidden cursor-crosshair"
        >
          {/* Targets */}
          {state.targets.map((target) => {
            const age = (Date.now() - target.createdAt) / 1000;
            const fadeOpacity = Math.max(0, 1 - age / 2);

            return (
              <button
                key={target.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTargetClick(target.id);
                }}
                className="absolute w-20 h-20 rounded-full bg-[#A855F7] hover:bg-[#4F7BFE] transition-all flex items-center justify-center text-white font-bold text-2xl shadow-glow-purple hover:shadow-glow-blue cursor-pointer"
                style={{
                  left: `${target.x}px`,
                  top: `${target.y}px`,
                  opacity: fadeOpacity,
                  transform: `scale(${fadeOpacity})`,
                }}
              >
                ●
              </button>
            );
          })}
        </div>

        <p className="text-center mt-4 text-white font-semibold">
          Tap the circles as fast as you can!
        </p>
      </div>
    );
  }

  if (phase === "results") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full card-tutortom p-8">
          <h2 className="text-4xl font-bold mb-4 text-center text-[#4F7BFE]">
            Test Complete! ⚡
          </h2>
          <div className="text-center mb-8">
            <div className="text-7xl font-bold text-[#A855F7] mb-4">
              {score}
            </div>
            <p className="text-2xl text-[#CBD5E1]">out of 100</p>
          </div>
          <div className="space-y-4 mb-8">
            <div className="flex justify-between p-4 bg-[#0F172A] rounded-lg">
              <span className="text-[#CBD5E1]">Successful Taps:</span>
              <span className="text-white font-bold">{stats.hits} ✓</span>
            </div>
            <div className="flex justify-between p-4 bg-[#0F172A] rounded-lg">
              <span className="text-[#CBD5E1]">Missed Taps:</span>
              <span className="text-white font-bold">{stats.misses} ✗</span>
            </div>
            <div className="flex justify-between p-4 bg-[#0F172A] rounded-lg">
              <span className="text-[#CBD5E1]">Accuracy:</span>
              <span className="text-white font-bold">{stats.accuracy}%</span>
            </div>
            <div className="flex justify-between p-4 bg-[#0F172A] rounded-lg">
              <span className="text-[#CBD5E1]">Avg Reaction Time:</span>
              <span className="text-white font-bold">{stats.avgReactionTime}ms</span>
            </div>
          </div>
          <button
            onClick={saveAndContinue}
            className="w-full bg-[#4F7BFE] hover:bg-[#A855F7] text-white font-bold py-4 px-8 rounded-lg transition-all shadow-glow-blue hover:shadow-glow-purple"
          >
            View Final Results
          </button>
        </div>
      </div>
    );
  }

  return null;
}
