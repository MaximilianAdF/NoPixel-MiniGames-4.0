import { ArrowLeft, Clock, Target, AlertTriangle, CheckCircle, Lightbulb, Blocks, Zap, Brain, Trophy, Timer, MousePointerClick } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import JsonLd from '@/app/components/JsonLd';
import { breadcrumbList, guideArticle } from '@/lib/structuredData';

export const metadata: Metadata = {
  title: 'Roof Running Guide - Master NoPixel 4.0 Tile Clearing Puzzle | Expert Tips',
  description: 'Complete guide to mastering the Roof Running minigame in NoPixel 4.0. Learn tile group clearing, gravity mechanics, and strategic color matching techniques.',
  keywords: ['roof running guide', 'NoPixel roof running', 'tile clearing tutorial', 'color matching tips', 'GTA RP puzzle hack'],
  alternates: {
    canonical: 'https://nphacks.net/guides/roof-running',
  },
  openGraph: {
    title: 'Roof Running Guide - Master NoPixel 4.0 Tile Clearing Puzzle | Expert Tips',
    description: 'Complete guide to mastering the Roof Running minigame in NoPixel 4.0. Learn tile group clearing, gravity mechanics, and strategic color matching techniques.',
    url: 'https://nphacks.net/guides/roof-running',
  },
};

export default function RoofRunningGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1B21] via-[#1a2930] to-[#0F1B21] p-4 md:p-8">
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', path: '/' },
          { name: 'Guides', path: '/guides' },
          { name: 'Roof Running Guide', path: '/guides/roof-running' },
        ])}
      />
      <JsonLd
        data={guideArticle({
          headline: 'Roof Running Guide - Master NoPixel 4.0 Tile Clearing Puzzle | Expert Tips',
          description: 'Complete guide to mastering the Roof Running minigame in NoPixel 4.0. Learn tile group clearing, gravity mechanics, and strategic color matching techniques.',
          path: '/guides/roof-running',
        })}
      />
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
              <p className="text-[#54FFA4] text-lg">Same Game Tile-Clearing Puzzle</p>
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
              Objective: Clear every block before time runs out
            </span>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Table of Contents</h2>
          <nav className="space-y-2">
            <a href="#overview" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">1. Overview</a>
            <a href="#how-it-works" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">2. How Roof Running Works</a>
            <a href="#controls" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">3. The Controls</a>
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
              Roof Running is NoPixel 4.0&apos;s rooftop minigame, triggered when you rob AC-units in GTA RP. Despite the name, it isn&apos;t a parkour or reaction challenge at all — it&apos;s a <strong className="text-white">&quot;Same Game&quot; tile-clearing puzzle</strong>. The board fills with colored blocks and you clear them by clicking connected groups, racing to empty the entire grid before the timer runs out.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              This is a pure planning puzzle, not a test of reflexes. Every clear reshapes the board as blocks collapse downward and columns slide together, so a single careless move can strand a lone block and make the board impossible to finish. When that happens the game ends instantly — so it pays to think before you click.
            </p>
            <div className="bg-[#0F1B21] rounded-lg p-4 mt-4">
              <h4 className="text-white font-semibold mb-2">When You&apos;ll Encounter Roof Running:</h4>
              <ul className="text-gray-400 space-y-1 text-sm">
                <li>• Robbing rooftop AC-units in NoPixel 4.0 GTA RP</li>
                <li>• Practice mode here, on randomly generated boards</li>
                <li>• The daily challenge, on a fixed board for everyone</li>
                <li>• Head-to-head 1v1 matches against another player</li>
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
                  You start with a grid of colored blocks in three colors — red, green and blue — placed at random. Click any block that belongs to a group of <strong className="text-white">two or more same-colored blocks connected horizontally or vertically</strong> (diagonals never count), and the entire connected group disappears at once. Clicking a block with no matching neighbour does nothing.
                </p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  After every clear two things happen automatically: <strong className="text-[#54FFA4]">gravity</strong> drops the blocks above straight down to fill the gaps, then any column that became completely empty is removed and the columns to its right <strong className="text-[#54FFA4]">slide left</strong> to close the space. These collapses constantly merge blocks into new, bigger groups, so the board you&apos;re looking at after a clear is rarely the one you started with.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#0F1B21] rounded-lg p-4">
                  <h4 className="text-[#54FFA4] font-semibold mb-2">Game Elements</h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Three block colors: red, green, blue</li>
                    <li>• Default board of 8 rows × 11 columns (88 blocks)</li>
                    <li>• Gravity pulls blocks down after each clear</li>
                    <li>• Empty columns collapse to the left</li>
                  </ul>
                </div>
                <div className="bg-[#0F1B21] rounded-lg p-4">
                  <h4 className="text-[#54FFA4] font-semibold mb-2">Win &amp; Lose Conditions</h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• <span className="text-green-400">Win:</span> clear every block off the board</li>
                    <li>• <span className="text-red-400">Lose:</span> the countdown timer hits zero</li>
                    <li>• <span className="text-red-400">Lose:</span> any color is left as a single block</li>
                    <li>• <span className="text-red-400">Lose:</span> no group of 2+ remains to clear</li>
                  </ul>
                </div>
              </div>

              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Timer className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-orange-400 font-semibold mb-1">Beat the Clock</h4>
                    <p className="text-gray-300 text-sm">
                      Practice runs use a 25-second countdown by default, and the moment it expires the run is a loss. In practice mode you can retune the timer (5–100 seconds) and the board size (5–10 rows, 5–15 columns) from the settings. Note that 1v1 matches drop the clock entirely on a fixed 8×11 board — there, the round is decided by whoever clears first or makes the fatal mistake.
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
            The Controls
          </h2>
          <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">It&apos;s All Mouse</h3>
                <p className="text-gray-300 text-sm mb-4">
                  There is no keyboard input — no arrow keys, no WASD, no timing bar. The whole game is played with a single action: click a block.
                </p>
                <div className="bg-[#0F1B21] rounded-lg p-4 flex flex-col items-center gap-3">
                  <MousePointerClick className="w-10 h-10 text-[#54FFA4]" />
                  <p className="text-gray-300 text-sm text-center max-w-md">
                    Left-click any block that is part of a group of two or more touching, same-colored blocks to clear the whole group. Clicking a block that has no matching neighbour simply does nothing — there is no penalty for a dead click.
                  </p>
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300 text-sm">
                    <strong className="text-green-400">Read before you click:</strong> because a dead click costs nothing, the real skill is in your eyes, not your hands. Scan the board for the largest connected groups and trace how the board will collapse before you commit to a move.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Adjusting the Challenge</h3>
                <p className="text-gray-300 text-sm">
                  In practice mode the settings panel lets you set the number of rows (5–10), columns (5–15) and the timer (5–100 seconds). A smaller board with a longer clock is the gentlest way to learn the collapse behaviour; the default 8×11 grid on a 25-second timer is the standard challenge.
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
                <Blocks className="w-5 h-5 text-[#54FFA4]" />
                Strategy 1: Clear the Biggest Groups First
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Large clears trigger the most movement, and that movement is your friend — when a big group vanishes, the blocks that fall and shift in behind it tend to stack same-colored blocks together into fresh groups. Hitting the biggest available group keeps the board churning and your options open.
              </p>
              <div className="bg-[#0F1B21] rounded-lg p-4">
                <p className="text-gray-400 text-sm">
                  <strong className="text-white">Why it works:</strong> the goal is an empty board, and a single big clear removes more blocks <em>and</em> sets up the next clear at the same time.
                </p>
              </div>
            </div>

            <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#54FFA4]" />
                Strategy 2: Simulate the Collapse
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Before each click, picture what happens after it: blocks above the cleared group drop down, and if a whole column empties, everything to its right slides left. A clear that looks clean can drop two unrelated blocks next to each other and strand a color. Trace the collapse one move ahead and you&apos;ll avoid most dead ends.
              </p>
            </div>

            <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#54FFA4]" />
                Strategy 3: Protect Thinning Colors
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                The instant any one color is reduced to a single block, the board is declared unsolvable and you lose. Keep an eye on whichever color is running low and clear around it so its remaining blocks stay touching — never let a color get down to one stray tile with no partner.
              </p>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300 text-sm">
                    <strong className="text-green-400">Pro Tip:</strong> finish a color in even numbers. If you can pair up the last blocks of a color and clear them together, you&apos;ll never leave the lone block that ends the run.
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
                  <h4 className="text-red-400 font-semibold mb-1">Stranding a Single Block</h4>
                  <p className="text-gray-300 text-sm">
                    The most common loss. Leaving one block of a color with no same-colored neighbour makes the board unsolvable, and the game ends the run on the spot. Always plan how the last few blocks of each color will pair off.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Clicking Without Reading the Collapse</h4>
                  <p className="text-gray-300 text-sm">
                    Clearing the first group you see, without picturing how gravity and the left-shift will rearrange everything, is how solvable boards turn into dead ends. Slow down and look one move ahead.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Ignoring the Timer</h4>
                  <p className="text-gray-300 text-sm">
                    The default 25-second countdown is tight on a full 8×11 board. Spend a moment planning, but don&apos;t freeze — running the clock to zero is just as much a loss as stranding a block.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Breaking Up a Color You&apos;ll Need</h4>
                  <p className="text-gray-300 text-sm">
                    Clearing part of a color too early can split the rest into pieces that can never reconnect. If a color is already scarce, clear it last or keep its blocks bunched together.
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
                  <h4 className="text-white font-semibold mb-1">Weaponise the Left-Shift</h4>
                  <p className="text-gray-400 text-sm">Fully emptying a column slides everything to its right leftward. Use that to push a stray block up against a matching neighbour.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Watch the Bottom Rows</h4>
                  <p className="text-gray-400 text-sm">Clearing low groups drops the most blocks. Low clears reshape the board the hardest, so check them first when planning.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Train on an Easy Board</h4>
                  <p className="text-gray-400 text-sm">Shrink the grid and stretch the timer in settings to learn how collapses behave, then ramp back up to the default 8×11.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Keep the Colors Balanced</h4>
                  <p className="text-gray-400 text-sm">With only three colors, no color should ever fall far behind the others. Clear evenly so none gets isolated down to a single block.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Take Your Time in 1v1</h4>
                  <p className="text-gray-400 text-sm">Matches have no clock, so there&apos;s no rush — but a stranded block still ends your board instantly. Prioritise a fully solvable path over raw speed.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Plan the Endgame Early</h4>
                  <p className="text-gray-400 text-sm">Decide which color you&apos;ll clear last while the board is still full. The final moves are where most boards become unsolvable.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-[#54FFA4]/10 border border-[#54FFA4]/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Trophy className="w-5 h-5 text-[#54FFA4] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[#54FFA4] font-semibold mb-1">Mastery Benchmark</h4>
                  <p className="text-gray-300 text-sm">
                    You&apos;ve mastered Roof Running when you can wipe a default 8×11 board down to zero blocks inside the 25-second timer, consistently, without ever stranding a lone color. At that point the AC-unit job is yours every time.
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
            Train on unlimited random boards. Plan your clears, chain the collapses, and empty the board before the clock runs out.
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
