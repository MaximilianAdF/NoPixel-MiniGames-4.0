import { ArrowLeft, Clock, Target, AlertTriangle, CheckCircle, Lightbulb, Blocks, Zap, Brain, Trophy, Timer } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Roof Running Guide - Master NoPixel 4.0 Tile Clearing Puzzle | Expert Tips',
  description: 'Complete guide to mastering the Roof Running minigame in NoPixel 4.0. Learn tile group clearing, gravity mechanics, and strategic color matching techniques.',
  keywords: ['roof running guide', 'NoPixel roof running', 'tile clearing tutorial', 'color matching tips', 'GTA RP puzzle hack'],
};

export default function RoofRunningGuidePage() {
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
            <div className="p-4 bg-purple-500/20 rounded-xl">
              <Blocks className="w-12 h-12 text-purple-400" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Roof Running Guide
              </h1>
              <p className="text-[#54FFA4] text-lg">Tile Clearing Strategy Puzzle</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              5 min read
            </span>
            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-md border border-green-500/30">
              Easy-Medium Difficulty
            </span>
            <span className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              Success Rate: ~65% (untrained) → 98%+ (trained)
            </span>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Table of Contents</h2>
          <nav className="space-y-2">
            <a href="#overview" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">1. Overview</a>
            <a href="#how-it-works" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">2. How Roof Running Works</a>
            <a href="#controls" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">3. Mastering the Controls</a>
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
              Roof Running is a reaction-based minigame that simulates navigating across rooftops during an escape. You&apos;ll be prompted with directional inputs (arrow keys or WASD) that you must press at the right time to successfully make each jump or turn.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              Unlike memory games, Roof Running tests your reflexes and hand-eye coordination. The challenge comes from the speed of prompts and the need to react accurately under pressure. It&apos;s one of the more forgiving minigames since individual mistakes don&apos;t always mean instant failure—but consistent errors will cause you to fall.
            </p>
            <div className="bg-[#0F1B21] rounded-lg p-4 mt-4">
              <h4 className="text-white font-semibold mb-2">When You&apos;ll Encounter Roof Running:</h4>
              <ul className="text-gray-400 space-y-1 text-sm">
                <li>• Escape sequences during chases</li>
                <li>• Building infiltration routes</li>
                <li>• Some heist entry/exit points</li>
                <li>• Parkour-based challenges</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-[#54FFA4] text-[#0F1B21] rounded-lg flex items-center justify-center font-bold">2</span>
            How Roof Running Works
          </h2>
          <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">The Mechanics</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  The game shows a sequence of directional prompts that appear on screen. Each prompt requires you to press the corresponding key within a short time window. Success moves you forward; failure reduces your momentum or causes a stumble.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#0F1B21] rounded-lg p-4">
                  <h4 className="text-[#54FFA4] font-semibold mb-2">Game Elements</h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Directional arrows (↑ ↓ ← →)</li>
                    <li>• Timing window indicator</li>
                    <li>• Multiple consecutive prompts</li>
                    <li>• Speed increases as you progress</li>
                  </ul>
                </div>
                <div className="bg-[#0F1B21] rounded-lg p-4">
                  <h4 className="text-[#54FFA4] font-semibold mb-2">Success Conditions</h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Press correct key in time</li>
                    <li>• Maintain enough momentum</li>
                    <li>• Complete all prompts in sequence</li>
                    <li>• Don&apos;t miss too many in a row</li>
                  </ul>
                </div>
              </div>

              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Timer className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-orange-400 font-semibold mb-1">Timing is Everything</h4>
                    <p className="text-gray-300 text-sm">
                      Each prompt has a &quot;perfect&quot; zone and an &quot;acceptable&quot; zone. Hitting the perfect zone maintains max speed; hitting acceptable keeps you going but may slow you down. Missing entirely causes stumbles.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Controls Section */}
        <section id="controls" className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-[#54FFA4] text-[#0F1B21] rounded-lg flex items-center justify-center font-bold">3</span>
            Mastering the Controls
          </h2>
          <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Control Options</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-[#0F1B21] rounded-lg p-4">
                    <h4 className="text-[#54FFA4] font-semibold mb-3">Arrow Keys</h4>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-white font-bold">↑</div>
                      <div className="flex gap-2">
                        <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-white font-bold">←</div>
                        <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-white font-bold">↓</div>
                        <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-white font-bold">→</div>
                      </div>
                    </div>
                    <p className="text-gray-400 text-xs text-center mt-2">Natural for directional thinking</p>
                  </div>
                  <div className="bg-[#0F1B21] rounded-lg p-4">
                    <h4 className="text-[#54FFA4] font-semibold mb-3">WASD Keys</h4>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-white font-bold">W</div>
                      <div className="flex gap-2">
                        <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-white font-bold">A</div>
                        <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-white font-bold">S</div>
                        <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-white font-bold">D</div>
                      </div>
                    </div>
                    <p className="text-gray-400 text-xs text-center mt-2">Better for gamer muscle memory</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300 text-sm">
                    <strong className="text-green-400">Recommendation:</strong> Use whichever control scheme feels more natural. Most gamers prefer WASD because of muscle memory from other games. If you primarily play games with arrow keys, stick with those.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Hand Positioning</h3>
                <p className="text-gray-300 text-sm">
                  Keep your fingers hovering over all four keys, ready to press any direction instantly. Don&apos;t rest on one key—neutral position means faster reaction to any prompt.
                </p>
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
                Strategy 1: Stay Relaxed
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Tension slows reaction time. Keep your hands loose, breathe normally, and don&apos;t grip the keyboard. Relaxed muscles respond faster than tense ones.
              </p>
              <div className="bg-[#0F1B21] rounded-lg p-4">
                <p className="text-gray-400 text-sm">
                  <strong className="text-white">Mental trick:</strong> Think of it like a rhythm game, not a stress test. The prompts have a pattern—flow with it instead of fighting it.
                </p>
              </div>
            </div>

            <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Blocks className="w-5 h-5 text-[#54FFA4]" />
                Strategy 2: Focus on the Timing Indicator
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Don&apos;t watch the arrow itself—watch the timing indicator. Press when the indicator hits the perfect zone. This separates &quot;seeing the direction&quot; from &quot;timing the press,&quot; making both tasks easier.
              </p>
            </div>

            <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#54FFA4]" />
                Strategy 3: Anticipate, Don&apos;t React
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Pure reaction is slow. Instead, start moving your finger toward the key as soon as you see the direction, then press at the right time. This &quot;prepare and execute&quot; approach is faster than &quot;see and react.&quot;
              </p>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300 text-sm">
                    <strong className="text-green-400">Pro Tip:</strong> Your brain needs about 150-200ms to process visual information. Account for this by pressing slightly before you &quot;feel&quot; like you should.
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
                  <h4 className="text-red-400 font-semibold mb-1">Pressing Too Early</h4>
                  <p className="text-gray-300 text-sm">
                    Panicking and pressing before the timing window opens. Wait for the indicator to enter the acceptable zone before pressing.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Wrong Key Presses</h4>
                  <p className="text-gray-300 text-sm">
                    Confusing left/right or up/down under pressure. If this happens often, slow down mentally and verify the direction before pressing.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Losing Focus Mid-Sequence</h4>
                  <p className="text-gray-300 text-sm">
                    Looking away or losing concentration during long sequences. The minigame punishes lapses in attention—stay locked in until it&apos;s done.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Tensing Up After Mistakes</h4>
                  <p className="text-gray-300 text-sm">
                    One miss leads to panic, which leads to more misses. If you stumble, mentally reset and focus on the next prompt as if it&apos;s a fresh start.
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
                  <h4 className="text-white font-semibold mb-1">Play Rhythm Games</h4>
                  <p className="text-gray-400 text-sm">Games like osu!, Guitar Hero, or Beat Saber train the exact same skills. Cross-training helps.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Use a Mechanical Keyboard</h4>
                  <p className="text-gray-400 text-sm">Faster key actuation and tactile feedback improve reaction time and accuracy.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Warm Up Your Hands</h4>
                  <p className="text-gray-400 text-sm">Cold fingers are slow fingers. Stretch and warm up before important heists.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Reduce Input Lag</h4>
                  <p className="text-gray-400 text-sm">Enable game mode on your monitor, use wired peripherals, close background apps.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Practice at Higher Speeds</h4>
                  <p className="text-gray-400 text-sm">If available, train at faster settings. Normal speed will feel slow by comparison.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Focus on Consistency</h4>
                  <p className="text-gray-400 text-sm">It&apos;s better to hit all &quot;good&quot; zones than to alternate between &quot;perfect&quot; and &quot;miss.&quot;</p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-[#54FFA4]/10 border border-[#54FFA4]/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Trophy className="w-5 h-5 text-[#54FFA4] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[#54FFA4] font-semibold mb-1">Mastery Benchmark</h4>
                  <p className="text-gray-300 text-sm">
                    You&apos;ve mastered Roof Running when you can complete 20+ consecutive prompts without a miss on standard difficulty. At that point, the minigame becomes automatic and you can focus on the excitement of the chase.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/30 rounded-xl p-8 text-center">
          <Blocks className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Master Roof Running?</h2>
          <p className="text-gray-300 mb-6 max-w-lg mx-auto">
            Train your reflexes with unlimited practice. Perfect your timing until every escape is flawless.
          </p>
          <Link
            href="/puzzles/roof-running"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-bold hover:from-green-600 hover:to-emerald-600 transition-all hover:scale-105"
          >
            <Blocks className="w-5 h-5" />
            Practice Roof Running Now
          </Link>
        </div>
      </div>
    </div>
  );
}
