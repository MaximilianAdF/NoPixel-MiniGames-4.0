import { ArrowLeft, Clock, Target, AlertTriangle, CheckCircle, Lightbulb, RotateCcw, RotateCw, Palette, Trophy } from 'lucide-react';
import Icon from '@mdi/react';
import { mdiWashingMachine } from '@mdi/js';
import Link from 'next/link';
import type { Metadata } from 'next';
import JsonLd from '@/app/components/JsonLd';
import { breadcrumbList, guideArticle } from '@/lib/structuredData';

export const metadata: Metadata = {
  title: 'Laundromat Hack Guide - Crack the NoPixel 4.0 Rotating-Lock Safe | Tips',
  description: 'Complete guide to the NoPixel 4.0 Laundromat safe minigame — how the rotating colour-match lock works, how to align every gate on all 5 rings, and pro tips to beat the 12-second timer.',
  keywords: ['laundromat hack guide', 'NoPixel laundromat', 'laundromat safe crack', 'laundromat lockpick', 'laundromat colour match', 'GTA RP laundromat hack'],
  alternates: {
    canonical: 'https://nphacks.net/guides/laundromat',
  },
  openGraph: {
    title: 'Laundromat Hack Guide - Crack the NoPixel 4.0 Rotating-Lock Safe | Tips',
    description: 'Master the NoPixel 4.0 Laundromat safe. Learn the colour-match rotating lock, align every gate across all 5 rings, and beat the 12-second timer.',
    url: 'https://nphacks.net/guides/laundromat',
  },
};

export default function LaundromatGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1B21] via-[#1a2930] to-[#0F1B21] p-4 md:p-8">
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', path: '/' },
          { name: 'Guides', path: '/guides' },
          { name: 'Laundromat Hack Guide', path: '/guides/laundromat' },
        ])}
      />
      <JsonLd
        data={guideArticle({
          headline: 'Laundromat Hack Guide - Crack the NoPixel 4.0 Rotating-Lock Safe',
          description: 'Complete guide to the NoPixel 4.0 Laundromat safe minigame — the colour-match rotating lock, aligning every gate across all 5 rings, and pro tips to beat the 12-second timer.',
          path: '/guides/laundromat',
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
            <div className="p-4 bg-cyan-500/20 rounded-xl">
              <Icon path={mdiWashingMachine} size={2} className="text-cyan-400" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Laundromat Hack Guide
              </h1>
              <p className="text-[#54FFA4] text-lg">Colour-Match Rotating Lock</p>
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
            <a href="#aligning" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">3. Aligning the Rings</a>
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
              The Laundromat hack is the rotating-lock safe minigame from NoPixel 4.0 — the one that runs on the safe inside the south-side Laundromat in GTA RP. It is a <strong className="text-white">colour-matching lockpick</strong>: a stack of concentric rings, each studded with coloured pins and coloured gates. You rotate a ring until every gate lines up with a pin of its own colour (or an empty gap), then unlock it — and repeat for all 5 rings before a tight timer runs out.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              This is not a memory game and it is not a reflex &quot;catch the moment&quot; timer — nothing spins on its own. You move the active ring one notch at a time and decide when it is correctly aligned. The pressure comes from a single <strong className="text-white">~12-second</strong> countdown that covers the whole lock.
            </p>
            <div className="bg-[#0F1B21] rounded-lg p-4 mt-4">
              <h4 className="text-white font-semibold mb-2">When You&apos;ll Encounter Laundromat:</h4>
              <ul className="text-gray-400 space-y-1 text-sm">
                <li>• Cracking the safe at the south-side Laundromat</li>
                <li>• Money-laundering jobs in GTA RP</li>
                <li>• Any rotating colour-match lock in the same family</li>
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
                  The lock is a set of <strong className="text-white">concentric rings</strong> — <strong className="text-white">5</strong> by default — solved one at a time from the innermost outward. The active ring carries coloured pins (red, yellow, blue dots) on its track and coloured gates (arc markers) on its outer edge. The <strong className="text-white">Rotate Left</strong> and <strong className="text-white">Rotate Right</strong> controls step the whole active ring one notch — 30° of the 12-position wheel — at a time, sliding the pins under the fixed gates. When the ring looks aligned, press <strong className="text-white">Unlock</strong>.
                </p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  The unlock rule is strict: every gate must sit over a pin of the <strong className="text-white">same colour</strong>, or over an empty gap with no pin under it. If any gate covers a pin of the <em>wrong</em> colour, the pick bends and the run ends instantly. Clear a ring and you advance to the next; clear the final ring to win. Cleared rings light up green, and your score is simply the number of rings you opened.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  <strong className="text-white">Controls:</strong> Rotate Left = Arrow Left or A · Rotate Right = Arrow Right or D · Unlock = Enter or Space. On-screen there are two purple Rotate buttons and a green Unlock button.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#0F1B21] rounded-lg p-4">
                  <h4 className="text-[#54FFA4] font-semibold mb-2">Game Elements</h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Concentric rings (5 by default)</li>
                    <li>• Coloured pins + coloured gates on each ring</li>
                    <li>• Manual one-notch (30°) rotation</li>
                    <li>• One ~12-second timer for the whole lock</li>
                  </ul>
                </div>
                <div className="bg-[#0F1B21] rounded-lg p-4">
                  <h4 className="text-[#54FFA4] font-semibold mb-2">Success Conditions</h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Every gate over a same-colour pin or empty gap</li>
                    <li>• Unlock each ring with no colour clash</li>
                    <li>• Clear all 5 rings in order, inside-out</li>
                    <li>• Finish before the ~12s clock expires</li>
                  </ul>
                </div>
              </div>

              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Palette className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-cyan-400 font-semibold mb-1">Key Challenge</h4>
                    <p className="text-gray-300 text-sm">
                      A single wrong-colour pin under any gate ends the run instantly, so accuracy is non-negotiable. Yet the 12-second clock covers all five rings — so you have to read each ring&apos;s colours and align it quickly, then unlock without a guess.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Aligning the Rings Section */}
        <section id="aligning" className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-[#54FFA4] text-[#0F1B21] rounded-lg flex items-center justify-center font-bold">3</span>
            Aligning the Rings
          </h2>
          <div className="space-y-6">
            <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5 text-[#54FFA4]" />
                Read the Colours First
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Before you touch a rotate button, look at where the gates are and what colour each one is, then find the rotation that puts a matching pin (or an empty gap) under each gate. Because an empty gap is always safe, you often only need to fix a couple of problem gates rather than perfectly colour-match every single one.
              </p>
            </div>

            <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-[#54FFA4]" />
                Rotate the Short Way
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                The ring wraps around 12 positions, so rotating left or right reaches the same alignment — pick whichever direction is fewer notches. Count the steps to your target before you start tapping so you settle on the right spot instead of nudging past it and wasting clock.
              </p>
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
                Strategy 1: Solve, Then Unlock
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Never unlock on a hope. One wrong-colour pin under a single gate bends the pick and ends the whole run. Confirm that every gate is either matched to its colour or sitting over an empty gap before you ever hit Unlock.
              </p>
              <div className="bg-[#0F1B21] rounded-lg p-4">
                <p className="text-gray-400 text-sm">
                  <strong className="text-white">Pro Tip:</strong> Mentally walk the gates one by one — &quot;matched, empty, matched&quot; — and only commit once they all check out.
                </p>
              </div>
            </div>

            <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <RotateCw className="w-5 h-5 text-[#54FFA4]" />
                Strategy 2: Work Inside-Out, Fast
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Rings clear from the innermost outward, and the ~12-second clock covers all five. Settle each ring quickly and move on — dawdling on an early ring starves the ones still ahead of you.
              </p>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300 text-sm">
                    <strong className="text-green-400">Mindset:</strong> Solve cleanly, not slowly. A confident alignment beats endlessly second-guessing a ring you have already lined up.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5 text-[#54FFA4]" />
                Strategy 3: Use the Empty Gaps
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                A gate sitting over a blank position is already safe — you do not have to colour-match every gate, only make sure none lands on a wrong colour. Spotting which gates are already harmless lets you focus your rotations on the one or two that actually clash.
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
                  <h4 className="text-red-400 font-semibold mb-1">Unlocking on a Guess</h4>
                  <p className="text-gray-300 text-sm">
                    The most common failure. Hitting Unlock before the ring is actually solved leaves a wrong-colour pin under a gate and instantly bends the pick. Verify every gate first.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Forgetting Empty Gaps Are Safe</h4>
                  <p className="text-gray-300 text-sm">
                    Trying to force a coloured pin under every gate wastes rotations and clock. A gate over a blank spot is already fine — leave it alone.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Overshooting the Alignment</h4>
                  <p className="text-gray-300 text-sm">
                    Tapping rotate without counting notches blows past the right spot, and you spend extra seconds creeping back. Plan the move, then make it.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Freezing on the Clock</h4>
                  <p className="text-gray-300 text-sm">
                    The ~12 seconds cover all 5 rings. Over-analysing the first ring leaves nothing for the rest, so read it, align it, and keep moving.
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
                  <h4 className="text-white font-semibold mb-1">Scan Before You Spin</h4>
                  <p className="text-gray-400 text-sm">Read the gate colours and pin positions, decide on the alignment, then rotate straight to it in one go instead of fishing for it.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Count Your Notches</h4>
                  <p className="text-gray-400 text-sm">Each press is exactly one of 12 positions (30°). Counting steps to the target is far more reliable than nudging and checking.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Pick the Closer Direction</h4>
                  <p className="text-gray-400 text-sm">Left and right reach the same alignment on a 12-position wheel — using whichever is fewer notches roughly halves your rotations.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Use the Keyboard</h4>
                  <p className="text-gray-400 text-sm">A / D to rotate and Enter to unlock are quicker than reaching for the on-screen buttons when the clock is short.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Tune the Practice Settings</h4>
                  <p className="text-gray-400 text-sm">Practice mode lets you change the ring count (2–10) and the timer (5–100s). Shorten the clock to drill speed, or add rings to stress-test your reading.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Cut Distractions</h4>
                  <p className="text-gray-400 text-sm">This is a focus task on a 12-second clock. Mute noise and give the run your full attention from the first ring.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-[#54FFA4]/10 border border-[#54FFA4]/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Trophy className="w-5 h-5 text-[#54FFA4] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[#54FFA4] font-semibold mb-1">Mastery Benchmark</h4>
                  <p className="text-gray-300 text-sm">
                    You&apos;ve mastered the Laundromat when you can read each ring at a glance, rotate straight to the alignment, and clear all 5 rings with seconds to spare — never once unlocking on a guess.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/30 rounded-xl p-8 text-center">
          <Icon path={mdiWashingMachine} size={1.5} className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Crack the Laundromat?</h2>
          <p className="text-gray-300 mb-6 max-w-lg mx-auto">
            Drill the colour-match rotating lock with unlimited free practice. Learn to read each ring fast and align every gate until all 5 rings fall before the clock does.
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
