"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/**
 * Highway Hazards - A minimal Lumosity-style speed test
 * Tests: Processing speed, reaction time, and sustained attention
 *
 * Design: Clean geometric shapes, no emojis, professional aesthetic
 */

type GamePhase = "intro" | "playing" | "results";

// Game configuration
const CONFIG = {
  GAME_DURATION: 40, // seconds
  LANES: 3,
  CANVAS_WIDTH: 400,
  CANVAS_HEIGHT: 600,

  // Player settings
  PLAYER_SIZE: 40,
  PLAYER_Y: 520,
  LANE_SWITCH_DURATION: 0.15, // seconds for smooth transition

  // Speed settings
  INITIAL_SPEED: 150, // pixels per second
  MAX_SPEED: 400,
  SPEED_INCREMENT: 3, // per second
  HIT_PENALTY: 60,
  MIN_SPEED: 100,

  // Obstacle settings
  OBSTACLE_WIDTH: 60,
  OBSTACLE_HEIGHT: 80,
  SPAWN_INTERVAL_MIN: 0.7, // seconds
  SPAWN_INTERVAL_MAX: 1.3,

  // Colors
  BG_GRADIENT_TOP: "#FFB268",
  BG_GRADIENT_BOTTOM: "#CC5E24",
  PLAYER_COLOR: "#4F7BFE",
  OBSTACLE_COLOR: "#2D3748",
  LANE_LINE_COLOR: "rgba(255, 255, 255, 0.4)",
  HIT_FLASH_COLOR: "rgba(255, 0, 0, 0.3)",
};

interface Obstacle {
  id: number;
  lane: number;
  y: number;
  passed: boolean;
}

interface ReactionData {
  time: number;
  success: boolean;
}

export default function SpeedHighwayTest() {
  const router = useRouter();
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [score, setScore] = useState(0);
  const [scoreMessage, setScoreMessage] = useState("");
  const [stats, setStats] = useState({
    distance: 0,
    avgSpeed: 0,
    maxSpeed: 0,
    hits: 0,
    dodges: 0,
    avgReaction: 0,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef({
    isRunning: false,
    lastTime: 0,

    // Player state
    currentLane: 1, // 0, 1, or 2
    targetLane: 1,
    laneTransitionProgress: 1, // 0 to 1

    // Movement
    speed: CONFIG.INITIAL_SPEED,
    distance: 0,
    timeElapsed: 0,

    // Obstacles
    obstacles: [] as Obstacle[],
    obstacleSpawnTimer: 0,
    nextSpawnTime: 1.0,

    // Tracking
    hits: 0,
    dodges: 0,
    maxSpeed: CONFIG.INITIAL_SPEED,
    speedSum: 0,
    speedSamples: 0,

    // Reaction time tracking
    lastObstacleApproachTime: 0,
    reactionTimes: [] as number[],
    lastLaneSwitchTime: 0,

    // Visual
    hitFlash: 0,
    totalObstaclesSpawned: 0,
  });

  const animationFrameRef = useRef<number>();

  // Get lane X position
  const getLaneX = (lane: number): number => {
    const laneWidth = CONFIG.CANVAS_WIDTH / CONFIG.LANES;
    return lane * laneWidth + laneWidth / 2;
  };

  // Initialize game
  const initGame = () => {
    const state = gameStateRef.current;
    state.isRunning = true;
    state.lastTime = 0;
    state.currentLane = 1;
    state.targetLane = 1;
    state.laneTransitionProgress = 1;
    state.speed = CONFIG.INITIAL_SPEED;
    state.distance = 0;
    state.timeElapsed = 0;
    state.obstacles = [];
    state.obstacleSpawnTimer = 0;
    state.nextSpawnTime = 1.0;
    state.hits = 0;
    state.dodges = 0;
    state.maxSpeed = CONFIG.INITIAL_SPEED;
    state.speedSum = 0;
    state.speedSamples = 0;
    state.reactionTimes = [];
    state.hitFlash = 0;
    state.totalObstaclesSpawned = 0;
    state.lastLaneSwitchTime = 0;
  };

  // Spawn obstacle
  const spawnObstacle = () => {
    const state = gameStateRef.current;
    const lane = Math.floor(Math.random() * CONFIG.LANES);

    state.obstacles.push({
      id: Date.now() + Math.random(),
      lane,
      y: -CONFIG.OBSTACLE_HEIGHT,
      passed: false,
    });

    state.totalObstaclesSpawned++;

    // Random next spawn time
    state.nextSpawnTime =
      CONFIG.SPAWN_INTERVAL_MIN +
      Math.random() * (CONFIG.SPAWN_INTERVAL_MAX - CONFIG.SPAWN_INTERVAL_MIN);
    state.obstacleSpawnTimer = 0;
  };

  // Check collision
  const checkCollision = (obstacle: Obstacle, playerX: number): boolean => {
    const laneWidth = CONFIG.CANVAS_WIDTH / CONFIG.LANES;
    const obstacleCenterX = getLaneX(obstacle.lane);

    // Check Y overlap
    if (
      obstacle.y + CONFIG.OBSTACLE_HEIGHT > CONFIG.PLAYER_Y - CONFIG.PLAYER_SIZE / 2 &&
      obstacle.y < CONFIG.PLAYER_Y + CONFIG.PLAYER_SIZE / 2
    ) {
      // Check X overlap
      const dx = Math.abs(playerX - obstacleCenterX);
      if (dx < (CONFIG.OBSTACLE_WIDTH + CONFIG.PLAYER_SIZE) / 2) {
        return true;
      }
    }
    return false;
  };

  // Handle lane switch (for reaction time tracking)
  const handleLaneSwitch = (newLane: number) => {
    const state = gameStateRef.current;
    const now = performance.now();

    // Track reaction time if there's an approaching obstacle
    const approachingObstacle = state.obstacles.find(
      obs => obs.y > CONFIG.PLAYER_Y - 300 && obs.y < CONFIG.PLAYER_Y && obs.lane === state.currentLane
    );

    if (approachingObstacle && state.lastLaneSwitchTime > 0) {
      const reactionTime = now - state.lastLaneSwitchTime;
      if (reactionTime < 2000) { // Only track reasonable reaction times
        state.reactionTimes.push(reactionTime);
      }
    }

    state.lastLaneSwitchTime = now;
  };

  // Update game state
  const updateGame = (dt: number) => {
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

    // Update distance
    state.distance += state.speed * dt;

    // Update lane transition (smooth lerping)
    if (state.currentLane !== state.targetLane) {
      state.laneTransitionProgress += dt / CONFIG.LANE_SWITCH_DURATION;
      if (state.laneTransitionProgress >= 1) {
        state.laneTransitionProgress = 1;
        state.currentLane = state.targetLane;
      }
    }

    // Calculate current player X (with smooth transition)
    const fromX = getLaneX(state.currentLane);
    const toX = getLaneX(state.targetLane);
    const t = state.laneTransitionProgress;
    // Ease out cubic for smooth deceleration
    const easedT = 1 - Math.pow(1 - t, 3);
    const playerX = fromX + (toX - fromX) * easedT;

    // Update obstacles
    for (let i = state.obstacles.length - 1; i >= 0; i--) {
      const obstacle = state.obstacles[i];
      obstacle.y += state.speed * dt;

      // Check collision
      if (checkCollision(obstacle, playerX)) {
        state.hits++;
        state.speed = Math.max(CONFIG.MIN_SPEED, state.speed - CONFIG.HIT_PENALTY);
        state.hitFlash = 0.3;
        state.obstacles.splice(i, 1);
        continue;
      }

      // Check if passed successfully
      if (!obstacle.passed && obstacle.y > CONFIG.PLAYER_Y + CONFIG.PLAYER_SIZE) {
        obstacle.passed = true;
        state.dodges++;
      }

      // Remove off-screen obstacles
      if (obstacle.y > CONFIG.CANVAS_HEIGHT + CONFIG.OBSTACLE_HEIGHT) {
        state.obstacles.splice(i, 1);
      }
    }

    // Spawn new obstacles
    state.obstacleSpawnTimer += dt;
    if (state.obstacleSpawnTimer >= state.nextSpawnTime) {
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

  // Render game
  const renderGame = (ctx: CanvasRenderingContext2D) => {
    const state = gameStateRef.current;

    // Clear canvas
    ctx.clearRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, CONFIG.CANVAS_HEIGHT);
    gradient.addColorStop(0, CONFIG.BG_GRADIENT_TOP);
    gradient.addColorStop(1, CONFIG.BG_GRADIENT_BOTTOM);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

    // Draw lane dividers
    const laneWidth = CONFIG.CANVAS_WIDTH / CONFIG.LANES;
    ctx.strokeStyle = CONFIG.LANE_LINE_COLOR;
    ctx.lineWidth = 2;
    ctx.setLineDash([20, 15]);

    for (let i = 1; i < CONFIG.LANES; i++) {
      const x = i * laneWidth;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CONFIG.CANVAS_HEIGHT);
      ctx.stroke();
    }

    ctx.setLineDash([]);

    // Draw obstacles (dark rounded rectangles)
    ctx.fillStyle = CONFIG.OBSTACLE_COLOR;
    state.obstacles.forEach(obstacle => {
      const x = getLaneX(obstacle.lane) - CONFIG.OBSTACLE_WIDTH / 2;
      const y = obstacle.y;

      // Rounded rectangle
      ctx.beginPath();
      ctx.roundRect(x, y, CONFIG.OBSTACLE_WIDTH, CONFIG.OBSTACLE_HEIGHT, 8);
      ctx.fill();
    });

    // Draw player (blue triangle pointing up)
    const fromX = getLaneX(state.currentLane);
    const toX = getLaneX(state.targetLane);
    const t = state.laneTransitionProgress;
    const easedT = 1 - Math.pow(1 - t, 3);
    const playerX = fromX + (toX - fromX) * easedT;
    const playerY = CONFIG.PLAYER_Y;

    ctx.fillStyle = CONFIG.PLAYER_COLOR;
    ctx.beginPath();
    ctx.moveTo(playerX, playerY - CONFIG.PLAYER_SIZE / 2); // Top point
    ctx.lineTo(playerX - CONFIG.PLAYER_SIZE / 2, playerY + CONFIG.PLAYER_SIZE / 2); // Bottom left
    ctx.lineTo(playerX + CONFIG.PLAYER_SIZE / 2, playerY + CONFIG.PLAYER_SIZE / 2); // Bottom right
    ctx.closePath();
    ctx.fill();

    // Draw hit flash
    if (state.hitFlash > 0) {
      ctx.fillStyle = CONFIG.HIT_FLASH_COLOR;
      ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
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

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      renderGame(ctx);
    }

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  };

  // Start game
  const startGame = () => {
    initGame();
    setPhase("playing");
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
    const totalObstacles = state.totalObstaclesSpawned;
    const avgReaction = state.reactionTimes.length > 0
      ? state.reactionTimes.reduce((a, b) => a + b, 0) / state.reactionTimes.length
      : 0;

    // Calculate score components
    const speedFactor = avgSpeed / CONFIG.MAX_SPEED;
    const accuracyFactor = totalObstacles > 0 ? 1 - (state.hits / totalObstacles) : 1;
    const worstReaction = 1500; // ms baseline
    const reactionFactor = avgReaction > 0 ? Math.max(0, 1 - (avgReaction / worstReaction)) : 0.5;

    // Final score: 50% speed, 30% accuracy, 20% reaction
    const finalScore = Math.round(
      100 * (0.5 * speedFactor + 0.3 * accuracyFactor + 0.2 * reactionFactor)
    );

    // Score message
    let message = "";
    if (finalScore >= 90) message = "Excellent processing speed.";
    else if (finalScore >= 70) message = "Good reaction speed.";
    else if (finalScore >= 40) message = "Average focus today.";
    else message = "Cognitive speed is low; try again later.";

    setScore(Math.min(finalScore, 100));
    setScoreMessage(message);
    setStats({
      distance: Math.round(state.distance),
      avgSpeed: Math.round(avgSpeed),
      maxSpeed: Math.round(state.maxSpeed),
      hits: state.hits,
      dodges: state.dodges,
      avgReaction: Math.round(avgReaction),
    });

    setPhase("results");
  };

  // Handle input
  const handleLaneChange = (direction: number) => {
    if (phase !== "playing") return;

    const state = gameStateRef.current;
    const newLane = Math.max(0, Math.min(CONFIG.LANES - 1, state.targetLane + direction));

    if (newLane !== state.targetLane) {
      state.targetLane = newLane;
      state.laneTransitionProgress = 0;
      handleLaneSwitch(newLane);
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (phase !== "playing") return;

      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        handleLaneChange(-1);
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        handleLaneChange(1);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [phase]);

  // Touch/click controls
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (phase !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const halfWidth = CONFIG.CANVAS_WIDTH / 2;

    if (x < halfWidth) {
      handleLaneChange(-1);
    } else {
      handleLaneChange(1);
    }
  };

  const saveAndContinue = () => {
    localStorage.setItem("highwayScore", score.toString());
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
            Highway Hazards
          </h1>
          <div className="space-y-4 text-[#CBD5E1] mb-8">
            <p className="text-lg">
              Test your <strong className="text-white">processing speed</strong> and <strong className="text-white">reaction time</strong> for 40 seconds.
            </p>
            <p className="text-lg">
              Use <strong className="text-white">← → Arrow Keys</strong> or <strong className="text-white">A/D</strong> to switch lanes.
            </p>
            <p className="text-lg">
              <strong className="text-white">Avoid obstacles</strong> - hitting them slows you down and increases errors.
            </p>
            <p className="text-lg">
              Your score is based on <strong className="text-white">speed</strong>, <strong className="text-white">accuracy</strong>, and <strong className="text-white">reaction time</strong>.
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
    const timeLeft = Math.max(0, CONFIG.GAME_DURATION - state.timeElapsed);

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0F172A]">
        {/* HUD */}
        <div className="w-full max-w-md mb-4 p-4 bg-[#1E293B]/90 rounded-lg">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-[#CBD5E1] text-xs">Time</p>
              <p className="text-white font-bold text-lg">{Math.ceil(timeLeft)}s</p>
            </div>
            <div>
              <p className="text-[#CBD5E1] text-xs">Speed</p>
              <p className="text-[#4F7BFE] font-bold text-lg">{Math.round(state.speed)}</p>
            </div>
            <div>
              <p className="text-[#CBD5E1] text-xs">Distance</p>
              <p className="text-[#A855F7] font-bold text-lg">{Math.round(state.distance)}</p>
            </div>
            <div>
              <p className="text-[#CBD5E1] text-xs">Errors</p>
              <p className="text-red-400 font-bold text-lg">{state.hits}</p>
            </div>
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
          Use ← → Arrow Keys or A/D to dodge • Tap left/right on mobile
        </p>
      </div>
    );
  }

  if (phase === "results") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full card-testmate p-8">
          <h2 className="text-4xl font-bold mb-4 text-center text-[#4F7BFE]">
            Test Complete
          </h2>
          <div className="text-center mb-6">
            <div className="text-7xl font-bold text-[#A855F7] mb-4">
              {score}
            </div>
            <p className="text-2xl text-[#CBD5E1] mb-2">out of 100</p>
            <p className="text-xl text-white font-semibold">{scoreMessage}</p>
          </div>
          <div className="space-y-4 mb-8">
            <div className="flex justify-between p-4 bg-[#0F172A] rounded-lg">
              <span className="text-[#CBD5E1]">Distance Traveled:</span>
              <span className="text-white font-bold">{stats.distance} units</span>
            </div>
            <div className="flex justify-between p-4 bg-[#0F172A] rounded-lg">
              <span className="text-[#CBD5E1]">Average Speed:</span>
              <span className="text-white font-bold">{stats.avgSpeed}</span>
            </div>
            <div className="flex justify-between p-4 bg-[#0F172A] rounded-lg">
              <span className="text-[#CBD5E1]">Max Speed:</span>
              <span className="text-white font-bold">{stats.maxSpeed}</span>
            </div>
            <div className="flex justify-between p-4 bg-[#0F172A] rounded-lg">
              <span className="text-[#CBD5E1]">Successful Dodges:</span>
              <span className="text-white font-bold">{stats.dodges} ✓</span>
            </div>
            <div className="flex justify-between p-4 bg-[#0F172A] rounded-lg">
              <span className="text-[#CBD5E1]">Collisions:</span>
              <span className="text-white font-bold">{stats.hits} ✗</span>
            </div>
            {stats.avgReaction > 0 && (
              <div className="flex justify-between p-4 bg-[#0F172A] rounded-lg">
                <span className="text-[#CBD5E1]">Avg Reaction Time:</span>
                <span className="text-white font-bold">{stats.avgReaction}ms</span>
              </div>
            )}
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
