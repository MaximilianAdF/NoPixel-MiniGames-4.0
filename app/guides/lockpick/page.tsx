import { ArrowLeft, Clock, Target, AlertTriangle, CheckCircle, Lightbulb, Brain, Trophy, Key, RotateCcw, RotateCw, Palette, Unlock } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import JsonLd from '@/app/components/JsonLd';
import { breadcrumbList, guideArticle } from '@/lib/structuredData';

export const metadata: Metadata = {
  title: 'Lockpick Guide - Master NoPixel 4.0 Rotating-Ring Lock | Pro Tips',
  description: 'Complete guide to the NoPixel 4.0 lockpick minigame. Learn how to rotate each ring so its coloured pins line up with matching slots, then unlock before the timer ends.',
  keywords: ['lockpick guide', 'NoPixel lockpick', 'NoPixel 4.0 lockpick', 'GTA RP lockpick', 'rotating lock puzzle', 'lockpick minigame tutorial'],
  alternates: {
    canonical: 'https://nphacks.net/guides/lockpick',
  },
  openGraph: {
    title: 'Lockpick Guide - Master NoPixel 4.0 Rotating-Ring Lock | Pro Tips',
    description: 'Complete guide to the NoPixel 4.0 lockpick minigame. Rotate each ring so its coloured pins line up with matching slots, then unlock before the timer ends.',
    url: 'https://nphacks.net/guides/lockpick',
  },
};

export default function LockpickGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1B21] via-[#1a2930] to-[#0F1B21] p-4 md:p-8">
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', path: '/' },
          { name: 'Guides', path: '/guides' },
          { name: 'Lockpick Guide', path: '/guides/lockpick' },
        ])}
      />
      <JsonLd
        data={guideArticle({
          headline: 'Lockpick Guide - Master NoPixel 4.0 Rotating-Ring Lock | Pro Tips',
          description: 'Complete guide to the NoPixel 4.0 lockpick minigame. Rotate each ring so its coloured pins line up with matching slots, then unlock before the timer ends.',
          path: '/guides/lockpick',
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
            <div className="p-4 bg-yellow-500/20 rounded-xl">
              <Key className="w-12 h-12 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Lockpick Guide
              </h1>
              <p className="text-[#54FFA4] text-lg">Rotating-Ring Colour Match</p>
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
              4 rings to clear · 20-second timer
            </span>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Table of Contents</h2>
          <nav className="space-y-2">
            <a href="#overview" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">1. Overview</a>
            <a href="#how-it-works" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">2. How the Lock Works</a>
            <a href="#controls" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">3. Controls &amp; Objective</a>
            <a href="#strategy" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">4. Solving Strategy</a>
            <a href="#common-mistakes" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">5. Common Mistakes</a>
            <a href="#advanced-tips" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">6. Advanced Tips</a>
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
              The Lockpick minigame in NoPixel 4.0 is a rotating-ring puzzle, not a timing test. You face a set of concentric rings, each carrying coloured pins and coloured target slots. Your job is to spin each ring so its pins line up with slots of the same colour, then confirm the unlock.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              It is deliberate rather than reflex-based: there is no sweeping marker to catch. Instead you read the colours, rotate to the correct alignment, and commit. The pressure comes from a shared countdown and from the fact that a single wrong unlock instantly bends the pick and ends the attempt.
            </p>
            <div className="bg-[#0F1B21] rounded-lg p-4 mt-4">
              <h4 className="text-white font-semibold mb-2">What you&apos;re looking at:</h4>
              <ul className="text-gray-400 space-y-1 text-sm">
                <li>• 4 concentric rings by default (adjustable from 2 to 10 in Settings)</li>
                <li>• Coloured pins on each ring — red, yellow, and blue</li>
                <li>• Coloured target slots on the outer edge of each ring</li>
                <li>• A 20-second countdown for the whole lock (adjustable from 5 to 100)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-[#54FFA4] text-[#0F1B21] rounded-lg flex items-center justify-center font-bold">2</span>
            How the Lock Works
          </h2>
          <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">The Mechanics</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Each ring is a circle of 12 evenly spaced positions (one every 30°). Scattered around it are coloured pins (the filled dots) and coloured slots (the arc markers on the outer track). When you rotate a ring, its pins move with it while the slots stay put. A slot is satisfied when either no pin sits under it, or the pin under it is the same colour. Once every slot on the active ring is satisfied, pressing Unlock clears that ring and moves you to the next one.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#0F1B21] rounded-lg p-4">
                  <h4 className="text-[#54FFA4] font-semibold mb-2">Lock Components</h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• 4 rings by default, solved one at a time</li>
                    <li>• Only the innermost unsolved ring rotates</li>
                    <li>• Coloured pins (red / yellow / blue) that turn with the ring</li>
                    <li>• Fixed coloured slots you have to match against</li>
                  </ul>
                </div>
                <div className="bg-[#0F1B21] rounded-lg p-4">
                  <h4 className="text-[#54FFA4] font-semibold mb-2">Success Conditions</h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Every slot empty or matched to a same-colour pin</li>
                    <li>• Press Unlock to confirm and advance</li>
                    <li>• Clear all rings before the timer expires</li>
                    <li>• Never unlock with a mismatched pin under a slot</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Palette className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-blue-400 font-semibold mb-1">Key Insight</h4>
                    <p className="text-gray-300 text-sm">
                      A slot with no pin under it is already fine — you only have to worry about slots that a pin will land beneath. Find the rotation where every occupied slot shows a colour match, then commit.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Controls & Objective Section */}
        <section id="controls" className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-[#54FFA4] text-[#0F1B21] rounded-lg flex items-center justify-center font-bold">3</span>
            Controls &amp; Objective
          </h2>
          <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-[#0F1B21] rounded-lg p-4 text-center">
                  <RotateCcw className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <p className="text-white font-bold mb-1">Rotate Left</p>
                  <p className="text-gray-400 text-sm">Left Arrow or A — spins the active ring one step counter-clockwise</p>
                </div>
                <div className="bg-[#0F1B21] rounded-lg p-4 text-center">
                  <RotateCw className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <p className="text-white font-bold mb-1">Rotate Right</p>
                  <p className="text-gray-400 text-sm">Right Arrow or D — spins the active ring one step clockwise</p>
                </div>
                <div className="bg-[#0F1B21] rounded-lg p-4 text-center">
                  <Unlock className="w-6 h-6 text-[#54FFA4] mx-auto mb-2" />
                  <p className="text-white font-bold mb-1">Unlock</p>
                  <p className="text-gray-400 text-sm">Space or Enter — confirms the current ring&apos;s alignment</p>
                </div>
              </div>

              <div className="bg-[#0F1B21] rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">The Objective</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Work from the innermost ring outward. Rotate the active ring step by step until every slot on it is either empty or covered by a same-colour pin, then press Unlock. A correct unlock clears the ring and the next one becomes active. Clear all of them before the countdown hits zero and the lock pops. On-screen buttons mirror the keys: two purple rotate buttons and one green Unlock button.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-green-400 font-semibold mb-1">You Win When</h4>
                      <p className="text-gray-300 text-sm">All rings are cleared with valid unlocks before time runs out. Each cleared ring lights up green.</p>
                    </div>
                  </div>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-red-400 font-semibold mb-1">You Lose When</h4>
                      <p className="text-gray-300 text-sm">You unlock with a mismatched pin under any slot (the pick bends instantly), or the timer expires.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Strategy Section */}
        <section id="strategy" className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-[#54FFA4] text-[#0F1B21] rounded-lg flex items-center justify-center font-bold">4</span>
            Solving Strategy
          </h2>
          <div className="space-y-6">
            <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5 text-[#54FFA4]" />
                Strategy 1: Read the Colours First
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Before touching a rotate button, scan the active ring. Note each slot&apos;s colour and which pins are nearby. Because there are only three colours — red, yellow, and blue — you can usually spot at a glance which pin needs to sit under which slot.
              </p>
              <div className="bg-[#0F1B21] rounded-lg p-4">
                <p className="text-gray-400 text-sm">
                  <strong className="text-white">Remember:</strong> empty slots cost you nothing. Focus only on the slots that a pin will pass beneath as you rotate, and make sure those land on matching colours.
                </p>
              </div>
            </div>

            <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <RotateCw className="w-5 h-5 text-[#54FFA4]" />
                Strategy 2: Rotate the Short Way
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Each ring has 12 positions, so any target is at most six steps away. Count the gap and rotate in whichever direction gets you there in fewer presses. Step one position at a time and watch the colours line up rather than over-spinning past the answer.
              </p>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300 text-sm">
                    <strong className="text-green-400">Pro Tip:</strong> only the active (innermost unsolved) ring moves, so you never have to worry about disturbing a ring you have already cleared.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#54FFA4]" />
                Strategy 3: Verify Before You Commit
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                The unlock is unforgiving: a single mismatched pin under any slot ends the whole run. Do a final colour check across every occupied slot before you press Unlock. Spending an extra second confirming beats restarting from scratch.
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
                  <h4 className="text-red-400 font-semibold mb-1">Unlocking Too Soon</h4>
                  <p className="text-gray-300 text-sm">
                    Confirming before every occupied slot is colour-matched bends the pick instantly and fails the run. Unlock is a commit, not a guess.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Treating It Like a Timing Game</h4>
                  <p className="text-gray-300 text-sm">
                    There is no sweeping marker or sweet spot to catch. Tapping Unlock on reflex achieves nothing — this is a colour-alignment puzzle you solve by rotating.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Forgetting Which Ring Is Active</h4>
                  <p className="text-gray-300 text-sm">
                    Rotation only affects the current ring. Trying to read the outer rings while solving the inner one wastes time — handle them in order, inside to outside.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Letting the Clock Run Out</h4>
                  <p className="text-gray-300 text-sm">
                    The default 20 seconds covers all rings, not each one. Over-deliberating on an early ring can leave you no time for the last. Keep a steady pace.
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
            Advanced Tips
          </h2>
          <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Use the Keyboard</h4>
                  <p className="text-gray-400 text-sm">A/D or the arrow keys rotate, Space or Enter unlocks. Keys are faster and more precise than clicking the buttons.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Tune the Settings</h4>
                  <p className="text-gray-400 text-sm">Start with fewer rings or a longer timer, then crank rings up to 10 and the clock down to build real speed.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Count, Don&apos;t Spin</h4>
                  <p className="text-gray-400 text-sm">Work out how many of the 12 steps you need and tap exactly that many. Spamming rotate overshoots and burns the clock.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Practice Loops Free</h4>
                  <p className="text-gray-400 text-sm">In practice mode the lock resets a few seconds after each result, so you can drill back-to-back attempts with no setup.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Trust the Green</h4>
                  <p className="text-gray-400 text-sm">Cleared rings turn green so you can ignore them entirely and keep your eyes on the one that still moves.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Mind Sparse Rings</h4>
                  <p className="text-gray-400 text-sm">If a ring has many empty slots, a valid alignment is often only one or two steps away — don&apos;t over-rotate looking for a perfect-looking pattern.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-[#54FFA4]/10 border border-[#54FFA4]/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Trophy className="w-5 h-5 text-[#54FFA4] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[#54FFA4] font-semibold mb-1">Mastery Indicator</h4>
                  <p className="text-gray-300 text-sm">
                    You&apos;ve mastered the lockpick when you can read each ring at a glance, rotate straight to the match, and clear all four rings well inside the 20-second timer without a single misfired unlock.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-2 border-blue-500/30 rounded-xl p-8 text-center">
          <Key className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Crack the Lock?</h2>
          <p className="text-gray-300 mb-6 max-w-lg mx-auto">
            Put these strategies into practice with unlimited free attempts. Read the colours, rotate to the match, and unlock every ring before the clock runs out.
          </p>
          <Link
            href="/puzzles/lockpick"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-bold hover:from-blue-600 hover:to-cyan-600 transition-all hover:scale-105"
          >
            <Key className="w-5 h-5" />
            Practice Lockpick Now
          </Link>
        </div>
      </div>
    </div>
  );
}
