import { Info, Target, Heart, Zap, Users, TrendingUp, Code, Globe, Gamepad2, BookOpen } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us - NoPixel 4.0 Minigames Trainer',
  description: 'Learn about NoPixel 4.0 Minigames Trainer - A free, open-source practice tool for GTA RP players to master Thermite, Lockpick, PinCracker and other heist minigames.',
  openGraph: {
    title: 'About NoPixel 4.0 Minigames Trainer',
    description: 'Free practice tools for the GTA RP community. Learn about our mission to help players master NoPixel minigames.',
    url: 'https://nphacks.net/about',
  },
  alternates: {
    canonical: 'https://nphacks.net/about',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1B21] via-[#1a2930] to-[#0F1B21] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Info className="w-12 h-12 text-[#54FFA4]" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              About NoPixel 4.0 Minigames
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            The most comprehensive free practice simulator for GTA RP hacking minigames, built by the community for the community.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <Target className="w-10 h-10 text-[#54FFA4] flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-white mb-3">Our Mission</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We believe everyone should have the opportunity to practice and improve their NoPixel minigame skills without pressure or risk.
                This free, open-source platform helps players build confidence before attempting high-stakes heists in-game.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Whether you&apos;re preparing for your first Fleeca Bank robbery or training to join an elite vault heist crew,
                our simulators provide the realistic practice environment you need to succeed. Every minigame has been carefully
                recreated to match the exact mechanics, timing, and difficulty of the real NoPixel 4.0 experience.
              </p>
            </div>
          </div>
        </div>

        {/* Why We Built This */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <Heart className="w-10 h-10 text-[#54FFA4] flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-white mb-3">Why We Built This</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                As passionate NoPixel viewers and players, we noticed many people struggled with the minigames, especially under pressure.
                Some players felt excluded from heists because they couldn&apos;t master Thermite or Pin Cracker hacks quickly enough.
                The in-game consequences of failure are severe — wasted supplies, police alerts, and potentially days of planning down the drain.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                We wanted to level the playing field. By providing a free, risk-free training environment, we enable players of all skill
                levels to practice until they&apos;re confident. Many of our users report going from failing every Thermite attempt to
                achieving consistent success after just a few hours of focused practice on our platform.
              </p>
              <p className="text-gray-300 leading-relaxed">
                The result is a practice tool that has helped thousands of GTA RP players across the world improve their skills,
                join heist crews, and enjoy the full NoPixel experience without the frustration of learning under pressure.
              </p>
            </div>
          </div>
        </div>

        {/* What We Offer */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <Gamepad2 className="w-10 h-10 text-[#54FFA4] flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">What We Offer</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Our platform includes authentic replicas of all major NoPixel 4.0 hacking minigames, each designed to provide
                an identical practice experience to the real thing:
              </p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-[#54FFA4] font-bold mt-0.5">•</span>
                  <span><strong className="text-white">Thermite Hack</strong> — The iconic memory-based tile pattern game used in bank heist laser security systems. One of the hardest minigames requiring exceptional pattern recognition.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#54FFA4] font-bold mt-0.5">•</span>
                  <span><strong className="text-white">Lockpick</strong> — A timing-based challenge used for vehicle theft and door bypassing. Tests your rhythm and precision under pressure.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#54FFA4] font-bold mt-0.5">•</span>
                  <span><strong className="text-white">PinCracker</strong> — A logic puzzle requiring you to crack numerical codes through deduction. Used in Maze Bank security systems.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#54FFA4] font-bold mt-0.5">•</span>
                  <span><strong className="text-white">Laundromat</strong> — A pattern matching game triggered during south-side safe robberies. Requires quick visual processing.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#54FFA4] font-bold mt-0.5">•</span>
                  <span><strong className="text-white">Roof Running</strong> — An agility-based challenge encountered when robbing AC units. Tests hand-eye coordination.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#54FFA4] font-bold mt-0.5">•</span>
                  <span><strong className="text-white">Word Memory</strong> — A verbal memory test used in advanced bank hacking scenarios. Challenges your working memory capacity.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#54FFA4] font-bold mt-0.5">•</span>
                  <span><strong className="text-white">Chopping</strong> — The vehicle disassembly minigame with rapid response requirements. Used in the chop shop criminal enterprise.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#54FFA4] font-bold mt-0.5">•</span>
                  <span><strong className="text-white">RepairKit</strong> — A mechanical puzzle for vehicle repairs. Tests your ability to complete complex sequences quickly.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-6">
            <div className="flex items-start gap-3 mb-4">
              <Zap className="w-8 h-8 text-[#54FFA4] flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-white mb-2">100% Free to Use</h3>
                <p className="text-gray-300">
                  No paywalls, no subscriptions, no barriers to entry. We keep the service running through minimal, non-intrusive advertising
                  that never interferes with your gameplay experience. Your practice sessions are always uninterrupted.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-6">
            <div className="flex items-start gap-3 mb-4">
              <Users className="w-8 h-8 text-[#54FFA4] flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Community Driven</h3>
                <p className="text-gray-300">
                  Open source and built by the community, for the community. Your feedback shapes development priorities,
                  and contributions from developers worldwide keep the platform growing.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-6">
            <div className="flex items-start gap-3 mb-4">
              <TrendingUp className="w-8 h-8 text-[#54FFA4] flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Always Updated</h3>
                <p className="text-gray-300">
                  We continuously monitor NoPixel updates and add new minigames as they&apos;re released. Our simulators
                  are kept in sync with the latest server mechanics so your practice is always relevant.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-6">
            <div className="flex items-start gap-3 mb-4">
              <BookOpen className="w-8 h-8 text-[#54FFA4] flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Expert Resources</h3>
                <p className="text-gray-300">
                  Each minigame comes with detailed instructions, scoring breakdowns, advanced strategies, and expert tips
                  written by experienced NoPixel players who have mastered every hack.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Section */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <Code className="w-10 h-10 text-[#54FFA4] flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-white mb-3">Built with Modern Technology</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Our platform is built using industry-leading web technologies to ensure the best possible experience across all devices:
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-[#54FFA4]">▸</span>
                  <strong className="text-white">Next.js 14</strong> — Server-side rendering for lightning-fast page loads
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#54FFA4]">▸</span>
                  <strong className="text-white">React 18</strong> — Smooth, responsive user interfaces
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#54FFA4]">▸</span>
                  <strong className="text-white">TypeScript</strong> — Type-safe codebase for reliability
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#54FFA4]">▸</span>
                  <strong className="text-white">MongoDB</strong> — Scalable database for leaderboards and user data
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#54FFA4]">▸</span>
                  <strong className="text-white">Vercel</strong> — Global CDN deployment for minimal latency worldwide
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Global Community */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <Globe className="w-10 h-10 text-[#54FFA4] flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-white mb-3">A Global Community</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Players from around the world use our platform daily to sharpen their skills. Our global leaderboards create
                a competitive environment that pushes everyone to improve, while the open-source nature of the project means
                developers from diverse backgrounds contribute to making the platform better.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Whether you&apos;re in North America, Europe, Asia, or anywhere else, our platform is optimized to deliver
                low-latency gameplay through Vercel&apos;s worldwide edge network. Practice sessions feel smooth and responsive
                regardless of your location.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-[#1a2930] to-[#0F1B21] border-2 border-[#54FFA4]/30 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">By the Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold text-[#54FFA4] mb-2">8</div>
              <div className="text-gray-300 text-sm">Minigames Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#54FFA4] mb-2">100%</div>
              <div className="text-gray-300 text-sm">Free to Play</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#54FFA4] mb-2">24/7</div>
              <div className="text-gray-300 text-sm">Always Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#54FFA4] mb-2">∞</div>
              <div className="text-gray-300 text-sm">Unlimited Practice</div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-[#1a2930] border-2 border-yellow-500/30 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-bold text-yellow-400 mb-3">Important Disclaimer</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            This is a fan-made project and is not affiliated with, endorsed by, or connected to NoPixel, GTA V, Rockstar Games,
            or Take-Two Interactive. All game concepts, trademarks, and mechanics belong to their respective owners.
            This tool is purely educational and provided for practice purposes only. NoPixel&reg; is a registered trademark
            of its respective owner.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#54FFA4] text-[#0F1B21] rounded-lg font-bold text-lg hover:bg-[#45e894] transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Start Practicing Now
          </Link>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
            <Link href="/guides" className="hover:text-[#54FFA4] transition-colors">
              Read Our Guides
            </Link>
            <span>•</span>
            <Link href="/faq" className="hover:text-[#54FFA4] transition-colors">
              View FAQ
            </Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-[#54FFA4] transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
