import { ArrowLeft, Clock, Target, AlertTriangle, CheckCircle, Lightbulb, Zap, Brain, Trophy, Crosshair, Key } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lockpick Hack Guide - Master NoPixel 4.0 Timing Minigame | Expert Tips',
  description: 'Complete guide to mastering the Lockpick minigame in NoPixel 4.0. Learn timing techniques, indicator tracking, and pro tips for unlocking vehicles and doors.',
  keywords: ['lockpick hack guide', 'NoPixel lockpick', 'timing minigame tutorial', 'lockpick tips', 'GTA RP lockpick strategy'],
};

export default function LockpickGuidePage() {
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
            <div className="p-4 bg-yellow-500/20 rounded-xl">
              <Key className="w-12 h-12 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Lockpick Hack Guide
              </h1>
              <p className="text-[#54FFA4] text-lg">Timing-Based Security Bypass</p>
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
              Success Rate: ~60% (untrained) → 98%+ (trained)
            </span>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Table of Contents</h2>
          <nav className="space-y-2">
            <a href="#overview" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">1. Overview</a>
            <a href="#how-it-works" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">2. How Lockpick Works</a>
            <a href="#timing" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">3. Mastering the Timing</a>
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
              The Lockpick minigame is one of the most common hacks you&apos;ll encounter in NoPixel 4.0. It&apos;s used for breaking into vehicles, doors, and various locked containers throughout Los Santos. While it&apos;s considered one of the easier minigames, it still requires proper timing and technique to master.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              Unlike memory-based games like Thermite, Lockpick is purely about timing and rhythm. Once you develop a feel for the sweet spot, you&apos;ll be able to complete it almost automatically. This makes it an excellent starting point for new players learning the NoPixel hack system.
            </p>
            <div className="bg-[#0F1B21] rounded-lg p-4 mt-4">
              <h4 className="text-white font-semibold mb-2">When You&apos;ll Encounter Lockpick:</h4>
              <ul className="text-gray-400 space-y-1 text-sm">
                <li>• Breaking into parked vehicles</li>
                <li>• Opening locked doors and gates</li>
                <li>• Accessing storage containers</li>
                <li>• Some house robbery entry points</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-[#54FFA4] text-[#0F1B21] rounded-lg flex items-center justify-center font-bold">2</span>
            How Lockpick Works
          </h2>
          <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">The Mechanics</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  The Lockpick game displays a circular lock with multiple pins or cylinders. A marker moves around the circle at a constant speed. Your goal is to press the key (usually SPACE or left-click) when the marker is within the highlighted &quot;sweet spot&quot; zone on each pin.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#0F1B21] rounded-lg p-4">
                  <h4 className="text-[#54FFA4] font-semibold mb-2">Lock Components</h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• 4-6 pins to unlock (varies by difficulty)</li>
                    <li>• Moving marker/indicator</li>
                    <li>• Sweet spot zone on each pin</li>
                    <li>• Limited attempts before lockpick breaks</li>
                  </ul>
                </div>
                <div className="bg-[#0F1B21] rounded-lg p-4">
                  <h4 className="text-[#54FFA4] font-semibold mb-2">Success Conditions</h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Hit each pin in the sweet spot</li>
                    <li>• Complete all pins before time runs out</li>
                    <li>• Don&apos;t use all your lockpicks</li>
                    <li>• Some locks require multiple rounds</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Key className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-blue-400 font-semibold mb-1">Key Insight</h4>
                    <p className="text-gray-300 text-sm">
                      The marker speed stays constant throughout the minigame. Once you learn the rhythm for one pin, the same timing applies to all pins. This is why practice quickly translates to consistent success.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timing Section */}
        <section id="timing" className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-[#54FFA4] text-[#0F1B21] rounded-lg flex items-center justify-center font-bold">3</span>
            Mastering the Timing
          </h2>
          <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <Crosshair className="w-5 h-5 text-[#54FFA4]" />
                  Understanding the Sweet Spot
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  The sweet spot is typically indicated by a highlighted section on the lock. It might appear as a different color, a notch, or a glowing area. Your job is to press when the marker enters this zone—not before, not after.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
                  <p className="text-red-400 font-bold text-lg mb-1">Too Early</p>
                  <p className="text-gray-400 text-sm">Miss the pin, waste an attempt</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                  <p className="text-green-400 font-bold text-lg mb-1">Perfect</p>
                  <p className="text-gray-400 text-sm">Pin unlocks, progress saved</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
                  <p className="text-red-400 font-bold text-lg mb-1">Too Late</p>
                  <p className="text-gray-400 text-sm">Miss the pin, waste an attempt</p>
                </div>
              </div>

              <div className="bg-[#0F1B21] rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Timing Tips:</h4>
                <ul className="text-gray-400 space-y-2 text-sm">
                  <li>• <strong className="text-[#54FFA4]">Anticipate:</strong> Press slightly before the marker reaches the sweet spot to account for input delay</li>
                  <li>• <strong className="text-[#54FFA4]">Watch the approach:</strong> Focus on the marker&apos;s path, not just the sweet spot</li>
                  <li>• <strong className="text-[#54FFA4]">Develop rhythm:</strong> Count in your head: &quot;one, two, click&quot;</li>
                  <li>• <strong className="text-[#54FFA4]">Stay calm:</strong> Rushed inputs are inaccurate inputs</li>
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
          <div className="space-y-6">
            <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#54FFA4]" />
                Strategy 1: The Rhythm Method
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Instead of visually tracking the marker every rotation, learn the rhythm. Count the time between sweet spots and develop a mental beat. Most players find that humming or tapping helps establish this rhythm.
              </p>
              <div className="bg-[#0F1B21] rounded-lg p-4">
                <p className="text-gray-400 text-sm">
                  <strong className="text-white">How to practice:</strong> Watch the marker complete 2-3 full rotations before attempting. This gives you time to internalize the speed and mentally mark when to press.
                </p>
              </div>
            </div>

            <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-[#54FFA4]" />
                Strategy 2: Visual Landmarks
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Create visual landmarks around the sweet spot. Note what&apos;s at the &quot;3 o&apos;clock position&quot; relative to the sweet spot—when the marker passes that landmark, get ready to press.
              </p>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300 text-sm">
                    <strong className="text-green-400">Pro Tip:</strong> Your landmark should be about 1/4 rotation before the sweet spot. This gives you time to prepare without reacting too early.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#54FFA4]" />
                Strategy 3: Peripheral Vision
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Instead of tracking the marker directly, focus your eyes on the sweet spot and use peripheral vision to sense the marker approaching. This often leads to more precise timing because you&apos;re not moving your eyes.
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
                  <h4 className="text-red-400 font-semibold mb-1">Spam Clicking</h4>
                  <p className="text-gray-300 text-sm">
                    Each failed click uses an attempt. Rapid clicking hoping to get lucky will burn through your lockpicks quickly. One deliberate click is better than five panicked ones.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Inconsistent Focus Point</h4>
                  <p className="text-gray-300 text-sm">
                    Switching between watching the marker and watching the sweet spot throws off your timing. Pick one approach and stick with it.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Ignoring Frame Rate</h4>
                  <p className="text-gray-300 text-sm">
                    Low FPS makes the marker appear to jump rather than move smoothly. If possible, ensure your game runs at 60+ FPS for smoother visual tracking.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Playing While Stressed</h4>
                  <p className="text-gray-300 text-sm">
                    In-game pressure (cops nearby, timer ticking) causes mistakes. If possible, practice in a safe environment before doing real jobs.
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
                  <h4 className="text-white font-semibold mb-1">Use Audio Cues</h4>
                  <p className="text-gray-400 text-sm">Many lockpick minigames have subtle audio that changes near the sweet spot. Turn up game audio.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Muscle Memory</h4>
                  <p className="text-gray-400 text-sm">With enough practice, your finger will learn when to press without conscious thought. Trust it.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Reduce Input Lag</h4>
                  <p className="text-gray-400 text-sm">Use a wired mouse, enable game mode on your monitor, close background apps.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">First-Rotation Skip</h4>
                  <p className="text-gray-400 text-sm">Let the first rotation pass to study the speed. You have time—use it to calibrate.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Practice Both Hands</h4>
                  <p className="text-gray-400 text-sm">Train with both mouse click and keyboard spacebar. Flexibility helps in different situations.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Vary Practice Speed</h4>
                  <p className="text-gray-400 text-sm">Practice at harder (faster) settings. When you return to normal speed, it feels slow.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-[#54FFA4]/10 border border-[#54FFA4]/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Trophy className="w-5 h-5 text-[#54FFA4] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[#54FFA4] font-semibold mb-1">Mastery Indicator</h4>
                  <p className="text-gray-300 text-sm">
                    You&apos;ve mastered lockpicking when you can consistently complete 10 locks in a row without failure. At this point, the minigame becomes second nature and you can focus on the actual heist.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-2 border-blue-500/30 rounded-xl p-8 text-center">
          <Key className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Master Lockpicking?</h2>
          <p className="text-gray-300 mb-6 max-w-lg mx-auto">
            Put these strategies into practice with unlimited free attempts. Develop your timing and rhythm until it becomes automatic.
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
