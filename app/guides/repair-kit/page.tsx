import { ArrowLeft, Clock, Target, AlertTriangle, CheckCircle, Lightbulb, Wrench, Zap, Brain, Trophy, Gauge, Keyboard, Hand } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import JsonLd from '@/app/components/JsonLd';
import { breadcrumbList, guideArticle } from '@/lib/structuredData';

export const metadata: Metadata = {
  title: 'Repair Kit Guide - Master NoPixel 4.0 Precision Timing | Expert Tips',
  description: 'Complete guide to mastering the Repair Kit minigame in NoPixel 4.0. Learn indicator timing, sweet spot targeting, and pro tips for equipment repairs.',
  keywords: ['repair kit guide', 'NoPixel repair', 'timing minigame tutorial', 'precision clicking tips', 'GTA RP repair hack'],
  alternates: {
    canonical: 'https://nphacks.net/guides/repair-kit',
  },
  openGraph: {
    title: 'Repair Kit Guide - Master NoPixel 4.0 Precision Timing | Expert Tips',
    description: 'Complete guide to mastering the Repair Kit minigame in NoPixel 4.0. Learn indicator timing, sweet spot targeting, and pro tips for equipment repairs.',
    url: 'https://nphacks.net/guides/repair-kit',
  },
};

export default function RepairKitGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1B21] via-[#1a2930] to-[#0F1B21] p-4 md:p-8">
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', path: '/' },
          { name: 'Guides', path: '/guides' },
          { name: 'Repair Kit Guide', path: '/guides/repair-kit' },
        ])}
      />
      <JsonLd
        data={guideArticle({
          headline: 'Repair Kit Guide - Master NoPixel 4.0 Precision Timing | Expert Tips',
          description: 'Complete guide to mastering the Repair Kit minigame in NoPixel 4.0. Learn indicator timing, sweet spot targeting, and pro tips for equipment repairs.',
          path: '/guides/repair-kit',
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
            <div className="p-4 bg-red-500/20 rounded-xl">
              <Wrench className="w-12 h-12 text-red-400" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Repair Kit Guide
              </h1>
              <p className="text-[#54FFA4] text-lg">One-Press Timing Challenge</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              5 min read
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
            <a href="#how-it-works" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">2. How Repair Kit Works</a>
            <a href="#controls" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">3. Controls &amp; Difficulty Speeds</a>
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
              Repair Kit is NoPixel 4.0&apos;s <strong className="text-white">one-press timing minigame</strong> for fixing vehicles in GTA RP. A glowing block sweeps across a bar, and a fixed target slot waits somewhere along it. Your only job is to stop the block inside that slot — one button, one shot per round.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              There&apos;s no rotating, dragging, or fine-tuning here. It&apos;s pure reaction and timing: read the sweep, trigger at the right instant, and you pass. Miss the slot — or hesitate and let the block overshoot — and the repair fails. It&apos;s one of the simplest hacks in the game, which is exactly why people fumble it under pressure during a chase.
            </p>
            <div className="bg-[#0F1B21] rounded-lg p-4 mt-4">
              <h4 className="text-white font-semibold mb-2">When You&apos;ll Encounter Repair Kit:</h4>
              <ul className="text-gray-400 space-y-1 text-sm">
                <li>• Vehicle repairs in the field</li>
                <li>• Patching up a getaway car mid-chase</li>
                <li>• Recovering a damaged vehicle after a shootout</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-[#54FFA4] text-[#0F1B21] rounded-lg flex items-center justify-center font-bold">2</span>
            How Repair Kit Works
          </h2>
          <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">The Mechanics</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  A glowing block starts at the left edge of the bar and <strong className="text-white">sweeps once across to the right at a constant speed</strong>. A fixed target slot — marked with a tick above and below — sits at a random spot each round, somewhere between roughly 15% and 90% along the bar. Stop the block so its centre lines up with the slot and the repair succeeds.
                </p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  &quot;Lines up&quot; means landing within about <strong className="text-white">5% of the bar&apos;s length</strong> of the slot centre — an acceptance window roughly a tenth of the bar wide. The block does <strong className="text-white">not</strong> bounce back: it&apos;s a single pass, so if you miss the window it&apos;s gone for that round.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#0F1B21] rounded-lg p-4">
                  <h4 className="text-[#54FFA4] font-semibold mb-2">Each Round</h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• The block sweeps left → right, once</li>
                    <li>• Press E (or tap) to stop it</li>
                    <li>• Slot sits at a new random spot</li>
                    <li>• A fresh round auto-starts after ~1s</li>
                  </ul>
                </div>
                <div className="bg-[#0F1B21] rounded-lg p-4">
                  <h4 className="text-[#54FFA4] font-semibold mb-2">Win / Lose</h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Win: stop within ~5% of the slot centre</li>
                    <li>• Lose: stop too far off the slot</li>
                    <li>• Lose: let it overshoot ~7% past the slot</li>
                    <li>• Win flashes green; a miss turns the bar red</li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-yellow-400 font-semibold mb-1">Critical Understanding</h4>
                    <p className="text-gray-300 text-sm">
                      You can&apos;t just wait for the perfect moment. There&apos;s a hard cutoff: if the block travels about <strong className="text-white">7% of the bar past the slot</strong> before you act, the round auto-fails. There&apos;s no multi-stage repair, no combo, and no partial credit — each round is simply pass or fail, scored 1 or 0.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Controls & Difficulty Section */}
        <section id="controls" className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-[#54FFA4] text-[#0F1B21] rounded-lg flex items-center justify-center font-bold">3</span>
            Controls &amp; Difficulty Speeds
          </h2>
          <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                  <Keyboard className="w-5 h-5 text-[#54FFA4] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Desktop</h4>
                    <p className="text-gray-400 text-sm">Press <strong className="text-[#54FFA4]">E</strong> to stop the block. The on-screen button is only active while the block is sweeping.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                  <Hand className="w-5 h-5 text-[#54FFA4] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Mobile / Tablet</h4>
                    <p className="text-gray-400 text-sm">Tap the large stop button (the hand icon) to lock the block in place.</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-[#54FFA4]" />
                  The Four Speeds
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  The face button on the right cycles the difficulty through four sweep speeds, then loops back to the slowest. The acceptance window stays the same size — only the block gets faster, shrinking your reaction time.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-[#0F1B21] rounded-lg p-3 text-center">
                    <span className="text-green-400 font-bold">Smile</span>
                    <p className="text-gray-400 text-xs mt-1">~4s full sweep</p>
                    <p className="text-gray-500 text-xs">slowest</p>
                  </div>
                  <div className="bg-[#0F1B21] rounded-lg p-3 text-center">
                    <span className="text-yellow-400 font-bold">Meh</span>
                    <p className="text-gray-400 text-xs mt-1">~2s full sweep</p>
                    <p className="text-gray-500 text-xs">moderate</p>
                  </div>
                  <div className="bg-[#0F1B21] rounded-lg p-3 text-center">
                    <span className="text-red-400 font-bold">Angry</span>
                    <p className="text-gray-400 text-xs mt-1">~1s full sweep</p>
                    <p className="text-gray-500 text-xs">fast</p>
                  </div>
                  <div className="bg-[#0F1B21] rounded-lg p-3 text-center">
                    <span className="text-purple-400 font-bold">Dizzy</span>
                    <p className="text-gray-400 text-xs mt-1">~0.5s full sweep</p>
                    <p className="text-gray-500 text-xs">fastest</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Gauge className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-blue-400 font-semibold mb-1">Key Insight</h4>
                    <p className="text-gray-300 text-sm">
                      Pressing the difficulty button also kicks off a new round, so it doubles as your &quot;next attempt&quot; control. Practise endlessly on the slowest speed first — there are no lives and no score to lose, just back-to-back rounds.
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
            <span className="w-8 h-8 bg-[#54FFA4] text-[#0F1B21] rounded-lg flex items-center justify-center font-bold">4</span>
            Winning Strategies
          </h2>
          <div className="space-y-6">
            <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#54FFA4]" />
                Strategy 1: Press a Hair Early
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Your reaction time and input delay both arrive <em>after</em> you decide to press. Aim to trigger just before the block reaches the slot centre, not when it&apos;s already sitting on it. On the faster speeds this small lead is the difference between landing in the window and clipping the edge.
              </p>
              <div className="bg-[#0F1B21] rounded-lg p-4">
                <p className="text-gray-400 text-sm">
                  <strong className="text-white">Rule of thumb:</strong> commit to the press as the block approaches the slot, not after it touches it. Late beats nothing, but early-by-a-frame beats late.
                </p>
              </div>
            </div>

            <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-[#54FFA4]" />
                Strategy 2: Lock the Rhythm Before You Speed Up
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Each speed is perfectly constant, so a few rounds at one setting is enough to calibrate your timing. Stay on the slowest face until you&apos;re hitting the slot every time, then step up one level. Jumping straight to the fastest speed just trains bad reactions.
              </p>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300 text-sm">
                    <strong className="text-green-400">Pro Tip:</strong> the slot moves each round, but the block&apos;s speed never changes within a difficulty — so your timing instinct is built on speed, not on where the slot happens to be.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#54FFA4]" />
                Strategy 3: Commit — Don&apos;t Chase Perfect
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Because the round auto-fails once the block sails ~7% past the slot, hesitation is fatal. The window is generous enough (about a tenth of the bar) that a confident, slightly-early press lands far more often than waiting for a pixel-perfect line-up that you&apos;ll never quite see in time.
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
                  <h4 className="text-red-400 font-semibold mb-1">Hesitating Past the Slot</h4>
                  <p className="text-gray-300 text-sm">
                    Waiting for a &quot;cleaner&quot; line-up lets the block overshoot — and once it&apos;s ~7% past the slot the round is an automatic loss. Commit on the approach.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Reacting Instead of Anticipating</h4>
                  <p className="text-gray-300 text-sm">
                    If you wait until you <em>see</em> the block inside the slot, your reaction lands you late — especially on the Angry and Dizzy speeds. Pre-empt the arrival.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Jumping to the Fastest Speed</h4>
                  <p className="text-gray-300 text-sm">
                    The ~0.5s sweep leaves almost no margin. Build consistency on the slower faces first — the tolerance window is identical, so the only thing changing is how much time you have.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Panic-Pressing Early</h4>
                  <p className="text-gray-300 text-sm">
                    Stabbing the button the moment the block moves stops it far short of the slot — that&apos;s outside the 5% window and counts as a miss just like overshooting does.
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
                  <h4 className="text-white font-semibold mb-1">Use E, Not the Mouse</h4>
                  <p className="text-gray-400 text-sm">On desktop the E key is more consistent than aiming and clicking the button — fewer missed inputs at speed.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Watch the Slot, Not the Block</h4>
                  <p className="text-gray-400 text-sm">Fix your eyes on the target slot and fire as the block enters it. Tracking the block makes you chase it and react late.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Bank Reps on the Slow Face</h4>
                  <p className="text-gray-400 text-sm">Endless free rounds mean you can drill timing cheaply. Grind the slow speed until the press feels automatic.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">High Refresh Rate Helps</h4>
                  <p className="text-gray-400 text-sm">A smoother 120Hz+ sweep is far easier to read on the fast speeds than a choppy 60Hz one.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Account for Input Delay</h4>
                  <p className="text-gray-400 text-sm">Wireless gear and high system latency push your press late. If you keep clipping the trailing edge, lead the slot a touch more.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Stay Relaxed at Speed</h4>
                  <p className="text-gray-400 text-sm">On the Dizzy face, over-anticipating causes more misses than the speed itself. Trust the rhythm you trained.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-[#54FFA4]/10 border border-[#54FFA4]/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Trophy className="w-5 h-5 text-[#54FFA4] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[#54FFA4] font-semibold mb-1">Mastery Benchmark</h4>
                  <p className="text-gray-300 text-sm">
                    You&apos;ve mastered Repair Kit when you can land the slot first try on the Dizzy (fastest) speed, round after round. At that point the repair is a half-second formality even in the middle of a chase.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-slate-500/20 to-zinc-500/20 border-2 border-slate-500/30 rounded-xl p-8 text-center">
          <Wrench className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Master Repair Kit?</h2>
          <p className="text-gray-300 mb-6 max-w-lg mx-auto">
            Drill your timing with unlimited free rounds. Start on the slow face and work up to the fastest until you never fumble a repair.
          </p>
          <Link
            href="/puzzles/repair-kit"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-slate-500 to-zinc-500 text-white rounded-lg font-bold hover:from-slate-600 hover:to-zinc-600 transition-all hover:scale-105"
          >
            <Wrench className="w-5 h-5" />
            Practice Repair Kit Now
          </Link>
        </div>
      </div>
    </div>
  );
}
