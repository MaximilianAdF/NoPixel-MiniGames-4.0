import type { Metadata } from 'next';
import DailyChallengeClient from './DailyChallengeClient';
import { Calendar, Trophy, Zap, Target, Clock, Flame } from 'lucide-react';

export const metadata: Metadata = {
  title: "🎯 Daily Challenge - NoPixel 4.0 Minigames",
  description: "Complete the daily challenge to earn bonus XP and climb the streak leaderboards! A new NoPixel minigame challenge every day with unique settings and rewards. Build your streak and compete globally.",
  keywords: ["daily challenge", "NoPixel daily", "minigame challenge", "daily streak", "NoPixel 4.0 daily", "GTA RP daily challenge"],
  openGraph: {
    title: "🎯 Daily Challenge - Earn Bonus XP Today",
    description: "Complete today's NoPixel minigame challenge for bonus XP. New challenge every day - build your streak!",
    url: "https://nphacks.net/daily-challenge",
  },
  alternates: {
    canonical: "https://nphacks.net/daily-challenge",
  },
};

export default function DailyChallengePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1B21] via-[#1a2930] to-[#0F1B21]">
      {/* Main Challenge Section - Full viewport height */}
      <div 
        className="flex flex-col pt-16"
        style={{ minHeight: '100vh' }}
      >
        {/* SSR SEO Header Content */}
        <div className="pt-4 pb-6 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <Calendar className="w-10 h-10 text-[#54FFA4]" />
              Daily Challenge
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-6">
              Test your skills with a new challenge every day! Complete the daily minigame to earn bonus XP,
              build your streak, and compete on the global daily leaderboards.
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              <div className="bg-[#1a2930]/80 border border-[#54FFA4]/20 rounded-xl p-3 text-center">
                <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                <p className="text-gray-400 text-xs">Bonus XP</p>
                <p className="text-white font-bold">Up to 2x</p>
              </div>
              <div className="bg-[#1a2930]/80 border border-orange-400/20 rounded-xl p-3 text-center">
                <Flame className="w-6 h-6 text-orange-400 mx-auto mb-1" />
                <p className="text-gray-400 text-xs">Streak Bonus</p>
                <p className="text-white font-bold">+10% per day</p>
              </div>
              <div className="bg-[#1a2930]/80 border border-purple-400/20 rounded-xl p-3 text-center">
                <Target className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                <p className="text-gray-400 text-xs">New Challenge</p>
                <p className="text-white font-bold">Every Day</p>
              </div>
              <div className="bg-[#1a2930]/80 border border-blue-400/20 rounded-xl p-3 text-center">
                <Trophy className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                <p className="text-gray-400 text-xs">Leaderboard</p>
                <p className="text-white font-bold">Global</p>
              </div>
            </div>
          </div>
        </div>

        {/* Client-side Dynamic Challenge Content */}
        <div className="flex-1">
          <DailyChallengeClient />
        </div>
      </div>

      {/* SSR SEO Footer Content - Below the fold */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-[#1a2930]/60 border border-white/10 rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-white mb-4">How Daily Challenges Work</h2>
          <div className="space-y-4 text-gray-300">
            <p>
              Every day at midnight UTC, a new challenge is automatically generated featuring one of the 7 NoPixel minigames.
              The system uses the current date as a seed to deterministically select a random minigame and generate unique
              difficulty settings - this ensures every player worldwide gets the exact same challenge each day.
              Parameters like grid size, time limits, word counts, and target scores are varied to create fresh challenges.
            </p>
            
            <h3 className="text-xl font-semibold text-white mt-6 mb-2">Streak Rewards</h3>
            <p>
              Build consecutive day streaks to earn increasing XP bonuses. The longer your streak, the more
              bonus XP you&apos;ll receive. But be careful - missing a day resets your streak back to zero!
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><span className="text-[#54FFA4]">3-day streak:</span> +10% bonus XP</li>
              <li><span className="text-[#54FFA4]">7-day streak:</span> +25% bonus XP</li>
              <li><span className="text-[#54FFA4]">14-day streak:</span> +50% bonus XP</li>
              <li><span className="text-[#54FFA4]">30-day streak:</span> +100% bonus XP</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-6 mb-2">Challenge Difficulty</h3>
            <p>
              Each daily challenge features customized settings that may differ from standard gameplay.
              You might face a harder Thermite grid, faster Lockpick timing, or more words to remember.
              The XP reward scales with difficulty - harder challenges mean bigger rewards!
            </p>

            <h3 className="text-xl font-semibold text-white mt-6 mb-2">Getting Started</h3>
            <p>
              Log in with your Discord account to track your daily challenge progress and maintain your streak.
              You can attempt the challenge as many times as needed - only successful completions count toward
              your streak and XP earnings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
