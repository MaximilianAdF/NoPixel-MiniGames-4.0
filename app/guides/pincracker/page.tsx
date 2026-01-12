import { ArrowLeft, Clock, Target, AlertTriangle, CheckCircle, Lightbulb, Zap, Brain, Trophy, Eye, Calculator, Fingerprint } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PIN Cracker Guide - Master NoPixel 4.0 Logic Puzzle | Expert Tips',
  description: 'Complete guide to mastering the PIN Cracker minigame in NoPixel 4.0. Learn Mastermind-style deduction, color feedback interpretation, and pro tips for cracking codes.',
  keywords: ['PIN cracker guide', 'NoPixel PIN hack', 'mastermind puzzle tutorial', 'PIN cracker tips', 'GTA RP logic puzzle'],
};

export default function PincrackerGuidePage() {
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
              Success Rate: ~50% (untrained) → 95%+ (trained)
            </span>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Table of Contents</h2>
          <nav className="space-y-2">
            <a href="#overview" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">1. Overview</a>
            <a href="#how-it-works" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">2. How PIN Cracker Works</a>
            <a href="#memory-techniques" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">3. Memory Techniques</a>
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
              The PIN Cracker minigame tests your short-term memory and quick number recall. You&apos;ll see a sequence of numbers flash on screen, then need to enter them back in the correct order. It&apos;s commonly used for bypassing electronic security systems, ATMs, and secure door panels in NoPixel 4.0.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              While the concept is simple, the execution under pressure is challenging. Numbers are displayed briefly, and you need to recall anywhere from 4 to 8+ digits depending on the difficulty level. The good news? Memory is a trainable skill, and with proper techniques, anyone can significantly improve their success rate.
            </p>
            <div className="bg-[#0F1B21] rounded-lg p-4 mt-4">
              <h4 className="text-white font-semibold mb-2">When You&apos;ll Encounter PIN Cracker:</h4>
              <ul className="text-gray-400 space-y-1 text-sm">
                <li>• ATM hacking</li>
                <li>• Security panel bypasses</li>
                <li>• Safe cracking sequences</li>
                <li>• Electronic door locks</li>
                <li>• Some heist secondary objectives</li>
              </ul>
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
                  The game displays a sequence of numbers for a limited time (usually 2-5 seconds depending on length). After the numbers disappear, a number pad appears and you must enter the exact sequence you saw. Some versions require entering numbers in order, while others accept any order.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#0F1B21] rounded-lg p-4">
                  <h4 className="text-[#54FFA4] font-semibold mb-2">Display Phase</h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Numbers shown sequentially or all at once</li>
                    <li>• Display time varies by difficulty</li>
                    <li>• 4-8+ digits to remember</li>
                    <li>• May include repeating numbers</li>
                  </ul>
                </div>
                <div className="bg-[#0F1B21] rounded-lg p-4">
                  <h4 className="text-[#54FFA4] font-semibold mb-2">Input Phase</h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Number pad for entry</li>
                    <li>• Timer countdown active</li>
                    <li>• Can use keyboard or click</li>
                    <li>• Wrong entry usually means failure</li>
                  </ul>
                </div>
              </div>

              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Fingerprint className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-purple-400 font-semibold mb-1">Key Challenge</h4>
                    <p className="text-gray-300 text-sm">
                      The human brain can typically hold 7±2 items in short-term memory. PIN sequences at higher difficulties push beyond this limit, requiring memory techniques rather than raw memorization.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Memory Techniques Section */}
        <section id="memory-techniques" className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-[#54FFA4] text-[#0F1B21] rounded-lg flex items-center justify-center font-bold">3</span>
            Memory Techniques
          </h2>
          <div className="space-y-6">
            <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#54FFA4]" />
                Chunking Method
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                The most effective technique for remembering numbers. Instead of memorizing 8 individual digits (7-3-9-1-4-8-2-6), group them into chunks of 2-3 digits each (73-91-48-26 or 739-148-26).
              </p>
              <div className="bg-[#0F1B21] rounded-lg p-4">
                <div className="flex items-center gap-4 justify-center mb-4">
                  <div className="text-center">
                    <p className="text-gray-400 text-xs mb-1">Raw</p>
                    <p className="text-xl font-mono text-white">7 3 9 1 4 8 2 6</p>
                    <p className="text-red-400 text-xs mt-1">8 items to remember</p>
                  </div>
                  <span className="text-gray-500">→</span>
                  <div className="text-center">
                    <p className="text-gray-400 text-xs mb-1">Chunked</p>
                    <p className="text-xl font-mono text-[#54FFA4]">73 - 91 - 48 - 26</p>
                    <p className="text-green-400 text-xs mt-1">4 items to remember</p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm text-center">
                  Your brain treats each chunk as a single unit, effectively halving the memory load.
                </p>
              </div>
            </div>

            <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#54FFA4]" />
                Visual Patterns
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Convert numbers into visual patterns on the keypad. Trace the path your finger would take from number to number. A sequence like 1-5-9-7 forms a specific shape on the numpad.
              </p>
              <div className="grid grid-cols-3 gap-2 max-w-[150px] mx-auto mb-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <div 
                    key={num}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                      [1, 5, 9, 7].includes(num) 
                        ? 'bg-[#54FFA4] text-[#0F1B21]' 
                        : 'bg-[#0F1B21] text-gray-500'
                    }`}
                  >
                    {num}
                  </div>
                ))}
              </div>
              <p className="text-gray-400 text-sm text-center">
                &quot;1-5-9-7&quot; forms a diagonal line then jumps left. Remember the shape, not the numbers.
              </p>
            </div>

            <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#54FFA4]" />
                Association Method
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Associate number sequences with things you already know. &quot;2547&quot; could become &quot;25 (quarter) and 47 (AK-47)&quot;. Your brain remembers stories and associations far better than abstract numbers.
              </p>
              <div className="bg-[#0F1B21] rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Common Associations:</h4>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• 24 = Hours in a day</li>
                  <li>• 365 = Days in a year</li>
                  <li>• 747 = Boeing airplane</li>
                  <li>• 911 = Emergency number</li>
                  <li>• 420 = Popular culture reference</li>
                </ul>
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
                <h3 className="text-lg font-semibold text-white mb-3">The Combined Approach</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  The best players combine multiple techniques. Here&apos;s a step-by-step approach for maximum success:
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-4 p-4 bg-[#0F1B21] rounded-lg">
                  <span className="w-8 h-8 bg-[#54FFA4] text-[#0F1B21] rounded-lg flex items-center justify-center font-bold flex-shrink-0">1</span>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Chunk Immediately</h4>
                    <p className="text-gray-400 text-sm">As numbers appear, mentally group them into pairs or triplets. Don&apos;t wait until you see all numbers.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-[#0F1B21] rounded-lg">
                  <span className="w-8 h-8 bg-[#54FFA4] text-[#0F1B21] rounded-lg flex items-center justify-center font-bold flex-shrink-0">2</span>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Verbalize the Chunks</h4>
                    <p className="text-gray-400 text-sm">Quietly repeat the chunks to yourself: &quot;seventy-three, ninety-one, forty-eight&quot;. Audio reinforces visual memory.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-[#0F1B21] rounded-lg">
                  <span className="w-8 h-8 bg-[#54FFA4] text-[#0F1B21] rounded-lg flex items-center justify-center font-bold flex-shrink-0">3</span>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Trace the Path</h4>
                    <p className="text-gray-400 text-sm">Mentally trace where your finger will go on the keypad. This creates spatial memory as backup.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-[#0F1B21] rounded-lg">
                  <span className="w-8 h-8 bg-[#54FFA4] text-[#0F1B21] rounded-lg flex items-center justify-center font-bold flex-shrink-0">4</span>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Enter Confidently</h4>
                    <p className="text-gray-400 text-sm">Type at a steady pace. Don&apos;t rush, don&apos;t hesitate. Confidence prevents second-guessing errors.</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300 text-sm">
                    <strong className="text-green-400">Pro Tip:</strong> Use the numeric keypad on your keyboard if available. It&apos;s faster than clicking and the layout matches what you&apos;re visualizing.
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
                  <h4 className="text-red-400 font-semibold mb-1">Trying to Remember Individual Digits</h4>
                  <p className="text-gray-300 text-sm">
                    Your brain isn&apos;t designed to hold 8 separate items. Always chunk numbers into groups—it&apos;s significantly more reliable.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Looking Away During Display</h4>
                  <p className="text-gray-300 text-sm">
                    Every millisecond of viewing time matters. Don&apos;t glance at the keypad, timer, or anything else while numbers are showing.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Second-Guessing Yourself</h4>
                  <p className="text-gray-300 text-sm">
                    Once you start entering numbers, commit to your memory. Hesitating and changing answers usually leads to more errors, not fewer.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Not Using Keyboard Numpad</h4>
                  <p className="text-gray-300 text-sm">
                    Clicking numbers is slow and requires visual attention. The numeric keypad is faster and lets you stay focused on recall.
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
                  <h4 className="text-white font-semibold mb-1">Practice Mental Math</h4>
                  <p className="text-gray-400 text-sm">Daily number exercises strengthen your working memory overall, not just for this minigame.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Get Enough Sleep</h4>
                  <p className="text-gray-400 text-sm">Sleep-deprived brains struggle with short-term memory. Rest before important heists.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Minimize Distractions</h4>
                  <p className="text-gray-400 text-sm">Close Discord, mute notifications. Any interruption during memorization can wipe your memory.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Practice Beyond Your Level</h4>
                  <p className="text-gray-400 text-sm">Train at 8+ digits so that 6-digit sequences feel easy by comparison.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Build a Number Vocabulary</h4>
                  <p className="text-gray-400 text-sm">The more associations you have for 2-digit numbers, the faster you can encode them.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Train Your Peripheral Vision</h4>
                  <p className="text-gray-400 text-sm">Learn to see all numbers at once rather than reading left-to-right sequentially.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-[#54FFA4]/10 border border-[#54FFA4]/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Trophy className="w-5 h-5 text-[#54FFA4] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[#54FFA4] font-semibold mb-1">Mastery Benchmark</h4>
                  <p className="text-gray-300 text-sm">
                    You&apos;ve mastered PIN cracking when you can consistently complete 8-digit sequences without chunking—your brain will automatically process numbers efficiently through sheer practice.
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
            Put these memory techniques into practice. Start with shorter sequences and work your way up to expert level.
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
