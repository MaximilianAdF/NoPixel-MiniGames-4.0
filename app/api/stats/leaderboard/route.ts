import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { TIME_BASED_GAMES, SCORE_BASED_GAMES } from "@/app/utils/gamePresets";

// Force this route to be dynamic
export const dynamic = "force-dynamic";

/**
 * GET /api/stats/leaderboard?type=level&limit=50&page=1
 * GET /api/stats/leaderboard?type=level&userId=123  (fetch specific user's rank)
 *
 * Get leaderboard data for various ranking types
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "level";
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const userId = searchParams.get("userId");

    // Calculate offset for pagination
    const skip = (page - 1) * limit;

    const client = await clientPromise;
    const db = client.db("nopixel");

    let leaderboard;

    switch (type) {
      case "level":
        if (userId) {
          // Get specific user's rank
          const user = await db
            .collection("users")
            .findOne({ _id: new ObjectId(userId) });
          if (!user) {
            return NextResponse.json({ entry: null });
          }

          // Count how many users have higher rank
          const rank =
            (await db.collection("users").countDocuments({
              $or: [
                { level: { $gt: user.level || 1 } },
                { level: user.level || 1, totalXP: { $gt: user.totalXP || 0 } },
              ],
            })) + 1;

          return NextResponse.json({
            entry: {
              rank,
              userId: user._id.toString(),
              username: user.username,
              displayName: user.displayName,
              avatar: user.avatar,
              value: user.level || 1,
              secondaryValue: user.totalXP || 0,
              verified: user.verified || false,
            },
          });
        }

        // Ranked by level, then by totalXP
        const levelTotalCount = await db.collection("users").countDocuments({});

        leaderboard = await db
          .collection("users")
          .find({})
          .sort({ level: -1, totalXP: -1 })
          .skip(skip)
          .limit(limit)
          .toArray();

        return NextResponse.json({
          type: "level",
          entries: leaderboard.map((user, index) => ({
            rank: skip + index + 1,
            userId: user._id.toString(),
            username: user.username,
            displayName: user.displayName,
            avatar: user.avatar,
            value: user.level || 1,
            secondaryValue: user.totalXP || 0,
            verified: user.verified || false,
          })),
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(levelTotalCount / limit),
            totalCount: levelTotalCount,
            limit,
          },
        });

      case "streak":
        if (userId) {
          // Get specific user's rank
          const user = await db
            .collection("users")
            .findOne({ _id: new ObjectId(userId) });
          if (!user) {
            return NextResponse.json({ entry: null });
          }

          // Count how many users have higher rank (ranked by longest streak ever achieved)
          const rank =
            (await db.collection("users").countDocuments({
              $or: [
                { longestDailyStreak: { $gt: user.longestDailyStreak || 0 } },
                {
                  longestDailyStreak: user.longestDailyStreak || 0,
                  currentDailyStreak: { $gt: user.currentDailyStreak || 0 },
                },
              ],
            })) + 1;

          return NextResponse.json({
            entry: {
              rank,
              userId: user._id.toString(),
              username: user.username,
              displayName: user.displayName,
              avatar: user.avatar,
              value: user.longestDailyStreak || 0,
              secondaryValue: user.currentDailyStreak || 0,
              verified: user.verified || false,
            },
          });
        }

        // Ranked by longest daily streak (highest streak ever achieved)
        const streakTotalCount = await db
          .collection("users")
          .countDocuments({});

        leaderboard = await db
          .collection("users")
          .find({})
          .sort({ longestDailyStreak: -1, currentDailyStreak: -1 })
          .skip(skip)
          .limit(limit)
          .toArray();

        return NextResponse.json({
          type: "streak",
          entries: leaderboard.map((user, index) => ({
            rank: skip + index + 1,
            userId: user._id.toString(),
            username: user.username,
            displayName: user.displayName,
            avatar: user.avatar,
            value: user.longestDailyStreak || 0,
            secondaryValue: user.currentDailyStreak || 0,
            verified: user.verified || false,
          })),
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(streakTotalCount / limit),
            totalCount: streakTotalCount,
            limit,
          },
        });

      case "thermite":
      case "lockpick":
      case "laundromat":
      case "pincracker":
      case "chopping":
      case "roof-running":
      case "word-memory":
        const isTimeBased = TIME_BASED_GAMES.includes(type);
        const isScoreBased = SCORE_BASED_GAMES.includes(type);

        if (userId) {
          // Get specific user's rank for this game
          const userStat = await db.collection("gameStats").findOne({
            userId,
            game: type,
            isLeaderboardEligible: true,
          });

          if (!userStat) {
            return NextResponse.json({ entry: null });
          }

          const user = await db
            .collection("users")
            .findOne({ _id: new ObjectId(userId) });

          // Count how many users have better time/score
          let rank;
          if (isTimeBased) {
            // For time-based: lower is better
            rank =
              (await db.collection("gameStats").countDocuments({
                game: type,
                isLeaderboardEligible: true,
                bestTime: { $lt: userStat.bestTime || Infinity },
              })) + 1;
          } else {
            // For score-based: higher is better
            rank =
              (await db.collection("gameStats").countDocuments({
                game: type,
                isLeaderboardEligible: true,
                bestScore: { $gt: userStat.bestScore || 0 },
              })) + 1;
          }

          return NextResponse.json({
            entry: {
              rank,
              userId: userId,
              username: user?.username || "Unknown",
              displayName: user?.displayName || "Unknown",
              avatar: user?.avatar || null,
              value: isTimeBased ? userStat.bestTime : userStat.bestScore,
              secondaryValue: userStat.gamesPlayed || 0,
              verified: user?.verified || false,
            },
          });
        }

        // Game-specific leaderboards - only show leaderboard-eligible entries
        const sortField = isTimeBased ? "bestTime" : "bestScore";
        const sortOrder = isTimeBased ? 1 : -1; // Ascending for time, descending for score

        const gameTotalCount = await db.collection("gameStats").countDocuments({
          game: type,
          isLeaderboardEligible: true,
        });

        const gameStats = await db
          .collection("gameStats")
          .find({
            game: type,
            isLeaderboardEligible: true,
          })
          .sort({ [sortField]: sortOrder })
          .skip(skip)
          .limit(limit)
          .toArray();

        // Get user data for each entry
        const userIds = gameStats.map((stat) => new ObjectId(stat.userId));
        const users = await db
          .collection("users")
          .find({ _id: { $in: userIds } })
          .toArray();

        const userMap = new Map(users.map((u) => [u._id.toString(), u]));

        return NextResponse.json({
          type,
          entries: gameStats.map((stat, index) => {
            const user = userMap.get(stat.userId);
            return {
              rank: skip + index + 1,
              userId: stat.userId,
              username: user?.username || "Unknown",
              displayName: user?.displayName || "Unknown",
              avatar: user?.avatar || null,
              value: isTimeBased ? stat.bestTime : stat.bestScore,
              secondaryValue: stat.gamesPlayed || 0,
              verified: user?.verified || false,
            };
          }),
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(gameTotalCount / limit),
            totalCount: gameTotalCount,
            limit,
          },
        });

      default:
        return NextResponse.json(
          { error: "Invalid leaderboard type" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error getting leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to get leaderboard" },
      { status: 500 }
    );
  }
}
