import { ArrowLeft, Clock, Target, AlertTriangle, CheckCircle, Lightbulb, Zap, Brain, Trophy, RotateCcw, Grid3X3 } from 'lucide-react';
import Icon from '@mdi/react';
import { mdiWashingMachine } from '@mdi/js';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Laundromat Hack Guide - Master NoPixel 4.0 Symbol Matching | Expert Tips',
  description: 'Complete guide to mastering the Laundromat minigame in NoPixel 4.0. Learn symbol pair matching techniques, grid memorization, and pro tips for byte decryption.',
  keywords: ['laundromat hack guide', 'NoPixel laundromat', 'symbol matching tutorial', 'laundromat tips', 'GTA RP mazer hack'],
};

export default function LaundromatGuidePage() {
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
            <div className="p-4 bg-cyan-500/20 rounded-xl">
              <Icon path={mdiWashingMachine} size={2} className="text-cyan-400" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Laundromat Hack Guide
              </h1>
              <p className="text-[#54FFA4] text-lg">Symbol Pair Matching Grid</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              6 min read
            </span>
            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-md border border-yellow-500/30">
              Medium Difficulty
            </span>
            <span className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              Success Rate: ~55% (untrained) → 95%+ (trained)
            </span>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Table of Contents</h2>
          <nav className="space-y-2">
            <a href="#overview" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">1. Overview</a>
            <a href="#how-it-works" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">2. How Laundromat Works</a>
            <a href="#symbol-recognition" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">3. Symbol Recognition</a>
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
              The Laundromat minigame is a symbol-matching puzzle that tests your visual pattern recognition and quick decision-making skills. You&apos;ll be shown a target symbol and must identify matching symbols from a grid before time runs out.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              While the concept sounds simple, the symbols can look remarkably similar, and the time pressure adds significant challenge. Success requires training your eye to quickly spot distinguishing features between symbols that might only differ in small details.
            </p>
            <div className="bg-[#0F1B21] rounded-lg p-4 mt-4">
              <h4 className="text-white font-semibold mb-2">When You&apos;ll Encounter Laundromat:</h4>
              <ul className="text-gray-400 space-y-1 text-sm">
                <li>• Money laundering operations</li>
                <li>• Certain business hacks</li>
                <li>• Pattern-based security systems</li>
                <li>• Some heist secondary objectives</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-[#54FFA4] text-[#0F1B21] rounded-lg flex items-center justify-center font-bold">2</span>
            How Laundromat Works
          </h2>
          <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">The Mechanics</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  A target symbol is displayed prominently (usually at the top or side of the screen). Below it, a grid of symbols appears. Your job is to click on all symbols that exactly match the target. Some versions require you to find a specific number of matches, while others want you to identify all matches in the grid.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#0F1B21] rounded-lg p-4">
                  <h4 className="text-[#54FFA4] font-semibold mb-2">Game Elements</h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Target symbol to match</li>
                    <li>• Grid of 16-36+ symbols</li>
                    <li>• Similar-looking decoys</li>
                    <li>• Time limit per round</li>
                  </ul>
                </div>
                <div className="bg-[#0F1B21] rounded-lg p-4">
                  <h4 className="text-[#54FFA4] font-semibold mb-2">Success Conditions</h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Click all matching symbols</li>
                    <li>• Don&apos;t click non-matching symbols</li>
                    <li>• Complete before timer ends</li>
                    <li>• Multiple rounds may be required</li>
                  </ul>
                </div>
              </div>

              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Grid3X3 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-cyan-400 font-semibold mb-1">Key Challenge</h4>
                    <p className="text-gray-300 text-sm">
                      Symbols are often designed to be confusingly similar. A symbol might be identical except for a slight rotation, an extra line, or a subtle shape difference. Your brain needs to quickly identify these distinguishing features.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Symbol Recognition Section */}
        <section id="symbol-recognition" className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-[#54FFA4] text-[#0F1B21] rounded-lg flex items-center justify-center font-bold">3</span>
            Symbol Recognition Techniques
          </h2>
          <div className="space-y-6">
            <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#54FFA4]" />
                Identify Unique Features
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Before scanning the grid, take 1-2 seconds to identify what makes the target symbol unique. Look for:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#0F1B21] rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Physical Features</h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Number of lines or shapes</li>
                    <li>• Orientation (up, down, rotated)</li>
                    <li>• Open vs closed shapes</li>
                    <li>• Curves vs straight lines</li>
                  </ul>
                </div>
                <div className="bg-[#0F1B21] rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Subtle Details</h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Extra dots or marks</li>
                    <li>• Line thickness</li>
                    <li>• Spacing between elements</li>
                    <li>• Direction of arrows/points</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-[#54FFA4]" />
                Watch for Rotations
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                One of the most common tricks is showing rotated versions of the symbol. A symbol pointing up is NOT the same as one pointing down or sideways. Always check orientation.
              </p>
              <div className="flex items-center justify-center gap-8 py-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#54FFA4] rounded-lg flex items-center justify-center text-[#0F1B21] text-2xl font-bold mb-2">↑</div>
                  <span className="text-green-400 text-xs">Match</span>
                </div>
                <span className="text-gray-500">≠</span>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold mb-2">→</div>
                  <span className="text-red-400 text-xs">No Match</span>
                </div>
                <span className="text-gray-500">≠</span>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold mb-2">↓</div>
                  <span className="text-red-400 text-xs">No Match</span>
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
                <Target className="w-5 h-5 text-[#54FFA4]" />
                Strategy 1: Systematic Scanning
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Don&apos;t randomly search the grid. Scan systematically from top-left to bottom-right, like reading a book. This ensures you check every symbol and don&apos;t miss matches hidden in corners.
              </p>
              <div className="bg-[#0F1B21] rounded-lg p-4">
                <p className="text-gray-400 text-sm">
                  <strong className="text-white">Pro Tip:</strong> Move your eyes in rows: check positions 1-2-3-4, then 5-6-7-8, and so on. Don&apos;t jump around or you&apos;ll lose track.
                </p>
              </div>
            </div>

            <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#54FFA4]" />
                Strategy 2: The &quot;One Feature&quot; Method
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Pick one distinctive feature of the target symbol and use it as your primary filter. Scan the grid looking ONLY for that feature. This is faster than comparing entire symbols.
              </p>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300 text-sm">
                    <strong className="text-green-400">Example:</strong> If your target symbol has a dot in the center, quickly scan for all symbols with center dots. Then verify those candidates match the rest of the pattern.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#54FFA4]" />
                Strategy 3: Elimination
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Sometimes it&apos;s faster to identify what&apos;s NOT a match. If you can quickly eliminate symbols that are clearly different (wrong color, wrong shape family), you narrow down candidates faster.
              </p>
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
                  <h4 className="text-red-400 font-semibold mb-1">Rushing Through the Grid</h4>
                  <p className="text-gray-300 text-sm">
                    Speed is important, but clicking wrong symbols often fails the entire round. A deliberate pace with accurate clicks beats frantic clicking every time.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Not Studying the Target First</h4>
                  <p className="text-gray-300 text-sm">
                    Jumping straight into scanning without understanding the target leads to wasted time and errors. Take 1-2 seconds to memorize key features first.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Ignoring Rotational Differences</h4>
                  <p className="text-gray-300 text-sm">
                    The most common error. A rotated symbol might look &quot;close enough&quot; but it&apos;s a trap. Always verify orientation matches exactly.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Skipping Parts of the Grid</h4>
                  <p className="text-gray-300 text-sm">
                    Random scanning leads to missed matches in corners or edges. Always use a systematic approach to cover the entire grid.
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
                  <h4 className="text-white font-semibold mb-1">Use Peripheral Vision</h4>
                  <p className="text-gray-400 text-sm">Train yourself to see multiple symbols at once rather than focusing on each individually.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Increase Screen Brightness</h4>
                  <p className="text-gray-400 text-sm">Better contrast makes subtle symbol differences more visible and easier to spot.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Practice Pattern Games</h4>
                  <p className="text-gray-400 text-sm">Play &quot;spot the difference&quot; puzzles daily. They train the same visual recognition skills.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Know Common Symbol Sets</h4>
                  <p className="text-gray-400 text-sm">Most minigames use the same symbol libraries. Learn which symbols commonly appear together.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Reduce Eye Strain</h4>
                  <p className="text-gray-400 text-sm">Take breaks during practice. Tired eyes make more mistakes on detailed visual tasks.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Develop Symbol Vocabulary</h4>
                  <p className="text-gray-400 text-sm">Give symbols names (&quot;the fish,&quot; &quot;the star&quot;). Naming helps recognition speed.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-[#54FFA4]/10 border border-[#54FFA4]/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Trophy className="w-5 h-5 text-[#54FFA4] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[#54FFA4] font-semibold mb-1">Mastery Benchmark</h4>
                  <p className="text-gray-300 text-sm">
                    You&apos;ve mastered the Laundromat hack when you can consistently clear grids without ever clicking a wrong symbol. At that point, speed naturally improves because you&apos;re not second-guessing yourself.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/30 rounded-xl p-8 text-center">
          <Icon path={mdiWashingMachine} size={1.5} className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Master the Laundromat?</h2>
          <p className="text-gray-300 mb-6 max-w-lg mx-auto">
            Train your pattern recognition with unlimited practice. Start recognizing symbols instantly and never fail another laundering job.
          </p>
          <Link
            href="/puzzles/laundromat"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-bold hover:from-cyan-600 hover:to-blue-600 transition-all hover:scale-105"
          >
            <Icon path={mdiWashingMachine} size={1.5} className="w-5 h-5" />
            Practice Laundromat Now
          </Link>
        </div>
      </div>
    </div>
  );
}
