import { Info, Target, Heart, Zap, Users, TrendingUp } from 'lucide-react';

export const metadata = {
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
          <p className="text-gray-400 text-lg">
            Free practice tools for the GTA RP community
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <Target className="w-10 h-10 text-[#54FFA4] flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-white mb-3">Our Mission</h2>
              <p className="text-gray-300 leading-relaxed">
                We believe everyone should have the opportunity to practice and improve their NoPixel minigame skills without pressure or risk. 
                This free, open-source platform helps players build confidence before attempting high-stakes heists in-game.
              </p>
            </div>
          </div>
        </div>

        {/* Why We Built This */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <Heart className="w-10 h-10 text-[#54FFA4] flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-white mb-3">Why We Built This</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                As passionate NoPixel viewers and players, we noticed many people struggled with the minigames, especially under pressure. 
                Some players felt excluded from heists because they couldn&apos;t master Thermite or Pin Cracker hacks quickly enough.
              </p>
              <p className="text-gray-300 leading-relaxed">
                We wanted to level the playing field. Now anyone can practice unlimited times, learn strategies, and join their crew with confidence!
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-6">
            <div className="flex items-start gap-3 mb-4">
              <Zap className="w-8 h-8 text-[#54FFA4] flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-white mb-2">100% Free</h3>
                <p className="text-gray-300">
                  No paywalls, no subscriptions, no ads blocking gameplay. Completely free forever.
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
                  Open source and built by the community, for the community. Your feedback shapes development.
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
                  We continuously add new minigames and features as NoPixel evolves.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-6">
            <div className="flex items-start gap-3 mb-4">
              <Info className="w-8 h-8 text-[#54FFA4] flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Expert Resources</h3>
                <p className="text-gray-300">
                  Detailed guides, tips, and strategies to help you master each minigame.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-[#1a2930] to-[#0F1B21] border-2 border-[#54FFA4]/30 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">By the Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold text-[#54FFA4] mb-2">8</div>
              <div className="text-gray-300 text-sm">Minigames</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#54FFA4] mb-2">100%</div>
              <div className="text-gray-300 text-sm">Free</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#54FFA4] mb-2">24/7</div>
              <div className="text-gray-300 text-sm">Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#54FFA4] mb-2">∞</div>
              <div className="text-gray-300 text-sm">Practice Runs</div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-[#1a2930] border-2 border-yellow-500/30 rounded-xl p-6">
          <h3 className="text-lg font-bold text-yellow-400 mb-3">Important Disclaimer</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            This is a fan-made project and is not affiliated with, endorsed by, or connected to NoPixel, GTA V, or Rockstar Games. 
            All game concepts and mechanics belong to their respective owners. This tool is purely educational and provided for practice purposes only.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#54FFA4] text-[#0F1B21] rounded-lg font-bold text-lg hover:bg-[#45e894] transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Start Practicing Now
          </a>
        </div>
      </div>
    </div>
  );
}
