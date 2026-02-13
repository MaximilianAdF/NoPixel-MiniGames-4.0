import { ArrowLeft, Clock, Target, AlertTriangle, CheckCircle, Lightbulb, Wrench, Zap, Brain, Trophy, Settings, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Repair Kit Guide - Master NoPixel 4.0 Precision Timing | Expert Tips',
  description: 'Complete guide to mastering the Repair Kit minigame in NoPixel 4.0. Learn indicator timing, sweet spot targeting, and pro tips for equipment repairs.',
  keywords: ['repair kit guide', 'NoPixel repair', 'timing minigame tutorial', 'precision clicking tips', 'GTA RP repair hack'],
};

export default function RepairKitGuidePage() {
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
            <div className="p-4 bg-red-500/20 rounded-xl">
              <Wrench className="w-12 h-12 text-red-400" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Repair Kit Guide
              </h1>
              <p className="text-[#54FFA4] text-lg">Precision Timing Challenge</p>
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
              Success Rate: ~75% (untrained) → 99%+ (trained)
            </span>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Table of Contents</h2>
          <nav className="space-y-2">
            <a href="#overview" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">1. Overview</a>
            <a href="#how-it-works" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">2. How Repair Kit Works</a>
            <a href="#alignment" className="block text-gray-400 hover:text-[#54FFA4] transition-colors">3. Mastering Alignment</a>
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
              The Repair Kit minigame is an alignment-based puzzle used for fixing various equipment in NoPixel 4.0. You&apos;ll need to align rotating or moving elements to match a target configuration, similar to solving a combination lock or aligning gears.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              This is one of the more straightforward minigames, focusing on patience and precision rather than speed or memory. The challenge comes from making fine adjustments and recognizing when you&apos;ve achieved proper alignment.
            </p>
            <div className="bg-[#0F1B21] rounded-lg p-4 mt-4">
              <h4 className="text-white font-semibold mb-2">When You&apos;ll Encounter Repair Kit:</h4>
              <ul className="text-gray-400 space-y-1 text-sm">
                <li>• Vehicle repairs</li>
                <li>• Equipment maintenance</li>
                <li>• Some crafting activities</li>
                <li>• Mechanical puzzle locks</li>
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
                  The minigame typically shows a mechanical element (like a gear, dial, or component) that needs to be aligned with a target position. You use controls to rotate or move the element until it matches the required configuration, then confirm your alignment.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#0F1B21] rounded-lg p-4">
                  <h4 className="text-[#54FFA4] font-semibold mb-2">Game Elements</h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Rotating component(s)</li>
                    <li>• Target alignment indicator</li>
                    <li>• Direction controls (left/right)</li>
                    <li>• Confirm/submit button</li>
                  </ul>
                </div>
                <div className="bg-[#0F1B21] rounded-lg p-4">
                  <h4 className="text-[#54FFA4] font-semibold mb-2">Success Conditions</h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Align element to target position</li>
                    <li>• Achieve required precision</li>
                    <li>• Confirm before time expires</li>
                    <li>• Some require multiple alignments</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Settings className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-blue-400 font-semibold mb-1">Key Insight</h4>
                    <p className="text-gray-300 text-sm">
                      Unlike timing-based games, Repair Kit rewards patience. There&apos;s usually no penalty for taking your time (within the overall timer). Focus on precision, not speed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Alignment Section */}
        <section id="alignment" className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-[#54FFA4] text-[#0F1B21] rounded-lg flex items-center justify-center font-bold">3</span>
            Mastering Alignment
          </h2>
          <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-[#54FFA4]" />
                  Understanding Rotation Controls
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Most repair minigames use simple left/right controls to rotate elements. Each press moves the element a fixed amount. Understanding this increment helps you make precise adjustments.
                </p>
              </div>

              <div className="flex items-center justify-center gap-8 py-4">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-[#54FFA4] rounded-full flex items-center justify-center mb-2">
                    <div className="w-1 h-6 bg-[#54FFA4] transform -translate-y-1" />
                  </div>
                  <span className="text-gray-400 text-xs">Target Position</span>
                </div>
                <span className="text-[#54FFA4] text-2xl">→</span>
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-gray-600 rounded-full flex items-center justify-center mb-2">
                    <div className="w-1 h-6 bg-gray-400 transform rotate-45 -translate-y-1" />
                  </div>
                  <span className="text-gray-400 text-xs">Your Element</span>
                </div>
              </div>

              <div className="bg-[#0F1B21] rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Alignment Tips:</h4>
                <ul className="text-gray-400 space-y-2 text-sm">
                  <li>• <strong className="text-[#54FFA4]">Coarse first:</strong> Get close quickly with multiple presses, then fine-tune</li>
                  <li>• <strong className="text-[#54FFA4]">Watch the gap:</strong> Look at the space between your element and the target</li>
                  <li>• <strong className="text-[#54FFA4]">Use reference points:</strong> Note where specific markers should align</li>
                  <li>• <strong className="text-[#54FFA4]">Don&apos;t overshoot:</strong> Stop short and make small adjustments</li>
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
                Strategy 1: The Two-Phase Approach
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Break alignment into two phases: rough alignment and fine-tuning. In the first phase, quickly get close to the target. In the second phase, make careful single-step adjustments until perfect.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#0F1B21] rounded-lg p-4">
                  <h4 className="text-yellow-400 font-semibold mb-2">Phase 1: Rough</h4>
                  <p className="text-gray-400 text-sm">Hold the direction key or click rapidly to get within ~10% of target.</p>
                </div>
                <div className="bg-[#0F1B21] rounded-lg p-4">
                  <h4 className="text-green-400 font-semibold mb-2">Phase 2: Fine</h4>
                  <p className="text-gray-400 text-sm">Single taps to nudge into perfect alignment.</p>
                </div>
              </div>
            </div>

            <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-[#54FFA4]" />
                Strategy 2: Reference Point Matching
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Identify a specific point on your element (like a notch, color, or edge) and a corresponding point on the target. Align these specific points rather than trying to match the whole shape at once.
              </p>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300 text-sm">
                    <strong className="text-green-400">Pro Tip:</strong> The human eye is excellent at detecting misalignment between two points but struggles with comparing complex shapes. Use this to your advantage.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#54FFA4]" />
                Strategy 3: Count Your Adjustments
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                If you overshoot, count how many steps back you go. This helps you understand the precision needed and avoid overshooting again on future attempts.
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
                  <h4 className="text-red-400 font-semibold mb-1">Rushing the Alignment</h4>
                  <p className="text-gray-300 text-sm">
                    You usually have plenty of time. Rushing leads to overshooting and wasted adjustments. Slow down and be deliberate.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Submitting Too Early</h4>
                  <p className="text-gray-300 text-sm">
                    &quot;Close enough&quot; often isn&apos;t close enough. Take the extra second to verify alignment is perfect before confirming.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Ignoring Visual Feedback</h4>
                  <p className="text-gray-300 text-sm">
                    Many repair minigames give visual cues when you&apos;re close (color changes, sounds, etc.). Pay attention to these hints.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Not Learning the Increment</h4>
                  <p className="text-gray-300 text-sm">
                    Each game has a fixed rotation increment per input. Learn this early to make precise adjustments consistently.
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
                  <h4 className="text-white font-semibold mb-1">Use Keyboard Over Mouse</h4>
                  <p className="text-gray-400 text-sm">Arrow keys give more consistent input than clicking. Less chance of accidental double-clicks.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Zoom In</h4>
                  <p className="text-gray-400 text-sm">If your game/browser allows, zoom in slightly. Bigger visual = easier to see small misalignments.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">High Refresh Rate Helps</h4>
                  <p className="text-gray-400 text-sm">Smoother rotation animation makes it easier to judge alignment accurately.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Look for Color Changes</h4>
                  <p className="text-gray-400 text-sm">Many games change element color when you&apos;re in the acceptance zone. Watch for this cue.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Practice Different Angles</h4>
                  <p className="text-gray-400 text-sm">Alignment from 180° away feels different than 45°. Practice approaches from all angles.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#0F1B21] rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Build Confidence</h4>
                  <p className="text-gray-400 text-sm">This minigame is about steady hands and confidence. Hesitation leads to overthinking.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-[#54FFA4]/10 border border-[#54FFA4]/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Trophy className="w-5 h-5 text-[#54FFA4] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[#54FFA4] font-semibold mb-1">Mastery Benchmark</h4>
                  <p className="text-gray-300 text-sm">
                    You&apos;ve mastered the Repair Kit when you can achieve perfect alignment on your first attempt, every time. The minigame becomes a quick formality rather than a challenge.
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
            Perfect your alignment skills with unlimited practice. Become the go-to mechanic who never fails a repair.
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
