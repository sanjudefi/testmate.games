"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

type GamePhase = "intro" | "playing" | "results";

interface Obstacle {
  id: number;
  lane: number; // 0 = left, 1 = center, 2 = right
  position: number; // 0-100, where 100 is at the car
}

export default function RacingGame() {
  const router = useRouter();
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [carLane, setCarLane] = useState(1);
  const [speed, setSpeed] = useState(50);
  const [distance, setDistance] = useState(0);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [collisions, setCollisions] = useState(0);
  const [score, setScore] = useState(0);
  const animationFrameRef = useRef<number>();
  const lastSpawnRef = useRef<number>(0);

  useEffect(() => {
    if (phase === "playing" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (phase === "playing" && timeLeft === 0) {
      endGame();
    }
  }, [phase, timeLeft]);

  const gameLoop = useCallback(() => {
    if (phase !== "playing") return;

    setObstacles(prev => {
      // Move obstacles forward
      let updated = prev.map(obs => ({
        ...obs,
        position: obs.position + (speed / 10)
      }));

      // Check for collisions
      updated.forEach(obs => {
        if (obs.position >= 95 && obs.position <= 105 && obs.lane === carLane) {
          // Collision detected
          setCollisions(c => c + 1);
          setSpeed(s => Math.max(20, s - 10));
          // Remove this obstacle
          updated = updated.filter(o => o.id !== obs.id);
        }
      });

      // Remove obstacles that have passed
      return updated.filter(obs => obs.position < 120);
    });

    // Update distance
    setDistance(d => d + speed / 100);

    // Increase speed gradually
    setSpeed(s => Math.min(s + 0.05, 150));

    // Spawn new obstacles
    const now = Date.now();
    if (now - lastSpawnRef.current > 1500) {
      spawnObstacle();
      lastSpawnRef.current = now;
    }

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [phase, speed, carLane]);

  useEffect(() => {
    if (phase === "playing") {
      lastSpawnRef.current = Date.now();
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [phase, gameLoop]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (phase !== "playing") return;

      if ((e.key === "ArrowLeft" || e.key === "a" || e.key === "A") && carLane > 0) {
        setCarLane(carLane - 1);
      } else if ((e.key === "ArrowRight" || e.key === "d" || e.key === "D") && carLane < 2) {
        setCarLane(carLane + 1);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [phase, carLane]);

  const spawnObstacle = () => {
    const lane = Math.floor(Math.random() * 3);
    const newObstacle: Obstacle = {
      id: Date.now() + Math.random(),
      lane,
      position: 0,
    };
    setObstacles(prev => [...prev, newObstacle]);
  };

  const startTest = () => {
    setCarLane(1);
    setSpeed(50);
    setDistance(0);
    setObstacles([]);
    setTimeLeft(30);
    setCollisions(0);
    setPhase("playing");
  };

  const endGame = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Score based on distance traveled and speed
    const distanceScore = Math.min((distance / 100) * 50, 50);
    const speedScore = Math.min(((speed - 20) / 130) * 30, 30);
    const collisionPenalty = Math.min(collisions * 5, 20);

    const finalScore = Math.max(0, Math.round(distanceScore + speedScore + 20 - collisionPenalty));
    setScore(Math.min(finalScore, 100));
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
              Drive for <strong className="text-white">30 seconds</strong> and go as far as you can!
            </p>
            <p className="text-lg">
              Use <strong className="text-white">← → Arrow Keys</strong> or <strong className="text-white">A/D</strong> to switch lanes.
            </p>
            <p className="text-lg">
              Avoid obstacles! Speed increases automatically.
            </p>
            <p className="text-lg">
              Score based on <strong className="text-white">distance traveled</strong> and <strong className="text-white">final speed</strong>.
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
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0F172A] to-[#1E293B] p-4">
        {/* HUD */}
        <div className="flex justify-between items-center mb-4 p-4 bg-[#1E293B]/80 rounded-lg">
          <div>
            <p className="text-[#CBD5E1] text-sm">Time</p>
            <p className="text-white font-bold text-xl">{timeLeft}s</p>
          </div>
          <div>
            <p className="text-[#CBD5E1] text-sm">Speed</p>
            <p className="text-[#4F7BFE] font-bold text-xl">{Math.round(speed)} km/h</p>
          </div>
          <div>
            <p className="text-[#CBD5E1] text-sm">Distance</p>
            <p className="text-[#A855F7] font-bold text-xl">{Math.round(distance)}m</p>
          </div>
          <div>
            <p className="text-[#CBD5E1] text-sm">Hits</p>
            <p className="text-red-400 font-bold text-xl">{collisions}</p>
          </div>
        </div>

        {/* Race Track */}
        <div className="flex-1 flex items-end justify-center perspective-container">
          <div className="relative w-full max-w-md h-[600px]" style={{
            background: "linear-gradient(to bottom, #1E293B 0%, #334155 100%)",
            borderLeft: "4px solid #4F7BFE",
            borderRight: "4px solid #4F7BFE",
          }}>
            {/* Road Markings */}
            <div className="absolute inset-0 flex">
              <div className="flex-1 border-r border-dashed border-[#CBD5E1]/30"></div>
              <div className="flex-1 border-r border-dashed border-[#CBD5E1]/30"></div>
              <div className="flex-1"></div>
            </div>

            {/* Obstacles */}
            {obstacles.map(obstacle => {
              const laneX = obstacle.lane * 33.33;
              const obstacleY = 100 - obstacle.position;

              return (
                <div
                  key={obstacle.id}
                  className="absolute transition-all duration-100"
                  style={{
                    left: `${laneX + 10}%`,
                    top: `${obstacleY}%`,
                    fontSize: `${Math.max(24, 40 - obstacle.position / 3)}px`,
                  }}
                >
                  🚧
                </div>
              );
            })}

            {/* Player Car */}
            <div
              className="absolute text-5xl transition-all duration-200 ease-out"
              style={{
                left: `${carLane * 33.33 + 7}%`,
                bottom: "20px",
                filter: "drop-shadow(0 4px 8px rgba(79, 123, 254, 0.6))"
              }}
            >
              🏎️
            </div>

            {/* Speed Lines Effect */}
            <div className="absolute inset-0 pointer-events-none opacity-30">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 bg-white"
                  style={{
                    left: `${20 + i * 15}%`,
                    height: `${Math.max(20, speed / 2)}px`,
                    top: `${(i * 20) % 100}%`,
                    animation: `speedLine ${3 / (speed / 50)}s linear infinite`,
                    animationDelay: `${i * 0.2}s`
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <p className="text-center mt-4 text-[#CBD5E1]">
          Use ← → Arrow Keys or A/D to move
        </p>

        <style jsx>{`
          @keyframes speedLine {
            from {
              transform: translateY(-100%);
              opacity: 0;
            }
            50% {
              opacity: 1;
            }
            to {
              transform: translateY(600px);
              opacity: 0;
            }
          }

          .perspective-container {
            perspective: 1000px;
          }
        `}</style>
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
              <span className="text-[#CBD5E1]">Distance Traveled:</span>
              <span className="text-white font-bold">{Math.round(distance)}m 📏</span>
            </div>
            <div className="flex justify-between p-4 bg-[#0F172A] rounded-lg">
              <span className="text-[#CBD5E1]">Final Speed:</span>
              <span className="text-white font-bold">{Math.round(speed)} km/h 🏎️</span>
            </div>
            <div className="flex justify-between p-4 bg-[#0F172A] rounded-lg">
              <span className="text-[#CBD5E1]">Obstacles Hit:</span>
              <span className="text-white font-bold">{collisions} 🚧</span>
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
