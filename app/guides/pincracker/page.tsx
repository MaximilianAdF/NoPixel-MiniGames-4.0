import { ArrowLeft, Clock, Target, AlertTriangle, CheckCircle, Lightbulb, Brain, Trophy, Zap, Fingerprint } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import JsonLd from '@/app/components/JsonLd';
import { breadcrumbList, guideArticle } from '@/lib/structuredData';

export const metadata: Metadata = {
  title: 'PIN Cracker Guide - Master NoPixel 4.0 Logic Puzzle | Expert Tips',
  description: 'Complete guide to mastering the PIN Cracker minigame in NoPixel 4.0. Learn Mastermind-style deduction, color feedback interpretation, and pro tips for cracking codes.',
  keywords: ['PIN cracker guide', 'NoPixel PIN hack', 'mastermind puzzle tutorial', 'PIN cracker tips', 'GTA RP logic puzzle'],
  alternates: {
    canonical: 'https://nphacks.net/guides/pincracker',
  },
  openGraph: {
    title: 'PIN Cracker Guide - Master NoPixel 4.0 Logic Puzzle | Expert Tips',
    description: 'Complete guide to mastering the PIN Cracker minigame in NoPixel 4.0. Learn Mastermind-style deduction, color feedback interpretation, and pro tips for cracking codes.',
    url: 'https://nphacks.net/guides/pincracker',
  },
};

export default function PincrackerGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1B21] via-[#1a2930] to-[#0F1B21] p-4 md:p-8">
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', path: '/' },
          { name: 'Guides', path: '/guides' },
          { name: 'PIN Cracker Guide', path: '/guides/pincracker' },
        ])}
      />
      <JsonLd
        data={guideArticle({
          headline: 'PIN Cracker Guide - Master NoPixel 4.0 Logic Puzzle | Expert Tips',
          description: 'Complete guide to mastering the PIN Cracker minigame in NoPixel 4.0. Learn Mastermind-style deduction, color feedback interpretation, and pro tips for cracking codes.',
          path: '/guides/pincracker',
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
            <div className="p-4 bg-blue-500/20 rounded-xl">
              <Fingerprint className="w-12 h-12 text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                PIN Cracker Guide
              </h1>
              <p className="text-[#54FFA4] text-lg">Mastermind-Style Logic Puzzle</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              7 min read
            </span>
            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-md border border-yellow-500/30">
              Medium Difficulty
            </span>
            <span className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              Pure deduction — beat the clock, not your memory
            </span>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Table of Contents</h2>
          <nav className="space-y-2">
            <a href="#overview" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">1. Overview</a>
            <a href="#how-it-works" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">2. How PIN Cracker Works</a>
            <a href="#feedback" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">3. Reading the Color Feedback</a>
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
              PIN Cracker is a logic-deduction puzzle in the style of the classic board game Mastermind. A secret PIN is hidden behind a row of slots, and your job is to figure it out by guessing and reading the color-coded feedback each guess returns. This is <strong className="text-white">not</strong> a memory test — nothing flashes and disappears. Every guess and every clue stays on screen for you to reason about.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              The catch is the clock. Each round runs against a countdown (20 seconds by default), so you are racing to deduce the full code before time expires. There is no limit on the number of guesses you can make — your only enemy is the timer. Crack the whole PIN before it hits zero and the round is a win; let it run out and you fail.
            </p>
            <div className="bg-[#0F1B21] rounded-lg p-4 mt-4">
              <h4 className="text-white font-semibold mb-2">The single most important fact:</h4>
              <p className="text-gray-400 text-sm">
                The hidden PIN is built from <strong className="text-[#54FFA4]">distinct, non-repeating digits</strong> — the game draws them from a shuffled 0–9 deck, so no digit ever appears twice. That one rule turns the puzzle from guesswork into clean elimination.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-[#54FFA4] text-[#0F1B21] rounded-lg flex items-center justify-center font-bold">2</span>
            How PIN Cracker Works
          </h2>
          <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">The Mechanics</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  You see one row of empty slots — four by default. Type digits to fill the slots left to right, then submit the row as a complete guess. The game instantly scores it, lighting up a colored marker under each slot to tell you how close that digit was. Read the colors, refine your guess, and submit again. Repeat until every slot is green.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#0F1B21] rounded-lg p-4">
                  <h4 className="text-[#54FFA4] font-semibold mb-2">Controls</h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Type digits <strong className="text-white">0–9</strong> on your keyboard to fill slots</li>
                    <li>• <strong className="text-white">Backspace</strong> deletes the last digit</li>
                    <li>• <strong className="text-white">Enter</strong> or the green <strong className="text-white">Crack</strong> button submits a full row</li>
                    <li>• On mobile, tap the puzzle and use your phone&apos;s number keys</li>
                  </ul>
                </div>
                <div className="bg-[#0F1B21] rounded-lg p-4">
                  <h4 className="text-[#54FFA4] font-semibold mb-2">Win &amp; Lose</h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• <strong className="text-green-400">Win:</strong> all slots turn green at once</li>
                    <li>• <strong className="text-red-400">Lose:</strong> the countdown timer hits zero</li>
                    <li>• Unlimited guesses — a wrong guess never ends the round</li>
                    <li>• You must fill every slot before you can submit</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Settings You Can Tune</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  In practice mode the gear menu lets you shape the difficulty. <strong className="text-white">PIN Length</strong> ranges from 2 to 6 digits (default 4), and the <strong className="text-white">Timer</strong> ranges from 5 to 30 seconds (default 20). There is also an <strong className="text-white">Auto Clear</strong> toggle (on by default): when on, a non-winning guess wipes the row so you start the next guess fresh; turn it off to keep your previous digits on screen and edit them with Backspace.
                </p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-blue-400 font-semibold mb-1">Why the Timer Changes Everything</h4>
                    <p className="text-gray-300 text-sm">
                      With only 20 seconds on the default clock, you do not have time for lazy guessing. Each submission also plays a short staggered reveal as the markers light up one slot at a time, so efficient, information-dense guesses are what win rounds — not raw speed-typing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feedback Section */}
        <section id="feedback" className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-[#54FFA4] text-[#0F1B21] rounded-lg flex items-center justify-center font-bold">3</span>
            Reading the Color Feedback
          </h2>
          <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
            <p className="text-gray-300 leading-relaxed mb-6">
              Every slot gets its own marker after you submit — the feedback is <strong className="text-white">per position</strong>, not a single combined score. Each color maps to one of three states:
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-4 p-4 bg-[#0F1B21] rounded-lg">
                <span className="w-6 h-6 rounded bg-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-green-400 font-semibold mb-1">Green — Right digit, right place</h4>
                  <p className="text-gray-400 text-sm">This digit is in the code and sitting in exactly the correct slot. Lock it in and never move it.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-[#0F1B21] rounded-lg">
                <span className="w-6 h-6 rounded bg-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-yellow-400 font-semibold mb-1">Yellow — Right digit, wrong place</h4>
                  <p className="text-gray-400 text-sm">This digit belongs in the PIN but not in the slot you put it. Keep it in play and try it elsewhere.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-[#0F1B21] rounded-lg">
                <span className="w-6 h-6 rounded bg-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Red — Not in the code</h4>
                  <p className="text-gray-400 text-sm">This digit is absent from the PIN entirely. Cross it off and never guess it again.</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Brain className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-300 text-sm">
                  <strong className="text-purple-400">Remember the no-repeat rule:</strong> because every digit in the PIN is unique, a single green or yellow tells you that digit is used exactly once. A red eliminates that digit from <em>all</em> remaining slots at once.
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
          <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">A Reliable Four-Guess Plan (4-digit code)</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  The fastest crackers treat every guess as an experiment that buys information. Here is a clean order of operations:
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-4 p-4 bg-[#0F1B21] rounded-lg">
                  <span className="w-8 h-8 bg-[#54FFA4] text-[#0F1B21] rounded-lg flex items-center justify-center font-bold flex-shrink-0">1</span>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Open with distinct digits</h4>
                    <p className="text-gray-400 text-sm">Lead with something like <span className="font-mono text-[#54FFA4]">0123</span>, then <span className="font-mono text-[#54FFA4]">4567</span>. Across two guesses you can test eight different digits and immediately learn which ones live in the code.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-[#0F1B21] rounded-lg">
                  <span className="w-8 h-8 bg-[#54FFA4] text-[#0F1B21] rounded-lg flex items-center justify-center font-bold flex-shrink-0">2</span>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Eliminate every red</h4>
                    <p className="text-gray-400 text-sm">Any digit that comes back red is gone for good. With unique digits, ruling out four reds can collapse the search space dramatically in a single guess.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-[#0F1B21] rounded-lg">
                  <span className="w-8 h-8 bg-[#54FFA4] text-[#0F1B21] rounded-lg flex items-center justify-center font-bold flex-shrink-0">3</span>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Lock greens, shuffle yellows</h4>
                    <p className="text-gray-400 text-sm">Keep green digits frozen in their slots. For yellows you already know the digit is correct — you just need to find its real position, so rotate it into untested slots.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-[#0F1B21] rounded-lg">
                  <span className="w-8 h-8 bg-[#54FFA4] text-[#0F1B21] rounded-lg flex items-center justify-center font-bold flex-shrink-0">4</span>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Close it out</h4>
                    <p className="text-gray-400 text-sm">Once you know which digits are in the code and have placed the greens, only a small number of orderings remain. Submit the arrangement the clues point to and watch the whole row go green.</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#0F1B21] rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Worked example (secret code 4 7 1 9):</h4>
                <ul className="text-gray-400 text-sm space-y-1 font-mono">
                  <li>Guess <span className="text-white">0 1 2 3</span> → 1 yellow, rest red <span className="font-sans text-gray-500">(1 is in; 0, 2, 3 are out)</span></li>
                  <li>Guess <span className="text-white">4 5 6 7</span> → 4 yellow, 7 yellow, 5/6 red <span className="font-sans text-gray-500">(4 and 7 are in)</span></li>
                  <li>Guess <span className="text-white">4 7 1 8</span> → 4, 7, 1 green, 8 red <span className="font-sans text-gray-500">(last slot must be 9)</span></li>
                  <li>Guess <span className="text-white">4 7 1 9</span> → all green. Cracked.</li>
                </ul>
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300 text-sm">
                    <strong className="text-green-400">Pro Tip:</strong> Turn Auto Clear off when you want to nudge a single digit. Keeping the previous row on screen lets you Backspace one slot and re-submit instead of retyping the whole code — a real time-saver against the clock.
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
                  <h4 className="text-red-400 font-semibold mb-1">Re-using red digits</h4>
                  <p className="text-gray-300 text-sm">
                    A red marker is a hard elimination. Putting that digit back into a later guess wastes a slot that could be gathering new information.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Ignoring yellow clues</h4>
                  <p className="text-gray-300 text-sm">
                    A yellow digit is confirmed to be in the code — it just needs a different slot. Dropping it from your next guess throws away progress.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Moving green digits</h4>
                  <p className="text-gray-300 text-sm">
                    Once a slot is green, that position is solved. Shuffling it around in the next guess only sets you backwards.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Forgetting digits cannot repeat</h4>
                  <p className="text-gray-300 text-sm">
                    The PIN never repeats a digit, so guesses like <span className="font-mono">1 1 2 2</span> waste slots. Always fill every position with a different number.
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
                  <h4 className="text-white font-semibold mb-1">Type with the keyboard</h4>
                  <p className="text-gray-400 text-sm">Number keys plus Enter are far faster than reaching for the Crack button. Every second saved is another guess you can afford.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Cover all ten digits early</h4>
                  <p className="text-gray-400 text-sm">Two opening guesses of eight distinct digits leave only two untested. You can often deduce the full membership of the code before guess three.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Practice at shorter lengths first</h4>
                  <p className="text-gray-400 text-sm">Drop PIN Length to 2 or 3 in settings to drill the green/yellow/red logic, then scale up to 5 and 6 once it&apos;s second nature.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Loosen the timer to learn</h4>
                  <p className="text-gray-400 text-sm">Push the Timer toward 30 seconds while training your deduction, then tighten it back down to sharpen your speed under pressure.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Count your information, not your luck</h4>
                  <p className="text-gray-400 text-sm">A good guess that returns all reds is still a win — it eliminated four digits. Judge guesses by what they rule out, not whether they hit.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Practice mode loops for free</h4>
                  <p className="text-gray-400 text-sm">Win or lose, practice rounds restart automatically after a few seconds — so you can grind back-to-back codes with no menus in the way.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-[#54FFA4]/10 border border-[#54FFA4]/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Trophy className="w-5 h-5 text-[#54FFA4] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[#54FFA4] font-semibold mb-1">Mastery Benchmark</h4>
                  <p className="text-gray-300 text-sm">
                    You&apos;ve mastered PIN Cracker when you can reliably crack a 4-digit code in three or four guesses inside the 20-second clock — and step up to 6-digit codes without breaking your elimination routine.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-500/30 rounded-xl p-8 text-center">
          <Fingerprint className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Crack Some PINs?</h2>
          <p className="text-gray-300 mb-6 max-w-lg mx-auto">
            Put the deduction loop into practice. Start with shorter codes and a relaxed timer, then tighten the clock as your elimination gets sharper.
          </p>
          <Link
            href="/puzzles/pincracker"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold hover:from-purple-600 hover:to-pink-600 transition-all hover:scale-105"
          >
            <Fingerprint className="w-5 h-5" />
            Practice PIN Cracker Now
          </Link>
        </div>
      </div>
    </div>
  );
}
