import { ArrowLeft, Clock, Target, AlertTriangle, CheckCircle, Lightbulb, Keyboard, Zap, Brain, Trophy, Timer, MousePointer } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chopping Guide - Master NoPixel 4.0 Typing Challenge | Expert Tips',
  description: 'Complete guide to mastering the Chopping minigame in NoPixel 4.0. Learn typing speed techniques, letter sequence strategies, and pro tips for VIN scratching.',
  keywords: ['chopping guide', 'NoPixel VIN scratch', 'typing challenge tutorial', 'keyboard speed tips', 'GTA RP chopping minigame'],
};

export default function ChoppingGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1B21] via-[#1a2930] to-[#0F1B21] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/guides" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-[#54FFA4] transition-colors mb-8 pt-16"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Guides
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-green-500/20 rounded-xl">
              <Keyboard className="w-12 h-12 text-green-400" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Chopping Guide
              </h1>
              <p className="text-[#54FFA4] text-lg">Typing Speed Challenge</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              6 min read
            </span>
            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-md border border-green-500/30">
              Easy Difficulty
            </span>
            <span className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              Success Rate: ~70% (untrained) → 99%+ (trained)
            </span>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Table of Contents</h2>
          <nav className="space-y-2">
            <a href="#overview" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">1. Overview</a>
            <a href="#how-it-works" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">2. How Chopping Works</a>
            <a href="#timing" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">3. Perfecting Your Timing</a>
            <a href="#strategies" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">4. Winning Strategies</a>
            <a href="#common-mistakes" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">5. Common Mistakes</a>
            <a href="#advanced-tips" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">6. Advanced Pro Tips</a>
          </nav>
        </div>

        {/* Overview Section */}
        <section id="overview" className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-[#54FFA4] text-[#0F1B21] rounded-lg flex items-center justify-center font-bold">1</span>
            Overview
          </h2>
          <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
            <p className="text-gray-300 leading-relaxed mb-4">
              The Chopping minigame (also known as VIN Scratch) is used for scratching vehicle identification numbers during car theft operations. It&apos;s a timing-based minigame where you need to stop a moving indicator within target zones to successfully remove VIN characters.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              This is generally considered one of the easiest minigames in NoPixel 4.0, making it perfect for players new to hacking. However, don&apos;t underestimate it—failed attempts mean wasted tools and time. Mastering the timing ensures you never fail a chop again.
            </p>
            <div className="bg-[#0F1B21] rounded-lg p-4 mt-4">
              <h4 className="text-white font-semibold mb-2">When You&apos;ll Encounter Chopping:</h4>
              <ul className="text-gray-400 space-y-1 text-sm">
                <li>• Vehicle theft operations</li>
                <li>• VIN scratching for chop shops</li>
                <li>• Boosting missions</li>
                <li>• Some racing-related activities</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-[#54FFA4] text-[#0F1B21] rounded-lg flex items-center justify-center font-bold">2</span>
            How Chopping Works
          </h2>
          <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">The Mechanics</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  A progress bar appears with one or more target zones highlighted. A marker moves across the bar at a consistent speed. Your job is to click (or press the action key) when the marker is within a target zone. Each successful hit removes part of the VIN.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#0F1B21] rounded-lg p-4">
                  <h4 className="text-[#54FFA4] font-semibold mb-2">Game Elements</h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Horizontal progress bar</li>
                    <li>• Moving marker/cursor</li>
                    <li>• Target zones to hit</li>
                    <li>• Multiple rounds per VIN</li>
                  </ul>
                </div>
                <div className="bg-[#0F1B21] rounded-lg p-4">
                  <h4 className="text-[#54FFA4] font-semibold mb-2">Success Conditions</h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Click when marker is in target zone</li>
                    <li>• Complete all required hits</li>
                    <li>• Don&apos;t miss too many attempts</li>
                    <li>• Finish before any timer expires</li>
                  </ul>
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Keyboard className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-green-400 font-semibold mb-1">Why It&apos;s Easy</h4>
                    <p className="text-gray-300 text-sm">
                      Unlike other minigames, Chopping has generous target zones and consistent marker speed. The timing window is forgiving, and the marker moves predictably. This makes it ideal for learning timing fundamentals.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timing Section */}
        <section id="timing" className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-[#54FFA4] text-[#0F1B21] rounded-lg flex items-center justify-center font-bold">3</span>
            Perfecting Your Timing
          </h2>
          <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Timer className="w-5 h-5 text-[#54FFA4]" />
                  Understanding the Timing Window
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  The target zone is usually quite wide, giving you a comfortable window to hit. However, aiming for the center of the zone ensures you have maximum margin for error. Think of the center as your bullseye.
                </p>
              </div>

              <div className="flex items-center justify-center gap-4 py-4">
                <div className="w-full max-w-md">
                  <div className="h-8 bg-[#0F1B21] rounded-lg relative overflow-hidden">
                    {/* Target zone */}
                    <div className="absolute left-1/3 w-1/4 h-full bg-[#54FFA4]/30 border-l-2 border-r-2 border-[#54FFA4]" />
                    {/* Marker */}
                    <div className="absolute left-1/2 w-1 h-full bg-white" />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Start</span>
                    <span className="text-[#54FFA4]">Target Zone</span>
                    <span>End</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
                  <p className="text-red-400 font-bold mb-1">Too Early</p>
                  <p className="text-gray-400 text-sm">Miss - wasted attempt</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                  <p className="text-green-400 font-bold mb-1">In Zone</p>
                  <p className="text-gray-400 text-sm">Success!</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
                  <p className="text-red-400 font-bold mb-1">Too Late</p>
                  <p className="text-gray-400 text-sm">Miss - wasted attempt</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Strategies Section */}
        <section id="strategies" className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-[#54FFA4] text-[#0F1B21] rounded-lg flex items-center justify-center font-bold">4</span>
            Winning Strategies
          </h2>
          <div className="space-y-6">
            <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#54FFA4]" />
                Strategy 1: The Rhythm Method
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Watch the marker complete one full pass to learn its speed. Develop a mental rhythm—count &quot;one, two, three, click&quot; or whatever timing works for you. The marker speed is consistent, so once you find the rhythm, you can repeat it reliably.
              </p>
              <div className="bg-[#0F1B21] rounded-lg p-4">
                <p className="text-gray-400 text-sm">
                  <strong className="text-white">Pro Tip:</strong> The marker often bounces back after reaching the end. Use the first pass to calibrate, then hit on the second pass if needed.
                </p>
              </div>
            </div>

            <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <MousePointer className="w-5 h-5 text-[#54FFA4]" />
                Strategy 2: Focus on the Zone Edge
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Instead of watching the marker, watch the left edge of the target zone. When the marker crosses that edge, you know you&apos;re in the safe window. This reduces the mental load of tracking two things simultaneously.
              </p>
            </div>

            <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#54FFA4]" />
                Strategy 3: Aim for Center
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Don&apos;t click as soon as you enter the zone—wait until the marker is roughly centered. This gives you maximum room for error and accounts for any input lag or reaction time variance.
              </p>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300 text-sm">
                    <strong className="text-green-400">Pro Tip:</strong> If the zone is wide, you have time to be patient. Don&apos;t rush the click—a deliberate, centered hit is better than a panicked edge hit.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Common Mistakes Section */}
        <section id="common-mistakes" className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-[#54FFA4] text-[#0F1B21] rounded-lg flex items-center justify-center font-bold">5</span>
            Common Mistakes to Avoid
          </h2>
          <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Clicking Too Early</h4>
                  <p className="text-gray-300 text-sm">
                    Anticipation leading to premature clicks. Wait until you can visually confirm the marker has entered the zone before pressing.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Not Accounting for Lag</h4>
                  <p className="text-gray-300 text-sm">
                    Network or input lag can delay your click by 50-100ms. If you&apos;re consistently missing late, click slightly earlier than feels natural.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Rushing Multiple Zones</h4>
                  <p className="text-gray-300 text-sm">
                    When there are multiple target zones, players sometimes rush to hit them all. Each zone is its own challenge—treat them independently.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Underestimating the Minigame</h4>
                  <p className="text-gray-300 text-sm">
                    Because it&apos;s &quot;easy,&quot; some players don&apos;t focus properly. Overconfidence leads to careless mistakes. Treat every attempt seriously.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Advanced Tips Section */}
        <section id="advanced-tips" className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-[#54FFA4] text-[#0F1B21] rounded-lg flex items-center justify-center font-bold">6</span>
            Advanced Pro Tips
          </h2>
          <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Stable Hand Position</h4>
                  <p className="text-gray-400 text-sm">Rest your clicking hand comfortably. A stable hand reduces unintentional movement and accidental clicks.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Use Keyboard if Possible</h4>
                  <p className="text-gray-400 text-sm">If the minigame supports keyboard input, it&apos;s often more consistent than mouse clicking.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Full Screen Focus</h4>
                  <p className="text-gray-400 text-sm">Play in fullscreen or windowed fullscreen. Borderless lets you see the minigame clearly without distractions.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">60+ FPS</h4>
                  <p className="text-gray-400 text-sm">Higher frame rates make the marker movement smoother and easier to track. Aim for at least 60 FPS.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Build Consistency First</h4>
                  <p className="text-gray-400 text-sm">Don&apos;t worry about speed—focus on never missing. Speed comes naturally with practice.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Warm Up Before Jobs</h4>
                  <p className="text-gray-400 text-sm">Do a few practice rounds before actual chop jobs to get in the zone.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-[#54FFA4]/10 border border-[#54FFA4]/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Trophy className="w-5 h-5 text-[#54FFA4] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[#54FFA4] font-semibold mb-1">Mastery Benchmark</h4>
                  <p className="text-gray-300 text-sm">
                    You&apos;ve mastered Chopping when you can complete 20+ consecutive attempts without a single miss. At this point, the minigame becomes almost automatic and you can focus on the actual job at hand.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-2 border-amber-500/30 rounded-xl p-8 text-center">
          <Keyboard className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Master Chopping?</h2>
          <p className="text-gray-300 mb-6 max-w-lg mx-auto">
            Perfect your timing with unlimited practice. Never fail another VIN scratch and become the most reliable chopper in the city.
          </p>
          <Link
            href="/puzzles/chopping"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-bold hover:from-amber-600 hover:to-orange-600 transition-all hover:scale-105"
          >
            <Keyboard className="w-5 h-5" />
            Practice Chopping Now
          </Link>
        </div>
      </div>
    </div>
  );
}
