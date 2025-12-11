"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type GamePhase = "intro" | "playing" | "results";

interface Obstacle {
  id: number;
  lane: number; // 0 = left, 1 = center, 2 = right
  y: number;
}

export default function RacingGame() {
  const router = useRouter();
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [carLane, setCarLane] = useState(1); // 0 = left, 1 = center, 2 = right
  const [speed, setSpeed] = useState(20); // km/h
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [obstaclesHit, setObstaclesHit] = useState(0);
  const [obstaclesAvoided, setObstaclesAvoided] = useState(0);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const obstacleSpawnRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (phase === "playing" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (phase === "playing" && timeLeft === 0) {
      endGame();
    }
  }, [phase, timeLeft]);

  useEffect(() => {
    if (phase === "playing") {
      // Increase speed gradually
      const speedInterval = setInterval(() => {
        setSpeed(prevSpeed => Math.min(prevSpeed + 2, 200));
      }, 1000);

      // Spawn obstacles
      obstacleSpawnRef.current = setInterval(() => {
        spawnObstacle();
      }, 1500);

      // Move obstacles down
      gameLoopRef.current = setInterval(() => {
        setObstacles(prevObstacles => {
          const updated = prevObstacles.map(obs => ({
            ...obs,
            y: obs.y + 10
          }));

          // Remove obstacles that are off screen
          const filtered = updated.filter(obs => {
            if (obs.y > 600) {
              // Obstacle passed, check if avoided
              if (obs.lane !== carLane) {
                setObstaclesAvoided(prev => prev + 1);
              }
              return false;
            }
            return true;
          });

          // Check for collisions
          filtered.forEach(obs => {
            if (obs.y > 450 && obs.y < 550 && obs.lane === carLane) {
              handleCollision();
            }
          });

          return filtered;
        });
      }, 50);

      return () => {
        if (speedInterval) clearInterval(speedInterval);
        if (obstacleSpawnRef.current) clearInterval(obstacleSpawnRef.current);
        if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      };
    }
  }, [phase, carLane]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (phase !== "playing") return;

      if (e.key === "ArrowLeft" && carLane > 0) {
        setCarLane(carLane - 1);
      } else if (e.key === "ArrowRight" && carLane < 2) {
        setCarLane(carLane + 1);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [phase, carLane]);

  const spawnObstacle = () => {
    const randomLane = Math.floor(Math.random() * 3);
    const newObstacle: Obstacle = {
      id: Date.now() + Math.random(),
      lane: randomLane,
      y: -50,
    };

    setObstacles(prev => [...prev, newObstacle]);
  };

  const handleCollision = () => {
    setSpeed(prevSpeed => Math.max(prevSpeed - 15, 10));
    setObstaclesHit(prev => prev + 1);
  };

  const startTest = () => {
    setCarLane(1);
    setSpeed(20);
    setObstacles([]);
    setObstaclesHit(0);
    setObstaclesAvoided(0);
    setTimeLeft(30);
    setPhase("playing");
  };

  const endGame = () => {
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    if (obstacleSpawnRef.current) clearInterval(obstacleSpawnRef.current);

    // Score based on final speed
    const finalScore = Math.min(Math.round((speed / 200) * 100), 100);
    setScore(finalScore);
    setPhase("results");
  };

  const saveAndContinue = () => {
    localStorage.setItem("racingScore", score.toString());
    router.push("/brain-test/results");
  };

  if (phase === "intro") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full card-testmate p-8">
          <h1 className="text-4xl font-bold mb-4 text-[#4F7BFE]">
            🏎️ Speed Racing
          </h1>
          <div className="space-y-4 text-[#CBD5E1] mb-8">
            <p className="text-lg">
              Drive for <strong className="text-white">30 seconds</strong> and reach maximum speed!
            </p>
            <p className="text-lg">
              Use <strong className="text-white">← Left</strong> and <strong className="text-white">Right →</strong> arrow keys to steer.
            </p>
            <p className="text-lg">
              Speed increases automatically. Avoid obstacles or they'll slow you down!
            </p>
            <p className="text-lg">
              Your score is based on your <strong className="text-white">final speed</strong>.
            </p>
          </div>
          <button
            onClick={startTest}
            className="w-full bg-[#4F7BFE] hover:bg-[#A855F7] text-white font-bold py-4 px-8 rounded-lg transition-all shadow-glow-blue hover:shadow-glow-purple"
          >
            Start Racing
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
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0F172A]">
        {/* Stats Display */}
        <div className="w-full max-w-md flex justify-between mb-4 p-4 card-testmate">
          <div>
            <p className="text-[#CBD5E1] text-sm">Time</p>
            <p className="text-white font-bold text-2xl">{timeLeft}s</p>
          </div>
          <div>
            <p className="text-[#CBD5E1] text-sm">Speed</p>
            <p className="text-[#4F7BFE] font-bold text-2xl">{speed} km/h</p>
          </div>
          <div>
            <p className="text-[#CBD5E1] text-sm">Score</p>
            <p className="text-[#A855F7] font-bold text-2xl">
              {Math.min(Math.round((speed / 200) * 100), 100)}
            </p>
          </div>
        </div>

        {/* Game Area */}
        <div className="relative w-full max-w-md h-[600px] bg-[#1E293B] rounded-lg border-4 border-[#334155] overflow-hidden">
          {/* Road Lanes */}
          <div className="absolute inset-0 flex">
            <div className="flex-1 border-r-2 border-dashed border-[#334155]"></div>
            <div className="flex-1 border-r-2 border-dashed border-[#334155]"></div>
            <div className="flex-1"></div>
          </div>

          {/* Obstacles */}
          {obstacles.map(obstacle => (
            <div
              key={obstacle.id}
              className="absolute text-4xl"
              style={{
                left: `${obstacle.lane * 33.33 + 10}%`,
                top: `${obstacle.y}px`,
                transition: "none"
              }}
            >
              🚧
            </div>
          ))}

          {/* Car */}
          <div
            className="absolute text-5xl transition-all duration-200"
            style={{
              left: `${carLane * 33.33 + 10}%`,
              bottom: "50px"
            }}
          >
            🏎️
          </div>
        </div>

        <p className="mt-4 text-[#CBD5E1]">
          Use ← → arrow keys to move
        </p>
      </div>
    );
  }

  if (phase === "results") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full card-testmate p-8">
          <h2 className="text-4xl font-bold mb-4 text-center text-[#4F7BFE]">
            Race Complete!
          </h2>
          <div className="text-center mb-8">
            <div className="text-7xl font-bold text-[#A855F7] mb-4">
              {score}
            </div>
            <p className="text-2xl text-[#CBD5E1]">out of 100</p>
          </div>
          <div className="space-y-4 mb-8">
            <div className="flex justify-between p-4 bg-[#0F172A] rounded-lg">
              <span className="text-[#CBD5E1]">Final Speed:</span>
              <span className="text-white font-bold">{speed} km/h 🏎️</span>
            </div>
            <div className="flex justify-between p-4 bg-[#0F172A] rounded-lg">
              <span className="text-[#CBD5E1]">Obstacles Hit:</span>
              <span className="text-white font-bold">{obstaclesHit} 🚧</span>
            </div>
            <div className="flex justify-between p-4 bg-[#0F172A] rounded-lg">
              <span className="text-[#CBD5E1]">Obstacles Avoided:</span>
              <span className="text-white font-bold">{obstaclesAvoided} ✅</span>
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
