import { ArrowLeft, Clock, Target, AlertTriangle, CheckCircle, Lightbulb, Zap, Brain, Trophy, Eye, Layers, MousePointerClick } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import JsonLd from '@/app/components/JsonLd';
import { breadcrumbList, guideArticle } from '@/lib/structuredData';

export const metadata: Metadata = {
  title: 'Word Memory Guide - Master NoPixel 4.0 Recognition Challenge | Expert Tips',
  description: 'Complete guide to mastering the Word Memory minigame in NoPixel 4.0. Learn NEW vs SEEN recognition techniques, memory tracking strategies, and pro tips.',
  keywords: ['word memory guide', 'NoPixel word memory', 'NEW SEEN recognition', 'word tracking tips', 'GTA RP memory challenge'],
  alternates: {
    canonical: 'https://nphacks.net/guides/word-memory',
  },
  openGraph: {
    title: 'Word Memory Guide - Master NoPixel 4.0 Recognition Challenge | Expert Tips',
    description: 'Complete guide to mastering the Word Memory minigame in NoPixel 4.0. Learn NEW vs SEEN recognition techniques, memory tracking strategies, and pro tips.',
    url: 'https://nphacks.net/guides/word-memory',
  },
};

export default function WordMemoryGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1B21] via-[#1a2930] to-[#0F1B21] p-4 md:p-8">
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', path: '/' },
          { name: 'Guides', path: '/guides' },
          { name: 'Word Memory Guide', path: '/guides/word-memory' },
        ])}
      />
      <JsonLd
        data={guideArticle({
          headline: 'Word Memory Guide - Master NoPixel 4.0 Recognition Challenge | Expert Tips',
          description: 'Complete guide to mastering the Word Memory minigame in NoPixel 4.0. Learn NEW vs SEEN recognition techniques, memory tracking strategies, and pro tips.',
          path: '/guides/word-memory',
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
            <div className="p-4 bg-pink-500/20 rounded-xl">
              <Brain className="w-12 h-12 text-pink-400" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Word Memory Guide
              </h1>
              <p className="text-[#54FFA4] text-lg">NEW vs SEEN Recognition Challenge</p>
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
              Goal: clear the whole sequence with zero mistakes
            </span>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Table of Contents</h2>
          <nav className="space-y-2">
            <a href="#overview" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">1. Overview</a>
            <a href="#how-it-works" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">2. How Word Memory Works</a>
            <a href="#memory-science" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">3. Recognition, Not Recall</a>
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
              Word Memory shows you one word at a time and asks a single question about each one: have you already seen this word earlier in the run? Press <span className="text-[#54FFA4] font-semibold">SEEN</span> if the word has appeared before, or <span className="text-[#54FFA4] font-semibold">NEW</span> if this is its first appearance. Get it right and the next word loads; get it wrong even once and the run ends instantly.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              The catch is the pacing. A single countdown covers the entire sequence — by default you have about <strong className="text-white">25 seconds</strong> to clear <strong className="text-white">25 words</strong>, which works out to roughly one second per decision. There are no lives, no strikes, and no streak meter: it is a flawless-run-or-bust recognition test against the clock.
            </p>
            <div className="bg-[#0F1B21] rounded-lg p-4 mt-4">
              <h4 className="text-white font-semibold mb-2">At a Glance (default settings):</h4>
              <ul className="text-gray-400 space-y-1 text-sm">
                <li>• Sequence length: <strong className="text-gray-200">25 words</strong> (adjustable 20&ndash;100 in settings)</li>
                <li>• Timer: <strong className="text-gray-200">25 seconds</strong> for the whole run (adjustable 20&ndash;50s)</li>
                <li>• Fail conditions: one wrong answer, or the clock hitting zero</li>
                <li>• Score: the number of words you clear before the run ends</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-[#54FFA4] text-[#0F1B21] rounded-lg flex items-center justify-center font-bold">2</span>
            How Word Memory Works
          </h2>
          <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">The Mechanics</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  The whole sequence is drawn from a small pool of distinct words — only about half as many unique words as the sequence is long (roughly <strong className="text-white">12 unique words</strong> for a 25-word run). Because that pool is so small, the same handful of words cycle back again and again, so most words after the opening few are repeats. The very first word is always NEW, since nothing has been shown yet. Your job is to keep track of which words from that small set have already turned up.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  A counter at the top shows your progress (for example <span className="text-[#54FFA4] font-semibold">0/25</span> climbing toward <span className="text-[#54FFA4] font-semibold">25/25</span>), and an orange bar along the bottom drains down as your shared timer runs out.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#0F1B21] rounded-lg p-4">
                  <h4 className="text-[#54FFA4] font-semibold mb-2 flex items-center gap-2">
                    <MousePointerClick className="w-4 h-4" /> Game Elements
                  </h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• One word shown at a time, centred</li>
                    <li>• Purple <strong className="text-gray-200">Seen</strong> and green <strong className="text-gray-200">New</strong> buttons (click or tap)</li>
                    <li>• A progress counter (cleared / total)</li>
                    <li>• A single draining timer bar for the run</li>
                  </ul>
                </div>
                <div className="bg-[#0F1B21] rounded-lg p-4">
                  <h4 className="text-[#54FFA4] font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Win &amp; Lose
                  </h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• <span className="text-emerald-400">Win:</span> classify every word correctly to the end</li>
                    <li>• <span className="text-red-400">Lose:</span> a single wrong SEEN/NEW call</li>
                    <li>• <span className="text-red-400">Lose:</span> the countdown reaching zero</li>
                    <li>• No strikes or second chances</li>
                  </ul>
                </div>
              </div>

              <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Brain className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-indigo-400 font-semibold mb-1">Key Challenge</h4>
                    <p className="text-gray-300 text-sm">
                      You are not memorising a long, ever-growing list — the unique pool is small. The real difficulty is doing it at speed and without a single slip, because one wrong call ends the entire run no matter how far you have come.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recognition vs Recall Section */}
        <section id="memory-science" className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-[#54FFA4] text-[#0F1B21] rounded-lg flex items-center justify-center font-bold">3</span>
            Recognition, Not Recall
          </h2>
          <div className="space-y-6">
            <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#54FFA4]" />
                Why This Helps You
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Word Memory uses <strong>recognition</strong> (easier) rather than <strong>recall</strong> (harder). You never have to produce a word from a blank mind — you only have to react to the word in front of you and answer &quot;have I seen this one yet?&quot;. That is far more forgiving than reciting a sequence from scratch, which is exactly why focused practice raises your success rate so quickly.
              </p>
              <div className="bg-[#0F1B21] rounded-lg p-4">
                <p className="text-gray-400 text-sm">
                  <strong className="text-white">Think of it like this:</strong> recall is naming everyone at a party from memory; recognition is glancing at a photo and saying &quot;yes, I met them.&quot; The second is much easier — and because the word pool here is small, the same faces keep coming back.
                </p>
              </div>
            </div>

            <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#54FFA4]" />
                The Words Are On Your Side
              </h3>
              <p className="text-gray-300 leading-relaxed">
                The pool is made up of concrete, everyday nouns — things like <em>apple</em>, <em>river</em>, <em>anchor</em>, <em>lantern</em> and <em>compass</em>. They are easy to picture and there are no near-duplicate spellings to trip over, so the challenge is purely about tracking which ones have already appeared, not about deciphering tricky vocabulary.
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
                <Eye className="w-5 h-5 text-[#54FFA4]" />
                Strategy 1: Trust Recognition
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Recognition often fires faster than conscious thought. If a word feels familiar, it almost certainly is — the pool is small and repeats are common. Answer on that first instinct rather than re-deriving the answer from a mental list; with a shared timer, hesitation is what kills runs.
              </p>
            </div>

            <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#54FFA4]" />
                Strategy 2: Encode Each New Word
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                When you press NEW, take a split second to actually register the word — say it to yourself or flash a quick mental image. Because the words are concrete nouns, vivid imagery sticks easily. Click NEW on autopilot and you will fail to recognise that word the next time it cycles back.
              </p>
              <div className="bg-[#0F1B21] rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Quick imagery:</h4>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• ANCHOR &rarr; picture it splashing off a boat</li>
                  <li>• LANTERN &rarr; picture it glowing in the dark</li>
                  <li>• ROCKET &rarr; picture it blasting off</li>
                </ul>
              </div>
            </div>

            <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#54FFA4]" />
                Strategy 3: Keep a Steady Rhythm
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                The clock covers the whole run, not each word, so roughly 25 words must fit inside roughly 25 seconds. Settle into a one-decision-per-second rhythm and do not burn three or four seconds agonising over a single word — that stolen time leaves nothing for the words still to come.
              </p>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300 text-sm">
                    <strong className="text-green-400">Pro Tip:</strong> tune the run in settings. Bumping the timer up (to 50s) or the word count down (to 20) gives you breathing room while you learn the pool.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-[#54FFA4]" />
                Strategy 4: Exploit the Shrinking Unknown
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Early on, most words are NEW because you have not met the pool yet. Once you are deep into the run and have seen the dozen or so unique words at least once, the odds flip hard toward SEEN. Late in a sequence, a word you genuinely do not recognise should make you double-check rather than reflexively guess.
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
                  <h4 className="text-red-400 font-semibold mb-1">Forgetting One Slip Ends Everything</h4>
                  <p className="text-gray-300 text-sm">
                    There are no strikes. A single wrong SEEN or NEW call ends the run on the spot, whether it is word 2 or word 24. Stay deliberate the whole way through — a perfect run is the only kind that counts.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Clicking NEW Without Encoding</h4>
                  <p className="text-gray-300 text-sm">
                    Pressing NEW without registering the word leaves no memory trace, so you misfire when it loops back. Give every first-time word a beat of attention before moving on.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">False Familiarity</h4>
                  <p className="text-gray-300 text-sm">
                    Deep into a run everything starts to feel familiar. Do not press SEEN on a word just because the screen is busy — make sure it is one you actually encoded, not just one that rhymes with the vibe of the round.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Letting the Clock Bleed Out</h4>
                  <p className="text-gray-300 text-sm">
                    The timer covers the entire sequence. Spending too long on the easy opening words means the clock can expire before you reach the finish — running out of time is a loss just like a wrong answer.
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
                  <h4 className="text-white font-semibold mb-1">Dial In the Settings</h4>
                  <p className="text-gray-400 text-sm">Use the gear icon to set word count (20&ndash;100) and timer (20&ndash;50s). Start gentle, then tighten the screws as you improve.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Let It Loop</h4>
                  <p className="text-gray-400 text-sm">In practice the round auto-restarts a few seconds after it ends, so you can grind back-to-back attempts without touching anything.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Learn the Pool</h4>
                  <p className="text-gray-400 text-sm">Only about a dozen unique words appear in a default run. The more familiar that small set feels, the faster every SEEN call becomes.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Avoid Multitasking</h4>
                  <p className="text-gray-400 text-sm">Mute notifications and close distractions. With a one-second-per-word pace, a single glance away can cost you the run.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Rest Your Hand on the Buttons</h4>
                  <p className="text-gray-400 text-sm">Keep your cursor (or thumb) hovering between Seen and New so each answer is a tiny flick, not a hunt across the screen.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Listen for the Beep</h4>
                  <p className="text-gray-400 text-sm">A short tone confirms each correct answer and a tick marks every passing second — use the audio to keep your rhythm without staring at the bar.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-[#54FFA4]/10 border border-[#54FFA4]/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Trophy className="w-5 h-5 text-[#54FFA4] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[#54FFA4] font-semibold mb-1">Mastery Benchmark</h4>
                  <p className="text-gray-300 text-sm">
                    You have mastered Word Memory when you can clear a full default run — every word, zero mistakes — with seconds still left on the clock. At that point the recognition becomes automatic and you can crank the word count up toward 100.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-indigo-500/20 to-violet-500/20 border-2 border-indigo-500/30 rounded-xl p-8 text-center">
          <Brain className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Master Word Memory?</h2>
          <p className="text-gray-300 mb-6 max-w-lg mx-auto">
            Run unlimited free attempts in your browser. Learn the pool, lock in your rhythm, and chase a flawless clear before the timer runs dry.
          </p>
          <Link
            href="/puzzles/word-memory"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-lg font-bold hover:from-indigo-600 hover:to-violet-600 transition-all hover:scale-105"
          >
            <Brain className="w-5 h-5" />
            Practice Word Memory Now
          </Link>
        </div>
      </div>
    </div>
  );
}
