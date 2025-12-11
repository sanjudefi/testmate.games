"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type GamePhase = "intro" | "playing" | "results";

// Game configuration constants
const CONFIG = {
  GAME_DURATION: 30, // 30 seconds
  LANES: 3,
  LANE_WIDTH: 120,
  CANVAS_WIDTH: 400,
  CANVAS_HEIGHT: 600,

  // Speed settings (km/h)
  MIN_SPEED: 80,
  MAX_SPEED: 200,
  INITIAL_SPEED: 100,
  SPEED_INCREMENT: 0.5, // per second
  HIT_PENALTY: 30,

  // Obstacle settings
  OBSTACLE_SPAWN_MIN: 0.8, // seconds
  OBSTACLE_SPAWN_MAX: 1.4,
  OBSTACLE_SIZE: 50,

  // Road stripe settings
  STRIPE_HEIGHT: 40,
  STRIPE_SPACING: 80,
  STRIPE_WIDTH: 8,

  // Bike settings
  BIKE_SIZE: 60,
  BIKE_Y_POSITION: 500,
};

interface Obstacle {
  id: number;
  lane: number;
  y: number;
}

interface RoadStripe {
  y: number;
}

export default function BikeSpeedGame() {
  const router = useRouter();
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [score, setScore] = useState(0);
  const [gameStats, setGameStats] = useState({
    distance: 0,
    avgSpeed: 0,
    maxSpeed: 0,
    hits: 0,
  });

  // Canvas ref
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Game state refs (NOT React state - for performance)
  const gameStateRef = useRef({
    isRunning: false,
    lastTime: 0,

    // Game variables
    bikeLane: 1, // 0, 1, or 2
    speed: CONFIG.INITIAL_SPEED,
    distance: 0,
    timeElapsed: 0,

    // Collections
    obstacles: [] as Obstacle[],
    roadStripes: [] as RoadStripe[],

    // Timers
    obstacleSpawnTimer: 0,
    nextObstacleSpawnTime: 1.0,

    // Stats
    hits: 0,
    maxSpeed: CONFIG.INITIAL_SPEED,
    speedSum: 0,
    speedSamples: 0,

    // Visual
    hitFlash: 0,
  });

  const animationFrameRef = useRef<number>();

  // Initialize road stripes
  const initRoadStripes = () => {
    const stripes: RoadStripe[] = [];
    for (let y = -CONFIG.STRIPE_SPACING; y < CONFIG.CANVAS_HEIGHT + CONFIG.STRIPE_SPACING; y += CONFIG.STRIPE_SPACING) {
      stripes.push({ y });
    }
    gameStateRef.current.roadStripes = stripes;
  };

  // Spawn obstacle
  const spawnObstacle = () => {
    const state = gameStateRef.current;
    const lane = Math.floor(Math.random() * CONFIG.LANES);

    state.obstacles.push({
      id: Date.now() + Math.random(),
      lane,
      y: -CONFIG.OBSTACLE_SIZE,
    });

    // Set next spawn time randomly
    state.nextObstacleSpawnTime =
      CONFIG.OBSTACLE_SPAWN_MIN +
      Math.random() * (CONFIG.OBSTACLE_SPAWN_MAX - CONFIG.OBSTACLE_SPAWN_MIN);
    state.obstacleSpawnTimer = 0;
  };

  // Check collision
  const checkCollision = (obstacle: Obstacle): boolean => {
    const state = gameStateRef.current;
    const bikeLaneX = state.bikeLane * CONFIG.LANE_WIDTH + (CONFIG.CANVAS_WIDTH - CONFIG.LANES * CONFIG.LANE_WIDTH) / 2;
    const obstacleLaneX = obstacle.lane * CONFIG.LANE_WIDTH + (CONFIG.CANVAS_WIDTH - CONFIG.LANES * CONFIG.LANE_WIDTH) / 2;

    const bikeY = CONFIG.BIKE_Y_POSITION;

    // Check if obstacle is in same lane and overlapping
    if (
      Math.abs(bikeLaneX - obstacleLaneX) < CONFIG.BIKE_SIZE * 0.8 &&
      obstacle.y > bikeY - CONFIG.OBSTACLE_SIZE &&
      obstacle.y < bikeY + CONFIG.BIKE_SIZE
    ) {
      return true;
    }
    return false;
  };

  // Update game state (dt = delta time in seconds)
  const update = (dt: number) => {
    const state = gameStateRef.current;

    // Update time
    state.timeElapsed += dt;

    // Gradually increase speed
    state.speed = Math.min(
      state.speed + CONFIG.SPEED_INCREMENT * dt,
      CONFIG.MAX_SPEED
    );

    // Track max speed
    if (state.speed > state.maxSpeed) {
      state.maxSpeed = state.speed;
    }

    // Track average speed
    state.speedSum += state.speed;
    state.speedSamples++;

    // Update distance: distance = speed × time
    // Convert km/h to m/s: km/h * 1000 / 3600 = m/s
    const speedMetersPerSecond = (state.speed * 1000) / 3600;
    state.distance += speedMetersPerSecond * dt;

    // Update road stripes (move down based on speed)
    const stripeSpeed = speedMetersPerSecond * 1.5; // Visual multiplier
    state.roadStripes.forEach(stripe => {
      stripe.y += stripeSpeed * dt;

      // Recycle stripes that went off screen
      if (stripe.y > CONFIG.CANVAS_HEIGHT + CONFIG.STRIPE_SPACING) {
        stripe.y = -CONFIG.STRIPE_SPACING;
      }
    });

    // Update obstacles (move down at speed * 1.2)
    const obstacleSpeed = speedMetersPerSecond * 1.2;
    for (let i = state.obstacles.length - 1; i >= 0; i--) {
      const obstacle = state.obstacles[i];
      obstacle.y += obstacleSpeed * dt;

      // Check collision
      if (checkCollision(obstacle)) {
        // Hit!
        state.hits++;
        state.speed = Math.max(CONFIG.MIN_SPEED, state.speed - CONFIG.HIT_PENALTY);
        state.hitFlash = 0.3; // Flash for 300ms
        state.obstacles.splice(i, 1);
        continue;
      }

      // Remove obstacles that went off screen
      if (obstacle.y > CONFIG.CANVAS_HEIGHT + CONFIG.OBSTACLE_SIZE) {
        state.obstacles.splice(i, 1);
      }
    }

    // Update obstacle spawn timer
    state.obstacleSpawnTimer += dt;
    if (state.obstacleSpawnTimer >= state.nextObstacleSpawnTime) {
      spawnObstacle();
    }

    // Update hit flash
    if (state.hitFlash > 0) {
      state.hitFlash -= dt;
    }

    // Check if game should end
    if (state.timeElapsed >= CONFIG.GAME_DURATION) {
      endGame();
    }
  };

  // Draw game
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const state = gameStateRef.current;

    // Clear canvas
    ctx.clearRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

    // Draw background (desert gradient)
    const gradient = ctx.createLinearGradient(0, 0, 0, CONFIG.CANVAS_HEIGHT);
    gradient.addColorStop(0, "#f4a460");
    gradient.addColorStop(0.5, "#d2691e");
    gradient.addColorStop(1, "#8b4513");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

    // Draw road stripes
    const laneStartX = (CONFIG.CANVAS_WIDTH - CONFIG.LANES * CONFIG.LANE_WIDTH) / 2;
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";

    for (let i = 0; i < CONFIG.LANES - 1; i++) {
      const x = laneStartX + (i + 1) * CONFIG.LANE_WIDTH - CONFIG.STRIPE_WIDTH / 2;
      state.roadStripes.forEach(stripe => {
        ctx.fillRect(x, stripe.y, CONFIG.STRIPE_WIDTH, CONFIG.STRIPE_HEIGHT);
      });
    }

    // Draw obstacles
    state.obstacles.forEach(obstacle => {
      const x = obstacle.lane * CONFIG.LANE_WIDTH + laneStartX + CONFIG.LANE_WIDTH / 2;
      ctx.font = `${CONFIG.OBSTACLE_SIZE}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🚴", x, obstacle.y);
    });

    // Draw bike
    const bikeX = state.bikeLane * CONFIG.LANE_WIDTH + laneStartX + CONFIG.LANE_WIDTH / 2;
    ctx.font = `${CONFIG.BIKE_SIZE}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🚴", bikeX, CONFIG.BIKE_Y_POSITION);

    // Draw hit flash
    if (state.hitFlash > 0) {
      ctx.fillStyle = `rgba(255, 0, 0, ${state.hitFlash})`;
      ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
    }
  };

  // Game loop
  const gameLoop = (currentTime: number) => {
    if (!gameStateRef.current.isRunning) return;

    // Calculate delta time in seconds
    const dt = gameStateRef.current.lastTime === 0
      ? 0
      : (currentTime - gameStateRef.current.lastTime) / 1000;

    gameStateRef.current.lastTime = currentTime;

    // Skip first frame (dt would be too large)
    if (dt > 0 && dt < 0.1) {
      update(dt);
    }

    draw();

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  };

  // Start game
  const startGame = () => {
    const state = gameStateRef.current;

    // Reset state
    state.isRunning = true;
    state.lastTime = 0;
    state.bikeLane = 1;
    state.speed = CONFIG.INITIAL_SPEED;
    state.distance = 0;
    state.timeElapsed = 0;
    state.obstacles = [];
    state.obstacleSpawnTimer = 0;
    state.nextObstacleSpawnTime = 1.0;
    state.hits = 0;
    state.maxSpeed = CONFIG.INITIAL_SPEED;
    state.speedSum = 0;
    state.speedSamples = 0;
    state.hitFlash = 0;

    initRoadStripes();
    setPhase("playing");

    // Start game loop
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
    const avgSpeed = state.speedSamples > 0 ? state.speedSum / state.speedSamples : 0;

    // Calculate score: 100 * (avgSpeed / 200) * (1 - hits / 10)
    const speedRatio = avgSpeed / CONFIG.MAX_SPEED;
    const hitPenalty = Math.max(0, 1 - state.hits / 10);
    const finalScore = Math.round(100 * speedRatio * hitPenalty);

    setScore(Math.min(finalScore, 100));
    setGameStats({
      distance: Math.round(state.distance),
      avgSpeed: Math.round(avgSpeed),
      maxSpeed: Math.round(state.maxSpeed),
      hits: state.hits,
    });

    setPhase("results");
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (phase !== "playing") return;

      const state = gameStateRef.current;

      if ((e.key === "ArrowLeft" || e.key === "a" || e.key === "A") && state.bikeLane > 0) {
        state.bikeLane--;
      } else if ((e.key === "ArrowRight" || e.key === "d" || e.key === "D") && state.bikeLane < CONFIG.LANES - 1) {
        state.bikeLane++;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [phase]);

  // Handle touch input
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (phase !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const centerX = CONFIG.CANVAS_WIDTH / 2;

    const state = gameStateRef.current;

    if (x < centerX && state.bikeLane > 0) {
      state.bikeLane--;
    } else if (x > centerX && state.bikeLane < CONFIG.LANES - 1) {
      state.bikeLane++;
    }
  };

  const saveAndContinue = () => {
    localStorage.setItem("racingScore", score.toString());
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
        <div className="max-w-2xl w-full card-testmate p-8">
          <h1 className="text-4xl font-bold mb-4 text-[#4F7BFE]">
            🚴 Mind Speed Racer
          </h1>
          <div className="space-y-4 text-[#CBD5E1] mb-8">
            <p className="text-lg">
              Race for <strong className="text-white">30 seconds</strong> and maintain maximum speed!
            </p>
            <p className="text-lg">
              Use <strong className="text-white">← → Arrow Keys</strong> or <strong className="text-white">A/D</strong> to switch lanes.
            </p>
            <p className="text-lg">
              <strong className="text-white">Avoid bikes 🚴</strong> - they slow you down by 30 km/h!
            </p>
            <p className="text-lg">
              Your score is based on <strong className="text-white">average speed</strong> and <strong className="text-white">avoiding collisions</strong>.
            </p>
          </div>
          <button
            onClick={startGame}
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
    const state = gameStateRef.current;
    const timeLeft = Math.max(0, CONFIG.GAME_DURATION - state.timeElapsed);

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0F172A]">
        {/* HUD */}
        <div className="w-full max-w-md mb-4 p-4 bg-[#1E293B]/90 rounded-lg flex justify-between">
          <div>
            <p className="text-[#CBD5E1] text-sm">Time</p>
            <p className="text-white font-bold text-xl">{Math.ceil(timeLeft)}s</p>
          </div>
          <div>
            <p className="text-[#CBD5E1] text-sm">Speed</p>
            <p className="text-[#4F7BFE] font-bold text-xl">{Math.round(state.speed)} km/h</p>
          </div>
          <div>
            <p className="text-[#CBD5E1] text-sm">Distance</p>
            <p className="text-[#A855F7] font-bold text-xl">{Math.round(state.distance)}m</p>
          </div>
        </div>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          width={CONFIG.CANVAS_WIDTH}
          height={CONFIG.CANVAS_HEIGHT}
          onClick={handleCanvasClick}
          className="rounded-lg border-2 border-[#4F7BFE] cursor-pointer shadow-glow-blue"
        />

        {/* Instructions */}
        <p className="text-center mt-4 text-white font-semibold">
          Use ← → Arrow Keys or A/D to move
        </p>
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
              <span className="text-white font-bold">{gameStats.distance}m 📏</span>
            </div>
            <div className="flex justify-between p-4 bg-[#0F172A] rounded-lg">
              <span className="text-[#CBD5E1]">Average Speed:</span>
              <span className="text-white font-bold">{gameStats.avgSpeed} km/h 🚴</span>
            </div>
            <div className="flex justify-between p-4 bg-[#0F172A] rounded-lg">
              <span className="text-[#CBD5E1]">Max Speed:</span>
              <span className="text-white font-bold">{gameStats.maxSpeed} km/h ⚡</span>
            </div>
            <div className="flex justify-between p-4 bg-[#0F172A] rounded-lg">
              <span className="text-[#CBD5E1]">Obstacles Hit:</span>
              <span className="text-white font-bold">{gameStats.hits} 🚧</span>
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
