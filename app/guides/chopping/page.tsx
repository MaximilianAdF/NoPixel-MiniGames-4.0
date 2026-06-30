import { ArrowLeft, Clock, Target, AlertTriangle, CheckCircle, Lightbulb, Keyboard, Zap, Brain, Trophy, Timer, Gauge } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import JsonLd from '@/app/components/JsonLd';
import { breadcrumbList, guideArticle } from '@/lib/structuredData';

export const metadata: Metadata = {
  title: 'Chopping Guide - Master NoPixel 4.0 Typing Challenge | Expert Tips',
  description: 'Complete guide to the NoPixel 4.0 Chopping minigame. Type the Q/W/E/R/A/S/D letter sequence in order before the timer runs out — one wrong key ends the run. Learn the controls, settings, and pro tips.',
  keywords: ['chopping guide', 'NoPixel chopping minigame', 'typing challenge tutorial', 'keyboard speed tips', 'GTA RP chopping minigame', 'FiveM chopping practice'],
  alternates: {
    canonical: 'https://nphacks.net/guides/chopping',
  },
  openGraph: {
    title: 'Chopping Guide - Master NoPixel 4.0 Typing Challenge | Expert Tips',
    description: 'Complete guide to the NoPixel 4.0 Chopping minigame. Type the letter sequence in order before the timer runs out — one wrong key ends the run.',
    url: 'https://nphacks.net/guides/chopping',
  },
};

export default function ChoppingGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1B21] via-[#1a2930] to-[#0F1B21] p-4 md:p-8">
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', path: '/' },
          { name: 'Guides', path: '/guides' },
          { name: 'Chopping Guide', path: '/guides/chopping' },
        ])}
      />
      <JsonLd
        data={guideArticle({
          headline: 'Chopping Guide - Master NoPixel 4.0 Typing Challenge | Expert Tips',
          description: 'Complete guide to the NoPixel 4.0 Chopping minigame. Type the Q/W/E/R/A/S/D letter sequence in order before the timer runs out — one wrong key ends the run.',
          path: '/guides/chopping',
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
              5 min read
            </span>
            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-md border border-green-500/30">
              Easy Difficulty
            </span>
            <span className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              Success Rate: ~60% (untrained) → 99% (trained)
            </span>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Table of Contents</h2>
          <nav className="space-y-2">
            <a href="#overview" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">1. Overview</a>
            <a href="#how-it-works" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">2. How Chopping Works</a>
            <a href="#settings" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">3. Letters, Timer &amp; Settings</a>
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
              Chopping is NoPixel 4.0&apos;s quick-reaction typing minigame, triggered when you dismantle (&quot;chop&quot;) a stolen vehicle for parts in GTA RP. A row of letters lights up on screen and you have to press them in order, fast, before a short countdown expires.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              It is one of the most approachable minigames in the city — there is no marker to track and no mouse aiming. It is pure keyboard reaction. The catch is that it is unforgiving: a single wrong key ends the run instantly, so accuracy matters just as much as speed.
            </p>
            <div className="bg-[#0F1B21] rounded-lg p-4 mt-4">
              <h4 className="text-white font-semibold mb-2">When You&apos;ll Encounter Chopping:</h4>
              <ul className="text-gray-400 space-y-1 text-sm">
                <li>• Dismantling stolen vehicles at a chop shop</li>
                <li>• Vehicle boosting and theft operations</li>
                <li>• Stripping cars for parts to sell</li>
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
                  A grid of randomly generated letters appears, every one drawn from just seven keys: <strong className="text-[#54FFA4]">Q, W, E, R, A, S and D</strong>. One cell is highlighted as the active letter. Press the matching key and that cell turns green, the highlight advances to the next letter, and you keep going left to right through the whole sequence. There is no mouse input and no moving bar — you simply type each highlighted letter as it lights up.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Keyboard className="w-5 h-5 text-[#54FFA4]" />
                  Visual Feedback
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  The current target is highlighted, a correct key flashes the cell <span className="text-green-400 font-semibold">green</span> (with a confirmation beep), and a wrong key flashes it <span className="text-red-400 font-semibold">red</span> and fails the round. The countdown ticks audibly every second so you always know how much time is left.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <h4 className="text-green-400 font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    You Win When
                  </h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Every letter in the sequence is typed correctly</li>
                    <li>• The final cell turns green before time runs out</li>
                  </ul>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <h4 className="text-red-400 font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    You Lose When
                  </h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• You press the wrong key — instant fail, no second chances</li>
                    <li>• The countdown timer reaches zero first</li>
                  </ul>
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-green-400 font-semibold mb-1">It&apos;s One Continuous Round</h4>
                    <p className="text-gray-300 text-sm">
                      There are no levels or escalating difficulty tiers — each attempt is a single fixed sequence against a single countdown. In practice mode the board simply re-rolls a fresh random sequence a few seconds after each result so you can keep drilling.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Settings Section */}
        <section id="settings" className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-[#54FFA4] text-[#0F1B21] rounded-lg flex items-center justify-center font-bold">3</span>
            Letters, Timer &amp; Settings
          </h2>
          <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Timer className="w-5 h-5 text-[#54FFA4]" />
                  The Default Setup
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Out of the box the trainer gives you a <strong className="text-[#54FFA4]">15-letter</strong> sequence and a <strong className="text-[#54FFA4]">7-second</strong> countdown. That is roughly half a second per key — comfortable once your fingers know the seven keys, but tight if you have to hunt for them.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#0F1B21] rounded-lg p-4">
                  <h4 className="text-[#54FFA4] font-semibold mb-2 flex items-center gap-2">
                    <Keyboard className="w-4 h-4" />
                    Number of Letters
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Adjustable from <strong className="text-white">13 to 18</strong> in practice mode (default 15). More letters means more chances to slip and a tighter time budget per key.
                  </p>
                </div>
                <div className="bg-[#0F1B21] rounded-lg p-4">
                  <h4 className="text-[#54FFA4] font-semibold mb-2 flex items-center gap-2">
                    <Gauge className="w-4 h-4" />
                    Timer
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Adjustable from <strong className="text-white">5 to 30 seconds</strong> (default 7). Crank it up while you learn the key positions, then dial it back down to match the in-game pressure.
                  </p>
                </div>
              </div>

              <div className="bg-[#54FFA4]/10 border border-[#54FFA4]/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-[#54FFA4] flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300 text-sm">
                    <strong className="text-[#54FFA4]">Training tip:</strong> Start at 18 letters with 30 seconds to build clean, error-free muscle memory, then gradually shorten the timer toward the default 7 seconds. Your score for a run is simply the number of letters you got right before failing.
                  </p>
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
                <Keyboard className="w-5 h-5 text-[#54FFA4]" />
                Strategy 1: Anchor on the Seven Keys
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Every letter is one of Q, W, E, R, A, S or D — a tight cluster on the left side of the keyboard. Rest your left hand over those keys (index on R/F area, fingers spanning the Q-W-E-R top row and A-S-D home row) so you never have to look down or reach. Owning these seven positions is 90% of the game.
              </p>
              <div className="bg-[#0F1B21] rounded-lg p-4">
                <p className="text-gray-400 text-sm">
                  <strong className="text-white">Pro Tip:</strong> The keys are not the literal home row — Q, W, E and R sit on the row above A, S and D. Practise the two-row reach until your fingers find each letter without thought.
                </p>
              </div>
            </div>

            <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#54FFA4]" />
                Strategy 2: Accuracy Over Raw Speed
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Because a single wrong key ends the run, there is no value in mashing. A clean, slightly slower pass beats a frantic one that fails on letter nine. Match your speed to the level where you stop making mistakes, then let it creep up naturally.
              </p>
            </div>

            <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#54FFA4]" />
                Strategy 3: Read Ahead
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Your eyes should be on the <em>next</em> letter, not the one your finger is currently pressing. Reading one or two cells ahead removes the stutter between keystrokes and lets you flow through the sequence at a steady rhythm instead of stop-start bursts.
              </p>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300 text-sm">
                    <strong className="text-green-400">Pro Tip:</strong> A smooth, even cadence finishes faster than alternating sprints and pauses — and it makes mistakes far less likely.
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
                  <h4 className="text-red-400 font-semibold mb-1">Mashing for Speed</h4>
                  <p className="text-gray-300 text-sm">
                    One wrong key is an instant loss, so panic-mashing throws away the run. Type deliberately — speed without control fails every time.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Hitting Adjacent Keys</h4>
                  <p className="text-gray-300 text-sm">
                    Q, W, E, R, A, S and D are packed close together, so a lazy finger easily lands on a neighbour. Keep your hand anchored so each key has a dedicated finger.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Looking at the Keyboard</h4>
                  <p className="text-gray-300 text-sm">
                    Glancing down to find a key costs time and breaks your read-ahead. Learn the seven positions by feel so your eyes stay on the screen.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Ignoring the Timer</h4>
                  <p className="text-gray-300 text-sm">
                    The default 7-second window is short. Staring at one letter too long lets the clock run out even if you never make a mistake — keep moving.
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
                  <h4 className="text-white font-semibold mb-1">Fixed Left-Hand Claw</h4>
                  <p className="text-gray-400 text-sm">Settle your left hand into one claw shape over Q-W-E-R-A-S-D and never move the whole hand — only flick individual fingers.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Listen for the Beep</h4>
                  <p className="text-gray-400 text-sm">Each correct key plays a confirmation beep. Use it as an audio metronome so you can keep your eyes reading ahead.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Drill With More Letters</h4>
                  <p className="text-gray-400 text-sm">Set the count to 18 in settings. If you can clear 18 cleanly, the in-game 15 feels easy.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Then Tighten the Clock</h4>
                  <p className="text-gray-400 text-sm">Once accuracy is solid, lower the timer step by step toward 7 seconds to build the pace real chops demand.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Use a Responsive Keyboard</h4>
                  <p className="text-gray-400 text-sm">A wired or low-latency keyboard registers fast finger flicks more reliably than a laggy wireless one.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Warm Up Before Jobs</h4>
                  <p className="text-gray-400 text-sm">Run a few practice sequences before a real chop so your fingers already know the seven keys.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-[#54FFA4]/10 border border-[#54FFA4]/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Trophy className="w-5 h-5 text-[#54FFA4] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[#54FFA4] font-semibold mb-1">Mastery Benchmark</h4>
                  <p className="text-gray-300 text-sm">
                    You&apos;ve mastered Chopping when you can clear the full 15-letter sequence at the default 7-second timer, repeatedly, without a single wrong key. At that point the seven keys are pure muscle memory and the minigame becomes automatic.
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
            Drill the seven keys with unlimited practice runs. Build the speed and accuracy to clear every sequence without a single wrong key.
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
