import type { Metadata } from 'next';
import LeaderboardsClient from './LeaderboardsClient';
import { Trophy, Medal, Users, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: "🏆 NoPixel 4.0 Leaderboards - Player Level & Daily Streak Rankings",
  description: "Compete on the NoPixel 4.0 global leaderboards. Climb the Player Level rankings by earning XP, and build the longest Daily Challenge streak. Log in with Discord and track your progress.",
  keywords: ["NoPixel leaderboard", "GTA RP rankings", "NoPixel player level", "daily streak leaderboard", "NoPixel 4.0 leaderboard"],
  openGraph: {
    title: "🏆 NoPixel 4.0 Leaderboards - Compete Globally",
    description: "View the global Player Level and Daily Streak rankings. Earn XP, build your streak, and climb to the top.",
    url: "https://nphacks.net/leaderboards",
  },
  alternates: {
    canonical: "https://nphacks.net/leaderboards",
  },
};

export default function LeaderboardsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1B21] via-[#1a2930] to-[#0F1B21]">
      {/* SSR SEO Content Header */}
      <div className="pt-20 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <Trophy className="w-10 h-10 text-yellow-400" />
              Global Leaderboards
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Compete with players worldwide on our real-time leaderboards. Earn XP to climb
              the Player Level rankings, and complete the daily challenge every day to build
              the longest streak.
            </p>
          </div>

          {/* SEO Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#1a2930]/80 border border-yellow-400/20 rounded-xl p-4 text-center">
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Categories</p>
              <p className="text-white font-bold text-xl">2</p>
            </div>
            <div className="bg-[#1a2930]/80 border border-[#54FFA4]/20 rounded-xl p-4 text-center">
              <Users className="w-8 h-8 text-[#54FFA4] mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Players</p>
              <p className="text-white font-bold text-xl">1000+</p>
            </div>
            <div className="bg-[#1a2930]/80 border border-purple-400/20 rounded-xl p-4 text-center">
              <Medal className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Rankings</p>
              <p className="text-white font-bold text-xl">Live</p>
            </div>
            <div className="bg-[#1a2930]/80 border border-blue-400/20 rounded-xl p-4 text-center">
              <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Updates</p>
              <p className="text-white font-bold text-xl">Real-time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Client-side Dynamic Leaderboard */}
      <LeaderboardsClient />

      {/* SSR SEO Footer Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-[#1a2930]/60 border border-white/10 rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-white mb-4">How Our Ranking System Works</h2>
          <div className="space-y-4 text-gray-300">
            <p>
              Our leaderboards give you two ways to compete and prove your skills: your overall
              Player Level, and your Daily Challenge streak.
            </p>
            <h3 className="text-xl font-semibold text-white mt-6 mb-2">Ranking Categories</h3>
            <ul className="space-y-2">
              <li><span className="text-[#54FFA4] font-semibold">Player Level:</span> Earn XP by completing games and daily challenges. Level up to show your dedication.</li>
              <li><span className="text-[#54FFA4] font-semibold">Daily Streak:</span> Complete daily challenges consecutively to build your streak and climb the rankings.</li>
            </ul>
            <h3 className="text-xl font-semibold text-white mt-6 mb-2">Getting Started</h3>
            <p>
              To appear on the leaderboards, simply log in with your Discord account and start
              playing! Your XP and streak are automatically tracked and updated in real-time.
              Challenge yourself, compete with friends, and aim for the top of the global rankings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
