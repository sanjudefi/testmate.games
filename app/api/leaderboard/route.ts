import { NextRequest, NextResponse } from "next/server";

interface LeaderboardEntry {
  username: string;
  overallScore: number;
  wordMemory: number;
  numberMemory: number;
  chimpTest: number;
  aimTrainer: number;
  timestamp: string;
}

// In-memory storage for demo purposes
let leaderboard: LeaderboardEntry[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      username,
      wordMemory,
      numberMemory,
      chimpTest,
      aimTrainer,
    } = body;

    if (!username || typeof wordMemory !== "number" || typeof numberMemory !== "number" ||
        typeof chimpTest !== "number" || typeof aimTrainer !== "number") {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    const overallScore = Math.round(
      (wordMemory + numberMemory + chimpTest + aimTrainer) / 4
    );

    const entry: LeaderboardEntry = {
      username,
      overallScore,
      wordMemory,
      numberMemory,
      chimpTest,
      aimTrainer,
      timestamp: new Date().toISOString(),
    };

    leaderboard.push(entry);

    // Sort by overall score descending
    leaderboard.sort((a, b) => b.overallScore - a.overallScore);

    // Keep only top 100
    leaderboard = leaderboard.slice(0, 100);

    return NextResponse.json({
      success: true,
      message: "Score submitted to leaderboard",
      data: entry,
      rank: leaderboard.findIndex((e) => e.username === username && e.timestamp === entry.timestamp) + 1,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to submit to leaderboard" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "10");

    const topScores = leaderboard.slice(0, Math.min(limit, 100));

    return NextResponse.json({
      success: true,
      leaderboard: topScores,
      total: leaderboard.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve leaderboard" },
      { status: 500 }
    );
  }
}
