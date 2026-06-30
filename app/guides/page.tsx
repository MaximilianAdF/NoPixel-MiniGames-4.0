import { BookOpen, Gamepad2, Target, Clock, Trophy, Zap, Brain, ArrowRight } from 'lucide-react';
import { Blocks, Key, Wrench, Keyboard, Fingerprint } from 'lucide-react';
import Icon from '@mdi/react';
import { mdiFuse, mdiWashingMachine } from '@mdi/js';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NoPixel 4.0 Minigame Guides - Master Every Hack | Expert Tips & Strategies',
  description: 'Complete guides for all NoPixel 4.0 minigames. Learn expert strategies, tips, and techniques for Thermite, Lockpick, PinCracker, Laundromat, Roof Running, Word Memory, Chopping, and Repair Kit hacks.',
  keywords: ['NoPixel guides', 'thermite tutorial', 'lockpick guide', 'GTA RP hacking tips', 'NoPixel 4.0 strategies', 'repair kit guide'],
  alternates: {
    canonical: 'https://nphacks.net/guides',
  },
  openGraph: {
    title: 'NoPixel 4.0 Minigame Guides - Master Every Hack | Expert Tips & Strategies',
    description: 'Complete guides for all NoPixel 4.0 minigames — Thermite, Lockpick, PinCracker, Laundromat, Roof Running, Word Memory, Chopping, and Repair Kit — plus heist prep and reaction-time training.',
    url: 'https://nphacks.net/guides',
  },
};

const guides = [
  {
    slug: 'thermite',
    title: 'Thermite Hack Guide',
    subtitle: 'Chain-Reaction Grid',
    description: 'Master the 4.0 chain-reaction grid. Click highlighted squares to keep the chain alive and hit the target score before you stall or time runs out.',
    difficulty: 'Hard',
    timeToRead: '8 min',
    iconType: 'mdi' as const,
    icon: mdiFuse,
    color: 'from-orange-500 to-red-600',
    bgColor: 'bg-orange-500/20',
    textColor: 'text-orange-400',
  },
  {
    slug: 'lockpick',
    title: 'Lockpick Guide',
    subtitle: 'Rotating-Ring Colour Match',
    description: 'Rotate each ring to line its coloured pins up with matching slots, then unlock every ring before the timer runs out.',
    difficulty: 'Medium',
    timeToRead: '6 min',
    iconType: 'lucide' as const,
    icon: Key,
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'bg-yellow-500/20',
    textColor: 'text-yellow-400',
  },
  {
    slug: 'pincracker',
    title: 'PinCracker Guide',
    subtitle: 'Logic & Deduction Puzzle',
    description: 'Crack PIN codes using Mastermind-style logic. Use color feedback to deduce the correct combination through systematic elimination.',
    difficulty: 'Medium',
    timeToRead: '5 min',
    iconType: 'lucide' as const,
    icon: Fingerprint,
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-500/20',
    textColor: 'text-blue-400',
  },
  {
    slug: 'laundromat',
    title: 'Laundromat Guide',
    subtitle: 'Colour-Match Rotating Lock',
    description: 'Rotate each ring until every gate lines up with a pin of its own colour or an empty gap, then unlock it. Clear all 5 rings before the ~12-second timer runs out — one wrong-colour pin under a gate ends the run.',
    difficulty: 'Medium',
    timeToRead: '6 min',
    iconType: 'mdi' as const,
    icon: mdiWashingMachine,
    color: 'from-cyan-500 to-blue-500',
    bgColor: 'bg-cyan-500/20',
    textColor: 'text-cyan-400',
  },
  {
    slug: 'roof-running',
    title: 'Roof Running Guide',
    subtitle: 'Tile Clearing Strategy',
    description: 'Clear groups of matching colored tiles strategically. Click adjacent groups of 2+ same-colored tiles as gravity collapses the grid.',
    difficulty: 'Easy-Medium',
    timeToRead: '5 min',
    iconType: 'lucide' as const,
    icon: Blocks,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/20',
    textColor: 'text-purple-400',
  },
  {
    slug: 'word-memory',
    title: 'Word Memory Guide',
    subtitle: 'Recognition Challenge',
    description: 'Test your memory by identifying NEW vs SEEN words. Track which words have appeared and make quick, accurate decisions.',
    difficulty: 'Hard',
    timeToRead: '7 min',
    iconType: 'lucide' as const,
    icon: Brain,
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-500/20',
    textColor: 'text-pink-400',
  },
  {
    slug: 'chopping',
    title: 'Chopping Guide',
    subtitle: 'Typing Speed Challenge',
    description: 'Type a random Q/W/E/R/A/S/D letter sequence in order before the timer runs out — one wrong key ends the run. Build your typing speed and accuracy.',
    difficulty: 'Easy',
    timeToRead: '4 min',
    iconType: 'lucide' as const,
    icon: Keyboard,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/20',
    textColor: 'text-green-400',
  },
  {
    slug: 'repair-kit',
    title: 'Repair Kit Guide',
    subtitle: 'Precision Timing',
    description: 'Hit the sweet spot with precision timing. Watch the indicator move and click at exactly the right moment to repair equipment.',
    difficulty: 'Medium',
    timeToRead: '5 min',
    iconType: 'lucide' as const,
    icon: Wrench,
    color: 'from-red-500 to-orange-500',
    bgColor: 'bg-red-500/20',
    textColor: 'text-red-400',
  },
];

// Longer-form strategy articles (not tied to a single game). Linked here so they
// aren't orphaned — they each carry Article + Breadcrumb JSON-LD and sit in the sitemap.
const editorialGuides = [
  {
    slug: 'mastering-thermite',
    title: 'Mastering Thermite',
    description: 'Go deeper on the 4.0 chain-reaction hack — piece ranges, reading the board, and stringing combos to clear the sewers and vault.',
    timeToRead: '8 min',
    icon: Zap,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
  },
  {
    slug: 'nopixel-heist-guide',
    title: 'NoPixel Heist Guide',
    description: 'Which minigames each major heist throws at you, and how to prep — from Fleeca runs to the Maze Bank vault.',
    timeToRead: '10 min',
    icon: Trophy,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
  },
  {
    slug: 'improving-reaction-time',
    title: 'Improving Reaction Time',
    description: 'Drills and habits to sharpen the reflexes behind every timing-based hack, from lockpick to repair kit.',
    timeToRead: '7 min',
    icon: Brain,
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/20',
  },
];

const difficultyColors: Record<string, string> = {
  'Easy': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Easy-Medium': 'bg-lime-500/20 text-lime-400 border-lime-500/30',
  'Medium': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Hard': 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1B21] via-[#1a2930] to-[#0F1B21] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <BookOpen className="w-12 h-12 text-[#54FFA4]" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Minigame Guides
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Expert strategies, tips, and techniques to help you master every NoPixel 4.0 hacking minigame. From beginner basics to advanced pro tactics.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-4 text-center">
            <Gamepad2 className="w-8 h-8 text-[#54FFA4] mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">11</div>
            <div className="text-gray-400 text-sm">Complete Guides</div>
          </div>
          <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-4 text-center">
            <Target className="w-8 h-8 text-[#54FFA4] mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">60+</div>
            <div className="text-gray-400 text-sm">Pro Tips</div>
          </div>
          <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-4 text-center">
            <Clock className="w-8 h-8 text-[#54FFA4] mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">70+</div>
            <div className="text-gray-400 text-sm">Min Total Read</div>
          </div>
          <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-4 text-center">
            <Trophy className="w-8 h-8 text-[#54FFA4] mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">100%</div>
            <div className="text-gray-400 text-sm">Success Rate Goal</div>
          </div>
        </div>

        {/* Introduction Section */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Why Use These Guides?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-300 leading-relaxed mb-4">
                NoPixel 4.0 minigames are designed to be challenging. They test your reflexes, memory, pattern recognition, and ability to perform under pressure. Whether you&apos;re attempting your first Fleeca bank heist or going for the Maze Bank vault, having the right strategies makes all the difference.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Our guides are written by experienced players who have completed thousands of successful hacks. We&apos;ve analyzed the most common mistakes, identified the best techniques, and compiled everything into easy-to-follow guides.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-[#54FFA4] flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-white font-semibold">Proven Strategies</h4>
                  <p className="text-gray-400 text-sm">Techniques tested and refined through thousands of attempts</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Brain className="w-5 h-5 text-[#54FFA4] flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-white font-semibold">Psychology Tips</h4>
                  <p className="text-gray-400 text-sm">Stay calm and focused during high-pressure moments</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-[#54FFA4] flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-white font-semibold">Difficulty Progression</h4>
                  <p className="text-gray-400 text-sm">Start easy and work your way up to expert level</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Guide Cards */}
        <h2 className="text-2xl font-bold text-white mb-6">All Guides</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {guides.map((guide) => (
            <Link 
              key={guide.slug} 
              href={`/guides/${guide.slug}`}
              className="group"
            >
              <div className="h-full bg-[#1a2930] border-2 border-[#54FFA4]/20 rounded-xl p-6 hover:border-[#54FFA4]/60 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${guide.bgColor}`}>
                    {guide.iconType === 'mdi' ? (
                      <Icon path={guide.icon as string} size={1.5} className={guide.textColor} />
                    ) : (
                      <guide.icon className={`w-6 h-6 ${guide.textColor}`} />
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded-md text-xs font-semibold border ${difficultyColors[guide.difficulty]}`}>
                    {guide.difficulty}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#54FFA4] transition-colors">
                  {guide.title}
                </h3>
                <p className="text-[#54FFA4] text-sm mb-3">{guide.subtitle}</p>
                
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  {guide.description}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {guide.timeToRead} read
                  </span>
                  <span className="text-[#54FFA4] flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read Guide <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Strategy / Heist Guides */}
        <h2 className="text-2xl font-bold text-white mb-6">Strategy &amp; Heist Guides</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {editorialGuides.map((guide) => (
            <Link key={guide.slug} href={`/guides/${guide.slug}`} className="group">
              <div className="h-full bg-[#1a2930] border-2 border-[#54FFA4]/20 rounded-xl p-6 hover:border-[#54FFA4]/60 transition-all duration-300 hover:-translate-y-1">
                <div className={`inline-flex p-3 rounded-lg ${guide.bgColor} mb-4`}>
                  <guide.icon className={`w-6 h-6 ${guide.color}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#54FFA4] transition-colors">
                  {guide.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  {guide.description}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {guide.timeToRead} read
                  </span>
                  <span className="text-[#54FFA4] flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read Guide <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Getting Started Section */}
        <div className="bg-gradient-to-r from-[#54FFA4]/10 to-[#45e894]/10 border-2 border-[#54FFA4]/30 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">New to NoPixel Minigames?</h2>
          <p className="text-gray-300 mb-6">
            If you&apos;re just starting out, we recommend this learning path:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#0F1B21]/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-[#54FFA4] mb-2">1</div>
              <p className="text-white font-semibold">Chopping</p>
              <p className="text-gray-400 text-sm">Build typing speed</p>
            </div>
            <div className="bg-[#0F1B21]/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-[#54FFA4] mb-2">2</div>
              <p className="text-white font-semibold">Lockpick</p>
              <p className="text-gray-400 text-sm">Master timing</p>
            </div>
            <div className="bg-[#0F1B21]/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-[#54FFA4] mb-2">3</div>
              <p className="text-white font-semibold">Roof Running</p>
              <p className="text-gray-400 text-sm">Learn tile strategy</p>
            </div>
            <div className="bg-[#0F1B21]/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-[#54FFA4] mb-2">4</div>
              <p className="text-white font-semibold">Thermite</p>
              <p className="text-gray-400 text-sm">Ultimate challenge</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Practice?</h2>
          <p className="text-gray-400 mb-6">
            Put your knowledge to the test with unlimited free practice attempts.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#54FFA4] text-[#0F1B21] rounded-lg font-bold hover:bg-[#45e894] transition-all hover:scale-105"
          >
            <Gamepad2 className="w-5 h-5" />
            Start Practicing Now
          </Link>
        </div>
      </div>
    </div>
  );
}
