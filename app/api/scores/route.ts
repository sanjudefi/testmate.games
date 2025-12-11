import { NextRequest, NextResponse } from "next/server";

interface ScoreData {
  testName: string;
  score: number;
  timestamp: string;
}

// In-memory storage for demo purposes
// In production, you'd use a database
let scores: ScoreData[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testName, score } = body;

    if (!testName || typeof score !== "number") {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    const scoreData: ScoreData = {
      testName,
      score,
      timestamp: new Date().toISOString(),
    };

    scores.push(scoreData);

    return NextResponse.json({
      success: true,
      message: "Score saved successfully",
      data: scoreData,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save score" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const testName = searchParams.get("testName");

    let filteredScores = scores;

    if (testName) {
      filteredScores = scores.filter((s) => s.testName === testName);
    }

    // Calculate statistics
    const stats = {
      totalTests: filteredScores.length,
      averageScore: filteredScores.length > 0
        ? filteredScores.reduce((sum, s) => sum + s.score, 0) / filteredScores.length
        : 0,
      highestScore: filteredScores.length > 0
        ? Math.max(...filteredScores.map((s) => s.score))
        : 0,
      lowestScore: filteredScores.length > 0
        ? Math.min(...filteredScores.map((s) => s.score))
        : 0,
    };

    return NextResponse.json({
      success: true,
      scores: filteredScores,
      stats,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve scores" },
      { status: 500 }
    );
  }
}
