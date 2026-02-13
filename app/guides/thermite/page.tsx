import { ArrowLeft, Clock, Target, AlertTriangle, CheckCircle, Lightbulb, Zap, Brain, Trophy } from 'lucide-react';
import Icon from '@mdi/react';
import { mdiFuse } from '@mdi/js';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thermite Hack Guide - Master NoPixel 4.0 Memory Pattern Grid | Expert Tips',
  description: 'Complete guide to mastering the Thermite hack in NoPixel 4.0. Learn pattern memorization, sequence recall strategies, and pro tips for bank heist laser security.',
  keywords: ['thermite hack guide', 'NoPixel thermite', 'memory pattern hack', 'thermite tips', 'GTA RP thermite strategy', 'bank heist hack'],
};

export default function ThermiteGuidePage() {
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
            <div className="p-4 bg-orange-500/20 rounded-xl">
              <Icon path={mdiFuse} size={2.5} className="text-orange-400" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Thermite Hack Guide
              </h1>
              <p className="text-[#54FFA4] text-lg">Memory Pattern Sequence</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              8 min read
            </span>
            <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-md border border-red-500/30">
              Hard Difficulty
            </span>
            <span className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              Success Rate: ~40% (untrained) → 95%+ (trained)
            </span>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Table of Contents</h2>
          <nav className="space-y-2">
            <a href="#overview" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">1. Overview</a>
            <a href="#how-it-works" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">2. How Thermite Works</a>
            <a href="#strategies" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">3. Winning Strategies</a>
            <a href="#common-mistakes" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">4. Common Mistakes to Avoid</a>
            <a href="#advanced-tips" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">5. Advanced Pro Tips</a>
            <a href="#practice" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">6. Practice Routine</a>
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
              The Thermite hack is one of the most challenging memory-based puzzles in NoPixel 4.0. It tests your ability to memorize and recreate complex sequences of highlighted tiles under intense time pressure. Originally designed to simulate disabling laser security systems during bank heists, this minigame has become a staple test of criminal skill in the NoPixel universe.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              Success requires exceptional pattern recognition, spatial memory, and the ability to stay calm under pressure. Even experienced players can struggle with higher difficulty levels, making practice absolutely essential before attempting real heists in-game.
            </p>
            <div className="bg-[#0F1B21] rounded-lg p-4 mt-4">
              <h4 className="text-white font-semibold mb-2">When You&apos;ll Encounter Thermite:</h4>
              <ul className="text-gray-400 space-y-1 text-sm">
                <li>• Bank heist laser security systems</li>
                <li>• High-security vault breaches</li>
                <li>• Special event heists requiring precision</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-[#54FFA4] text-[#0F1B21] rounded-lg flex items-center justify-center font-bold">2</span>
            How Thermite Works
          </h2>
          <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">The Mechanics</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  The Thermite minigame presents you with a grid of tiles. Tiles will light up one by one in a specific sequence. Your goal is to watch carefully, memorize the exact order, and then recreate the pattern by clicking tiles in the exact same sequence.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#0F1B21] rounded-lg p-4">
                  <h4 className="text-[#54FFA4] font-semibold mb-2">Pattern Display Phase</h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Pattern shown for ~3 seconds</li>
                    <li>• Usually 5-8 squares highlighted</li>
                    <li>• Pattern is random each time</li>
                    <li>• Squares glow bright green/white</li>
                  </ul>
                </div>
                <div className="bg-[#0F1B21] rounded-lg p-4">
                  <h4 className="text-[#54FFA4] font-semibold mb-2">Input Phase</h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Click the memorized squares</li>
                    <li>• Order doesn&apos;t matter</li>
                    <li>• Wrong click = instant fail</li>
                    <li>• Must complete before timer ends</li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-yellow-400 font-semibold mb-1">Critical Understanding</h4>
                    <p className="text-gray-300 text-sm">
                      One wrong click fails the entire hack. There&apos;s no partial credit. This is why accuracy is more important than speed—take your time within the limit rather than rushing and misclicking.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Strategies Section */}
        <section id="strategies" className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-[#54FFA4] text-[#0F1B21] rounded-lg flex items-center justify-center font-bold">3</span>
            Winning Strategies
          </h2>
          <div className="space-y-6">
            <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#54FFA4]" />
                Strategy 1: The Shape Method
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Instead of trying to memorize individual squares, look at the overall shape the highlighted squares create. Your brain is naturally better at recognizing shapes than remembering coordinates.
              </p>
              <div className="bg-[#0F1B21] rounded-lg p-4">
                <p className="text-gray-400 text-sm">
                  <strong className="text-white">Example:</strong> If the pattern looks like an &quot;L&quot; shape or a diagonal line, remember &quot;L in top-right&quot; or &quot;diagonal from corner.&quot; This single mental note replaces memorizing 5-6 individual positions.
                </p>
              </div>
            </div>

            <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-[#54FFA4]" />
                Strategy 2: Quadrant Division
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Mentally divide the 5x5 grid into four quadrants. Count how many squares are in each quadrant during the display phase. This breaks the problem into smaller, manageable pieces.
              </p>
              <div className="grid grid-cols-2 gap-2 max-w-xs mb-4">
                <div className="bg-[#0F1B21] rounded p-3 text-center">
                  <span className="text-[#54FFA4] font-bold">Top-Left</span>
                  <p className="text-gray-400 text-xs">2 squares</p>
                </div>
                <div className="bg-[#0F1B21] rounded p-3 text-center">
                  <span className="text-[#54FFA4] font-bold">Top-Right</span>
                  <p className="text-gray-400 text-xs">1 square</p>
                </div>
                <div className="bg-[#0F1B21] rounded p-3 text-center">
                  <span className="text-[#54FFA4] font-bold">Bot-Left</span>
                  <p className="text-gray-400 text-xs">0 squares</p>
                </div>
                <div className="bg-[#0F1B21] rounded p-3 text-center">
                  <span className="text-[#54FFA4] font-bold">Bot-Right</span>
                  <p className="text-gray-400 text-xs">3 squares</p>
                </div>
              </div>
            </div>

            <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#54FFA4]" />
                Strategy 3: Row-by-Row Scanning
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Scan the grid systematically from top to bottom during the display phase. Verbally note (in your head) &quot;Row 1: positions 2, 4. Row 2: position 3...&quot; This creates a checklist you can follow during input.
              </p>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300 text-sm">
                    <strong className="text-green-400">Pro Tip:</strong> Most players find combining the Shape Method with Row Scanning works best. Use shape for the general pattern, then row-scan to catch any squares you might have missed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Common Mistakes Section */}
        <section id="common-mistakes" className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-[#54FFA4] text-[#0F1B21] rounded-lg flex items-center justify-center font-bold">4</span>
            Common Mistakes to Avoid
          </h2>
          <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Clicking Too Fast</h4>
                  <p className="text-gray-300 text-sm">
                    Rushing leads to misclicks. The timer is usually generous enough—take an extra half-second to aim each click accurately.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Looking Away During Display</h4>
                  <p className="text-gray-300 text-sm">
                    Never glance at the timer or your keyboard during the pattern display. Every millisecond of viewing time is crucial for memory.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Panicking Mid-Hack</h4>
                  <p className="text-gray-300 text-sm">
                    If you lose track of the pattern, stop and think rather than guessing. A wrong click fails instantly, but taking time to recall might save you.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Not Practicing Different Patterns</h4>
                  <p className="text-gray-300 text-sm">
                    Some players only practice until they pass once. Real improvement comes from handling hundreds of different random patterns.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Advanced Tips Section */}
        <section id="advanced-tips" className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-[#54FFA4] text-[#0F1B21] rounded-lg flex items-center justify-center font-bold">5</span>
            Advanced Pro Tips
          </h2>
          <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Use a Larger Monitor</h4>
                  <p className="text-gray-400 text-sm">Bigger screen = easier to see the full grid at once without eye movement.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Adjust Display Brightness</h4>
                  <p className="text-gray-400 text-sm">Higher contrast makes the highlighted squares more distinct and memorable.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Practice at Higher Difficulty</h4>
                  <p className="text-gray-400 text-sm">Training with more squares makes the real hack feel easier by comparison.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Take Breaks</h4>
                  <p className="text-gray-400 text-sm">Mental fatigue kills accuracy. Practice in 15-20 minute sessions with breaks.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Verbalize the Pattern</h4>
                  <p className="text-gray-400 text-sm">Saying positions out loud (even quietly) engages more memory pathways.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Warm Up Before Heists</h4>
                  <p className="text-gray-400 text-sm">Do 5-10 practice rounds before any real heist to get in the zone.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Practice Section */}
        <section id="practice" className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-[#54FFA4] text-[#0F1B21] rounded-lg flex items-center justify-center font-bold">6</span>
            Recommended Practice Routine
          </h2>
          <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Daily Practice Schedule</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 p-3 bg-[#0F1B21] rounded-lg">
                    <span className="text-2xl font-bold text-[#54FFA4]">5</span>
                    <div>
                      <p className="text-white font-medium">Warm-up rounds</p>
                      <p className="text-gray-400 text-sm">Easy settings, focus on accuracy</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-[#0F1B21] rounded-lg">
                    <span className="text-2xl font-bold text-[#54FFA4]">10</span>
                    <div>
                      <p className="text-white font-medium">Standard difficulty rounds</p>
                      <p className="text-gray-400 text-sm">Match real heist conditions</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-[#0F1B21] rounded-lg">
                    <span className="text-2xl font-bold text-[#54FFA4]">5</span>
                    <div>
                      <p className="text-white font-medium">Hard mode rounds</p>
                      <p className="text-gray-400 text-sm">Push your limits</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#54FFA4]/10 border border-[#54FFA4]/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Trophy className="w-5 h-5 text-[#54FFA4] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-[#54FFA4] font-semibold mb-1">Success Benchmark</h4>
                    <p className="text-gray-300 text-sm">
                      Aim for 8/10 successful completions on standard difficulty before attempting real heists. Top players achieve 95%+ success rates through consistent practice.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-2 border-orange-500/30 rounded-xl p-8 text-center">
          <Icon path={mdiFuse} className="w-12 h-12 text-orange-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Master Thermite?</h2>
          <p className="text-gray-300 mb-6 max-w-lg mx-auto">
            Apply these strategies with unlimited free practice. Start with easy mode and work your way up to expert level.
          </p>
          <Link
            href="/puzzles/thermite"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-bold hover:from-orange-600 hover:to-red-600 transition-all hover:scale-105"
          >
            <Icon path={mdiFuse} className="w-5 h-5" />
            Practice Thermite Now
          </Link>
        </div>
      </div>
    </div>
  );
}
