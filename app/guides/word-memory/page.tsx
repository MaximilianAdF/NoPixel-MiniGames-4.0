import { ArrowLeft, Clock, Target, AlertTriangle, CheckCircle, Lightbulb, Zap, Brain, Trophy, Eye, Layers } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Word Memory Guide - Master NoPixel 4.0 Recognition Challenge | Expert Tips',
  description: 'Complete guide to mastering the Word Memory minigame in NoPixel 4.0. Learn NEW vs SEEN recognition techniques, memory tracking strategies, and pro tips.',
  keywords: ['word memory guide', 'NoPixel word memory', 'NEW SEEN recognition', 'word tracking tips', 'GTA RP memory challenge'],
};

export default function WordMemoryGuidePage() {
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
            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-md border border-yellow-500/30">
              Medium Difficulty
            </span>
            <span className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              Success Rate: ~45% (untrained) → 90%+ (trained)
            </span>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Table of Contents</h2>
          <nav className="space-y-2">
            <a href="#overview" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">1. Overview</a>
            <a href="#how-it-works" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">2. How Word Memory Works</a>
            <a href="#memory-science" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">3. The Science of Memory</a>
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
              Word Memory is a sequence recall minigame that tests your ability to remember and identify words you&apos;ve seen before. Words are shown one at a time, and you must identify whether each new word is one you&apos;ve already seen (&quot;SEEN&quot;) or a new word (&quot;NEW&quot;).
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              This minigame challenges your working memory and recognition speed. Unlike memorizing a sequence and entering it back, you&apos;re constantly evaluating new information against an ever-growing mental list. It&apos;s one of the more mentally demanding hacks, especially at higher difficulties with more words.
            </p>
            <div className="bg-[#0F1B21] rounded-lg p-4 mt-4">
              <h4 className="text-white font-semibold mb-2">When You&apos;ll Encounter Word Memory:</h4>
              <ul className="text-gray-400 space-y-1 text-sm">
                <li>• Advanced security system bypasses</li>
                <li>• Intelligence-based missions</li>
                <li>• Certain heist puzzle sequences</li>
                <li>• Memory-check security protocols</li>
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
                  Words appear on screen one at a time. For each word, you must decide whether you&apos;ve seen it before in this session or if it&apos;s appearing for the first time. The twist: some words will definitely appear twice, so you need to track which words you&apos;ve encountered.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#0F1B21] rounded-lg p-4">
                  <h4 className="text-[#54FFA4] font-semibold mb-2">Game Elements</h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Words shown sequentially</li>
                    <li>• &quot;NEW&quot; and &quot;SEEN&quot; buttons</li>
                    <li>• Time limit per response</li>
                    <li>• 10-30+ words per round</li>
                  </ul>
                </div>
                <div className="bg-[#0F1B21] rounded-lg p-4">
                  <h4 className="text-[#54FFA4] font-semibold mb-2">Success Conditions</h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Correctly identify NEW words</li>
                    <li>• Correctly identify SEEN words</li>
                    <li>• Respond before time runs out</li>
                    <li>• Maintain high accuracy overall</li>
                  </ul>
                </div>
              </div>

              <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Brain className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-indigo-400 font-semibold mb-1">Key Challenge</h4>
                    <p className="text-gray-300 text-sm">
                      Your mental word list grows with each NEW word. By the end of a long sequence, you might be tracking 15+ words simultaneously. This is where memory techniques become essential.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Memory Science Section */}
        <section id="memory-science" className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-[#54FFA4] text-[#0F1B21] rounded-lg flex items-center justify-center font-bold">3</span>
            The Science of Memory
          </h2>
          <div className="space-y-6">
            <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#54FFA4]" />
                How Your Brain Remembers Words
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Your brain doesn&apos;t remember words like a computer stores data. Instead, it creates associations and emotional connections. Words that trigger imagery, emotions, or connections to existing knowledge are remembered better than abstract words.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#0F1B21] rounded-lg p-4">
                  <h4 className="text-green-400 font-semibold mb-2">Easy to Remember</h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Concrete nouns (dog, house, car)</li>
                    <li>• Emotionally charged words</li>
                    <li>• Unusual or funny words</li>
                    <li>• Words you use frequently</li>
                  </ul>
                </div>
                <div className="bg-[#0F1B21] rounded-lg p-4">
                  <h4 className="text-red-400 font-semibold mb-2">Hard to Remember</h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Abstract concepts (freedom, theory)</li>
                    <li>• Similar-sounding words</li>
                    <li>• Words with no mental image</li>
                    <li>• Rarely used vocabulary</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#54FFA4]" />
                Recognition vs Recall
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Good news: Word Memory uses <strong>recognition</strong> (easier) rather than <strong>recall</strong> (harder). You don&apos;t need to produce words from memory—you just need to recognize if you&apos;ve seen them before. This is why the minigame is more accessible than it first seems.
              </p>
              <div className="bg-[#0F1B21] rounded-lg p-4">
                <p className="text-gray-400 text-sm">
                  <strong className="text-white">Think of it like this:</strong> Recall is naming every person at a party from memory. Recognition is looking at a photo and saying &quot;Yes, I met them.&quot; Recognition is significantly easier, which is why training can dramatically improve your success rate.
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
                <Eye className="w-5 h-5 text-[#54FFA4]" />
                Strategy 1: Visual Imagery
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                When you see a NEW word, immediately create a mental image. &quot;ELEPHANT&quot; becomes a vivid elephant in your mind. &quot;COURAGE&quot; becomes a knight standing brave. The more vivid and absurd the image, the better you&apos;ll remember it.
              </p>
              <div className="bg-[#0F1B21] rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Example Imagery:</h4>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• HAMMER → Imagine smashing something dramatically</li>
                  <li>• WHISPER → Picture someone being secretive</li>
                  <li>• VOLCANO → Visualize a dramatic eruption</li>
                </ul>
              </div>
            </div>

            <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#54FFA4]" />
                Strategy 2: The Story Chain
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Link each new word to the previous one in a ridiculous story. If you see DOG, then UMBRELLA, then PIZZA, imagine: &quot;A DOG holding an UMBRELLA eating PIZZA.&quot; The absurdity makes it memorable.
              </p>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300 text-sm">
                    <strong className="text-green-400">Pro Tip:</strong> The story doesn&apos;t need to make sense—in fact, weirder is better. Your brain remembers unusual things more easily than ordinary things.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#54FFA4]" />
                Strategy 3: First Letter Anchoring
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                As a backup, track the first letter of each word. If you see BANANA, CASTLE, DRAGON, remember &quot;B-C-D.&quot; When a word appears, first check if its first letter is in your list. This gives you a quick filter before deeper recognition.
              </p>
            </div>

            <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-[#54FFA4]" />
                Strategy 4: Trust Your Gut
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Recognition often happens faster than conscious thought. If a word &quot;feels&quot; familiar, it probably is. Don&apos;t overthink—your initial instinct is frequently correct. Studies show that gut reactions on recognition tasks are more accurate than deliberate analysis.
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
                  <h4 className="text-red-400 font-semibold mb-1">Overthinking Simple Words</h4>
                  <p className="text-gray-300 text-sm">
                    Spending too long on each word eats up time and creates doubt. Make a decision within 2 seconds. If you&apos;re unsure after 2 seconds, go with your first instinct.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Not Processing New Words</h4>
                  <p className="text-gray-300 text-sm">
                    Clicking &quot;NEW&quot; without actually encoding the word. You need to create a memory trace, or you&apos;ll miss it when it reappears. Take a split second to register it.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Confusing Similar Words</h4>
                  <p className="text-gray-300 text-sm">
                    RUNNING vs RUNNER, HAPPY vs HAPPINESS. These aren&apos;t the same word. Pay attention to exact spelling and word form.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Mental Fatigue</h4>
                  <p className="text-gray-300 text-sm">
                    Long sequences are mentally exhausting. Your accuracy drops significantly after 15-20 words. Practice building mental stamina.
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
                  <h4 className="text-white font-semibold mb-1">Play Memory Games Daily</h4>
                  <p className="text-gray-400 text-sm">Apps like Lumosity or Peak train the exact working memory skills needed for this minigame.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Read More</h4>
                  <p className="text-gray-400 text-sm">People who read regularly have larger working vocabularies and better word recognition.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Stay Hydrated</h4>
                  <p className="text-gray-400 text-sm">Dehydration significantly impairs cognitive function. Drink water before important hacks.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Avoid Multitasking</h4>
                  <p className="text-gray-400 text-sm">Close Discord, mute notifications. Working memory requires full attention.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Use Keyboard Shortcuts</h4>
                  <p className="text-gray-400 text-sm">Map NEW and SEEN to keys your fingers rest on. Reduces reaction time vs clicking.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Practice With Distractions</h4>
                  <p className="text-gray-400 text-sm">Real heists have noise and stress. Practice with background noise to build resilience.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-[#54FFA4]/10 border border-[#54FFA4]/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Trophy className="w-5 h-5 text-[#54FFA4] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[#54FFA4] font-semibold mb-1">Mastery Benchmark</h4>
                  <p className="text-gray-300 text-sm">
                    You&apos;ve mastered Word Memory when you can maintain 90%+ accuracy through a 25+ word sequence. At this level, word recognition becomes almost automatic and you can handle even the longest sequences confidently.
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
            Train your working memory with unlimited practice. Build the mental capacity to track dozens of words effortlessly.
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
