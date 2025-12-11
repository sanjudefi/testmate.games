"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

type GamePhase = "intro" | "playing" | "results";

interface RoadItem {
  id: number;
  lane: number; // 0 = left, 1 = center, 2 = right
  position: number; // 0-100, where 100 is at the bike
  type: "obstacle" | "boost"; // obstacle slows down, boost speeds up
}

export default function BikeRushGame() {
  const router = useRouter();
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [bikeLane, setBikeLane] = useState(1);
  const [speed, setSpeed] = useState(60);
  const [distance, setDistance] = useState(0);
  const [roadItems, setRoadItems] = useState<RoadItem[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [collisions, setCollisions] = useState(0);
  const [boostsCollected, setBoostsCollected] = useState(0);
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

    setRoadItems(prev => {
      // Move items forward
      let updated = prev.map(item => ({
        ...item,
        position: item.position + (speed / 8)
      }));

      // Check for collisions and boosts
      updated.forEach(item => {
        if (item.position >= 95 && item.position <= 105 && item.lane === bikeLane) {
          if (item.type === "obstacle") {
            // Collision with obstacle
            setCollisions(c => c + 1);
            setSpeed(s => Math.max(30, s - 15));
          } else if (item.type === "boost") {
            // Collected boost
            setBoostsCollected(b => b + 1);
            setSpeed(s => Math.min(s + 25, 180));
          }
          // Remove this item
          updated = updated.filter(o => o.id !== item.id);
        }
      });

      // Remove items that have passed
      return updated.filter(item => item.position < 120);
    });

    // Update distance
    setDistance(d => d + speed / 80);

    // Gradually increase speed if no recent collision
    setSpeed(s => Math.min(s + 0.03, 150));

    // Spawn new road items
    const now = Date.now();
    if (now - lastSpawnRef.current > 1200) {
      spawnRoadItem();
      lastSpawnRef.current = now;
    }

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [phase, speed, bikeLane]);

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

      if ((e.key === "ArrowLeft" || e.key === "a" || e.key === "A") && bikeLane > 0) {
        setBikeLane(bikeLane - 1);
      } else if ((e.key === "ArrowRight" || e.key === "d" || e.key === "D") && bikeLane < 2) {
        setBikeLane(bikeLane + 1);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [phase, bikeLane]);

  const spawnRoadItem = () => {
    const lane = Math.floor(Math.random() * 3);
    // 70% chance of obstacle, 30% chance of boost
    const type: "obstacle" | "boost" = Math.random() > 0.3 ? "obstacle" : "boost";

    const newItem: RoadItem = {
      id: Date.now() + Math.random(),
      lane,
      position: 0,
      type,
    };
    setRoadItems(prev => [...prev, newItem]);
  };

  const startTest = () => {
    setBikeLane(1);
    setSpeed(60);
    setDistance(0);
    setRoadItems([]);
    setTimeLeft(60);
    setCollisions(0);
    setBoostsCollected(0);
    setPhase("playing");
  };

  const endGame = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Score based on distance, speed, boosts, and collisions
    const distanceScore = Math.min((distance / 250) * 40, 40);
    const speedScore = Math.min(((speed - 30) / 150) * 25, 25);
    const boostBonus = Math.min(boostsCollected * 3, 20);
    const collisionPenalty = Math.min(collisions * 4, 20);

    const finalScore = Math.max(0, Math.round(distanceScore + speedScore + boostBonus + 15 - collisionPenalty));
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
            🚴 Bike Rush
          </h1>
          <div className="space-y-4 text-[#CBD5E1] mb-8">
            <p className="text-lg">
              Race for <strong className="text-white">60 seconds</strong> and go as far as you can!
            </p>
            <p className="text-lg">
              Use <strong className="text-white">← → Arrow Keys</strong> or <strong className="text-white">A/D</strong> to switch lanes.
            </p>
            <p className="text-lg">
              <strong className="text-white">Avoid bikes 🚴</strong> - they slow you down!
            </p>
            <p className="text-lg">
              <strong className="text-white">Collect boosts ⚡</strong> - they speed you up!
            </p>
            <p className="text-lg">
              Score based on <strong className="text-white">distance</strong>, <strong className="text-white">speed</strong>, and <strong className="text-white">boosts collected</strong>.
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
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#f4a460] via-[#d2691e] to-[#8b4513] p-4">
        {/* HUD */}
        <div className="flex justify-between items-center mb-4 p-4 bg-[#1E293B]/90 rounded-lg">
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
            <p className="text-[#CBD5E1] text-sm">Boosts</p>
            <p className="text-green-400 font-bold text-xl">⚡{boostsCollected}</p>
          </div>
        </div>

        {/* Desert Road */}
        <div className="flex-1 flex items-end justify-center">
          <div className="relative w-full max-w-md h-[600px] rounded-lg overflow-hidden" style={{
            background: "linear-gradient(to bottom, #8b7355 0%, #5c4033 50%, #3e2723 100%)",
            boxShadow: "inset 0 0 50px rgba(0,0,0,0.5)"
          }}>
            {/* Road surface pattern */}
            <div className="absolute inset-0" style={{
              backgroundImage: `
                repeating-linear-gradient(
                  0deg,
                  rgba(139, 115, 85, 0.3) 0px,
                  rgba(92, 64, 51, 0.4) 50px,
                  rgba(139, 115, 85, 0.3) 100px
                )
              `
            }}></div>

            {/* Lane dividers */}
            <div className="absolute inset-0 flex">
              <div className="flex-1 border-r-2 border-dashed border-yellow-600/40"></div>
              <div className="flex-1 border-r-2 border-dashed border-yellow-600/40"></div>
              <div className="flex-1"></div>
            </div>

            {/* Road Items (obstacles and boosts) */}
            {roadItems.map(item => {
              const laneX = item.lane * 33.33;
              const itemY = 100 - item.position;
              const size = Math.max(30, 50 - item.position / 3);

              return (
                <div
                  key={item.id}
                  className="absolute transition-all duration-100"
                  style={{
                    left: `${laneX + 12}%`,
                    top: `${itemY}%`,
                    fontSize: `${size}px`,
                    filter: item.type === "boost"
                      ? "drop-shadow(0 0 10px rgba(234, 179, 8, 0.8))"
                      : "drop-shadow(0 0 5px rgba(0, 0, 0, 0.5))"
                  }}
                >
                  {item.type === "obstacle" ? "🚴" : "⚡"}
                </div>
              );
            })}

            {/* Speed lines effect */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 bg-white/60"
                  style={{
                    left: `${10 + i * 12}%`,
                    height: `${Math.max(30, speed / 2.5)}px`,
                    top: `${(i * 15) % 100}%`,
                    animation: `speedLine ${2.5 / (speed / 60)}s linear infinite`,
                    animationDelay: `${i * 0.15}s`
                  }}
                />
              ))}
            </div>

            {/* Handlebar view at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none">
              {/* Handlebar */}
              <div className="relative h-full flex items-end justify-center">
                <div
                  className="transition-all duration-200 ease-out"
                  style={{
                    transform: `translateX(${(bikeLane - 1) * 33.33}%)`,
                  }}
                >
                  {/* Left grip */}
                  <div className="absolute bottom-4 left-[-80px] w-24 h-4 bg-gradient-to-r from-[#1E293B] to-[#334155] rounded-full rotate-[-15deg] border-2 border-[#4F7BFE]/50"></div>
                  {/* Right grip */}
                  <div className="absolute bottom-4 right-[-80px] w-24 h-4 bg-gradient-to-l from-[#1E293B] to-[#334155] rounded-full rotate-[15deg] border-2 border-[#4F7BFE]/50"></div>
                  {/* Center bar */}
                  <div className="w-48 h-3 bg-gradient-to-b from-[#334155] to-[#1E293B] rounded-full border-2 border-[#4F7BFE]"></div>

                  {/* Speed indicator on handlebar */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#1E293B] px-3 py-1 rounded-lg border border-[#4F7BFE]">
                    <p className="text-[#4F7BFE] font-bold text-sm">{Math.round(speed)} km/h</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center mt-4 text-white font-semibold">
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
        `}</style>
      </div>
    );
  }

  if (phase === "results") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full card-testmate p-8">
          <h2 className="text-4xl font-bold mb-4 text-center text-[#4F7BFE]">
            Race Complete! 🏁
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
              <span className="text-white font-bold">{Math.round(speed)} km/h 🚴</span>
            </div>
            <div className="flex justify-between p-4 bg-[#0F172A] rounded-lg">
              <span className="text-[#CBD5E1]">Boosts Collected:</span>
              <span className="text-white font-bold">{boostsCollected} ⚡</span>
            </div>
            <div className="flex justify-between p-4 bg-[#0F172A] rounded-lg">
              <span className="text-[#CBD5E1]">Obstacles Hit:</span>
              <span className="text-white font-bold">{collisions} 🚴</span>
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
