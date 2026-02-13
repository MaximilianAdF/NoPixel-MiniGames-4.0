"use client";

import Link from "next/link";
import { BookOpen, Clock, Target, Zap, ChevronRight } from "lucide-react";

interface PuzzlePageWrapperProps {
  children: React.ReactNode;
  title: string;
  gameName: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Expert";
  avgTime: string;
  inGameUse: string;
  howToPlay: string[];
  tips: string[];
  guideUrl: string;
}

const difficultyColors = {
  Easy: "text-green-400 bg-green-400/10",
  Medium: "text-yellow-400 bg-yellow-400/10",
  Hard: "text-orange-400 bg-orange-400/10",
  Expert: "text-red-400 bg-red-400/10",
};

export default function PuzzlePageWrapper({
  children,
  title,
  gameName,
  description,
  difficulty,
  avgTime,
  inGameUse,
  howToPlay,
  tips,
  guideUrl,
}: PuzzlePageWrapperProps) {
  return (
    <div>
      {/* Game Component - Full viewport height minus header */}
      <div 
        className="flex items-center justify-center p-5"
        style={{
          minHeight: 'calc(100vh - 4rem)',
          paddingBottom: 'calc(env(keyboard-inset-height, 0px) + env(safe-area-inset-bottom, 0px))',
        }}
      >
        {children}
      </div>

      {/* SEO-Rich Content Section - Renders as SSR-friendly content */}
      <section className="max-w-4xl mx-auto px-4 pb-20 pt-8">
        <div className="bg-gradient-to-br from-mirage-900/80 to-mirage-950/80 backdrop-blur-sm border border-[#54FFA4]/20 rounded-2xl p-6 md:p-8 shadow-xl">
          {/* Header */}
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            About {title}
          </h2>
          <p className="text-gray-300 leading-relaxed text-lg mb-8">
            {description}
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-mirage-950/60 rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                <Target className="w-4 h-4" />
                <span>Difficulty</span>
              </div>
              <p className={`font-bold text-lg ${difficultyColors[difficulty]?.split(" ")[0] || "text-white"}`}>
                {difficulty}
              </p>
            </div>
            <div className="bg-mirage-950/60 rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                <Clock className="w-4 h-4" />
                <span>Avg. Time</span>
              </div>
              <p className="text-white font-bold text-lg">{avgTime}</p>
            </div>
            <div className="bg-mirage-950/60 rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                <Zap className="w-4 h-4" />
                <span>Practice</span>
              </div>
              <p className="text-[#54FFA4] font-bold text-lg">Unlimited</p>
            </div>
            <div className="bg-mirage-950/60 rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                <BookOpen className="w-4 h-4" />
                <span>In-Game Use</span>
              </div>
              <p className="text-white font-bold text-lg truncate" title={inGameUse}>
                {inGameUse}
              </p>
            </div>
          </div>

          {/* How to Play */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-[#54FFA4]/20 rounded-lg flex items-center justify-center">
                🎮
              </span>
              How to Play {gameName}
            </h3>
            <ol className="space-y-3">
              {howToPlay.map((step, index) => (
                <li key={index} className="flex gap-3 text-gray-300">
                  <span className="flex-shrink-0 w-6 h-6 bg-[#54FFA4]/20 text-[#54FFA4] rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Quick Tips */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                💡
              </span>
              Quick Tips for Success
            </h3>
            <ul className="space-y-2">
              {tips.map((tip, index) => (
                <li key={index} className="flex gap-3 text-gray-300">
                  <ChevronRight className="w-5 h-5 text-[#54FFA4] flex-shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Guide CTA */}
          <div className="bg-gradient-to-r from-[#54FFA4]/10 to-[#54FFA4]/5 border border-[#54FFA4]/30 rounded-xl p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h4 className="text-lg font-bold text-white mb-1">
                  Want to Master {gameName}?
                </h4>
                <p className="text-gray-400">
                  Check out our comprehensive guide with expert strategies, advanced techniques, and pro tips.
                </p>
              </div>
              <Link
                href={guideUrl}
                className="inline-flex items-center gap-2 bg-[#54FFA4] hover:bg-[#45e898] text-mirage-950 font-bold py-3 px-6 rounded-xl transition-all hover:scale-105 whitespace-nowrap"
              >
                <BookOpen className="w-5 h-5" />
                Read Full Guide
              </Link>
            </div>
          </div>
        </div>

        {/* Additional SEO Content */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            Practice makes perfect! This free {gameName} trainer uses the exact same mechanics as NoPixel 4.0.
            Whether you&apos;re preparing for your first heist or aiming for the leaderboards, unlimited practice
            sessions will help you master this minigame.
          </p>
        </div>
      </section>
    </div>
  );
}
