import { ArrowLeft, Clock, Target, AlertTriangle, CheckCircle, Lightbulb, Zap, Brain, Trophy } from 'lucide-react';
import Icon from '@mdi/react';
import { mdiFuse } from '@mdi/js';
import Link from 'next/link';
import type { Metadata } from 'next';
import JsonLd from '@/app/components/JsonLd';
import { breadcrumbList, guideArticle } from '@/lib/structuredData';

export const metadata: Metadata = {
  title: 'Thermite Hack Guide - Master the NoPixel 4.0 Chain-Reaction Grid | Expert Tips',
  description: 'Complete guide to the NoPixel 4.0 Thermite hack — the 6x6 chain-reaction grid. Learn piece ranges, planning moves ahead, combos, and pro tips for the Maze Bank sewers and vault.',
  keywords: ['thermite hack guide', 'NoPixel thermite', 'thermite chain reaction', 'thermite tips', 'GTA RP thermite strategy', 'maze bank hack', 'thermite combos'],
  alternates: {
    canonical: 'https://nphacks.net/guides/thermite',
  },
  openGraph: {
    title: 'Thermite Hack Guide - Master the NoPixel 4.0 Chain-Reaction Grid | Expert Tips',
    description: 'Complete guide to the NoPixel 4.0 Thermite hack — the 6x6 chain-reaction grid. Learn piece ranges, planning moves ahead, combos, and pro tips for the Maze Bank sewers and vault.',
    url: 'https://nphacks.net/guides/thermite',
  },
};

export default function ThermiteGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1B21] via-[#1a2930] to-[#0F1B21] p-4 md:p-8">
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', path: '/' },
          { name: 'Guides', path: '/guides' },
          { name: 'Thermite Hack Guide', path: '/guides/thermite' },
        ])}
      />
      <JsonLd
        data={guideArticle({
          headline: 'Thermite Hack Guide - Master the NoPixel 4.0 Chain-Reaction Grid | Expert Tips',
          description: 'Complete guide to the NoPixel 4.0 Thermite hack — the 6x6 chain-reaction grid. Learn piece ranges, planning moves ahead, combos, and pro tips for the Maze Bank sewers and vault.',
          path: '/guides/thermite',
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
            <div className="p-4 bg-orange-500/20 rounded-xl">
              <Icon path={mdiFuse} size={2.5} className="text-orange-400" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Thermite Hack Guide
              </h1>
              <p className="text-[#54FFA4] text-lg">Chain-Reaction Grid</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              7 min read
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
              Thermite is one of the most demanding hacks in NoPixel 4.0 — a fast, spatial <strong className="text-white">chain-reaction</strong> played on a 6&times;6 grid (the default; presets and custom settings range from 5&times;5 up to 9&times;9). Every cell holds a <strong className="text-white">range piece</strong> — short, medium, or long — and a decryption status that steps down <strong className="text-white">full &rarr; half &rarr; empty</strong>. You don&apos;t memorise a pattern. Instead you click squares to step them down, re-lighting the board each time, and race to decrypt a target number of <strong className="text-white">bytes</strong> before the timer runs out — or before you click yourself into a dead end.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              Success comes from <strong className="text-white">reading the board and planning a couple of moves ahead</strong> — not from memory or twitch reflexes. The whole skill is keeping a legal next move alive while still landing enough decrypts in time. Even strong players get cornered on the Vault preset, which is exactly why practice pays off before a real heist.
            </p>
            <div className="bg-[#0F1B21] rounded-lg p-4 mt-4">
              <h4 className="text-white font-semibold mb-2">When You&apos;ll Encounter Thermite:</h4>
              <ul className="text-gray-400 space-y-1 text-sm">
                <li>• Maze Bank sewer generator breaches</li>
                <li>• The Maze Bank vault</li>
                <li>• Art Asylum (water route) and other high-security systems that need decrypting</li>
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
                  The board is a 6&times;6 grid of teal pieces, and at the start <strong className="text-white">every square is highlighted</strong> — your first click can be anywhere. Each click does three things at once: it steps the clicked square down one status (full &rarr; half, or half &rarr; empty), it swaps a fresh random range piece onto that square, and it <strong className="text-white">re-lights the board</strong> based on the piece that was just clicked. Only squares sitting on that piece&apos;s range pattern stay lit — everything else goes dark, and those lit squares are your only legal next clicks.
                </p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Crucially, <strong className="text-white">only the half &rarr; empty step scores</strong>. Taking a square to empty is a decrypt worth <strong className="text-white">+1 byte</strong>; the first click that drops a full square to half (it turns grey) is just a setup and scores nothing. And because clicking a square un-lights it, you have to come back and re-light it with a later click to finish it — so every byte is a <strong className="text-white">two-click play</strong>.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#0F1B21] rounded-lg p-4">
                  <h4 className="text-[#54FFA4] font-semibold mb-2">Each Click</h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• You can only click a highlighted square</li>
                    <li>• Its status drops one step (full &rarr; half &rarr; empty)</li>
                    <li>• The square is reassigned a new random range piece</li>
                    <li>• The board re-lights from that piece&apos;s range — your next moves</li>
                  </ul>
                </div>
                <div className="bg-[#0F1B21] rounded-lg p-4">
                  <h4 className="text-[#54FFA4] font-semibold mb-2">Scoring &amp; the Target</h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• A byte scores only on a half &rarr; empty decrypt (+1)</li>
                    <li>• Targets: Sewer 24 &middot; Vault 28 &middot; Art Asylum 30</li>
                    <li>• Timer: 60s (Sewer/Vault), 25s (Art Asylum)</li>
                    <li>• Three fast decrypts in a valid range pattern = combo bonus</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-3">The three piece ranges</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[#0F1B21] rounded-lg p-3 text-center">
                    <span className="text-[#54FFA4] font-bold">Short</span>
                    <p className="text-gray-400 text-xs mt-1">Adjacent cells (one step out)</p>
                  </div>
                  <div className="bg-[#0F1B21] rounded-lg p-3 text-center">
                    <span className="text-[#54FFA4] font-bold">Medium</span>
                    <p className="text-gray-400 text-xs mt-1">Two cells out (skips the gap)</p>
                  </div>
                  <div className="bg-[#0F1B21] rounded-lg p-3 text-center">
                    <span className="text-[#54FFA4] font-bold">Long</span>
                    <p className="text-gray-400 text-xs mt-1">Three cells out</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-yellow-400 font-semibold mb-1">Critical Understanding</h4>
                    <p className="text-gray-300 text-sm">
                      There&apos;s no &quot;wrong tile&quot; to misclick — you can only click highlighted squares. You fail when a click lights up <strong className="text-white">zero squares</strong> (you stall and the board flashes red) or the timer runs out. Emptied squares vanish for good and can never be re-lit, so the board shrinks as you play. The whole skill is never getting cornered: always leave yourself a next move.
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
                Strategy 1: Always Find Your Next Move First
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Before you click, look at where that click will leave you. The goal isn&apos;t to clear the nearest square — it&apos;s to keep highlighted squares available. If a move would light up nothing, it ends the run, so pick a different one.
              </p>
              <div className="bg-[#0F1B21] rounded-lg p-4">
                <p className="text-gray-400 text-sm">
                  <strong className="text-white">Rule of thumb:</strong> never make a click unless you can already see the click after it. Thinking one move ahead is the single biggest jump from ~40% to consistent wins.
                </p>
              </div>
            </div>

            <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-[#54FFA4]" />
                Strategy 2: Learn What Each Range Lights Up
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                The square you click re-lights the board using <strong className="text-white">its own</strong> range, so read that piece before committing. Each range paints a fixed shape, and once you can read those shapes at a glance you can predict your options before you click.
              </p>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <div className="bg-[#0F1B21] rounded p-3 text-center">
                  <span className="text-[#54FFA4] font-bold">Short</span>
                  <p className="text-gray-400 text-xs">adjacent cells</p>
                </div>
                <div className="bg-[#0F1B21] rounded p-3 text-center">
                  <span className="text-[#54FFA4] font-bold">Medium</span>
                  <p className="text-gray-400 text-xs">two out, skips the gap</p>
                </div>
                <div className="bg-[#0F1B21] rounded p-3 text-center">
                  <span className="text-[#54FFA4] font-bold">Long</span>
                  <p className="text-gray-400 text-xs">three cells out</p>
                </div>
              </div>
            </div>

            <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#54FFA4]" />
                Strategy 3: Chain Combos for Bonus Bytes
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                A combo (&quot;CRC Bypassed!&quot;) fires when you land <strong className="text-white">three decrypts in a row</strong> — three half &rarr; empty kills, each within about a second of the last — <strong className="text-white">and</strong> the ranges of those three pieces form a valid set: a matching trio (short-short-short, medium-medium-medium, or long-long-long) or a straight run up or down (short &rarr; medium &rarr; long, or long &rarr; medium &rarr; short).
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                The reward grows exponentially: your first combo is worth <strong className="text-white">+1</strong> bonus byte, the second <strong className="text-white">+2</strong>, the third <strong className="text-white">+4</strong>, the fourth <strong className="text-white">+8</strong>, and so on. A setup click (full &rarr; half) or any pause longer than a second breaks the streak — combos are pure decrypts, back to back.
              </p>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300 text-sm">
                    <strong className="text-green-400">Pro Tip:</strong> pre-stage three half (grey) squares, read their ranges, then kill them fast in an order that reads 1-2-3, 3-2-1, or a matching trio. That bonus is how you beat the Vault and Art Asylum targets in time.
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
                  <h4 className="text-red-400 font-semibold mb-1">Grabbing the Nearest Highlight</h4>
                  <p className="text-gray-300 text-sm">
                    Reflexively clicking the closest square without checking what it leaves you is the #1 way to stall. Always confirm you&apos;ll still have a lit square afterwards.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Forgetting a Byte Takes Two Clicks</h4>
                  <p className="text-gray-300 text-sm">
                    A full square only scores once it goes full &rarr; half &rarr; empty. The first click arms it (grey, no points); you have to re-light that half square and click it again to bank the byte. Plan to come back to it.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Drifting Into Edges &amp; Corners</h4>
                  <p className="text-gray-300 text-sm">
                    Pieces near the edge light up fewer cells (half their range falls off the board), so your options dry up fast out there. Steer the chain back toward the centre whenever you can.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Ignoring Combos on High Targets</h4>
                  <p className="text-gray-300 text-sm">
                    On Vault (28) and especially Art Asylum (30 in just 25 seconds), single decrypts won&apos;t beat the clock. Line up three kills whose ranges form a run or a matching trio to bank the bonus bytes.
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
                  <h4 className="text-white font-semibold mb-1">Memorise the Range Shapes</h4>
                  <p className="text-gray-400 text-sm">Once short/medium/long are instant to you, you can read the whole board at a glance.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Plan the Kill, Not Just the Click</h4>
                  <p className="text-gray-400 text-sm">Only half &rarr; empty scores, so arm squares you can realistically re-light and finish — don&apos;t leave grey squares stranded.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Treat the Centre as a Hub</h4>
                  <p className="text-gray-400 text-sm">Central pieces keep the most cells in range — route the chain back through the middle.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Build Combos by Range</h4>
                  <p className="text-gray-400 text-sm">Speed alone isn&apos;t enough — your three back-to-back kills must read 1-2-3, 3-2-1, or a matching trio to count.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Balance Speed With Safety</h4>
                  <p className="text-gray-400 text-sm">Combos need pace, but a single stall ends the run — never trade your last safe move for speed.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Warm Up Before Heists</h4>
                  <p className="text-gray-400 text-sm">Run a few Sewer boards first to get your board-reading sharp before the real thing.</p>
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
                <h3 className="text-lg font-semibold text-white mb-3">A Solid Session</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 p-3 bg-[#0F1B21] rounded-lg">
                    <span className="text-2xl font-bold text-[#54FFA4]">5</span>
                    <div>
                      <p className="text-white font-medium">Sewer warm-ups (target 24, 60s)</p>
                      <p className="text-gray-400 text-sm">Focus on always having a next move</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-[#0F1B21] rounded-lg">
                    <span className="text-2xl font-bold text-[#54FFA4]">10</span>
                    <div>
                      <p className="text-white font-medium">Sewer rounds, full speed</p>
                      <p className="text-gray-400 text-sm">Match real heist conditions and reading pace</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-[#0F1B21] rounded-lg">
                    <span className="text-2xl font-bold text-[#54FFA4]">5</span>
                    <div>
                      <p className="text-white font-medium">Vault rounds (target 28, 60s)</p>
                      <p className="text-gray-400 text-sm">Forces combos and planning under pressure</p>
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
                      Aim for 8/10 clean Sewer completions before attempting real heists. Once you can clear the Vault consistently — and chain a combo or two — try the Art Asylum preset (target 30 in 25 seconds) to prove your planning and combos are heist-ready.
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
            Apply these strategies with unlimited free practice. Start on the Sewer preset and work your way up to the Vault.
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
