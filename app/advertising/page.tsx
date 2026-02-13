import { DollarSign, Target, TrendingUp, Shield } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Advertising & Monetization - NPHacks',
  description: 'Learn about how we use advertising to keep NPHacks free for everyone. Information about our ad partners and policies.',
  keywords: ['advertising policy', 'monetization', 'ad partners', 'google adsense'],
};

export default function AdvertisingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1B21] via-[#1a2930] to-[#0F1B21] p-4 md:p-8">
      <div className="max-w-4xl mx-auto pt-20">
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-10 h-10 text-[#54FFA4]" />
            <h1 className="text-3xl font-bold text-white">Advertising & Monetization</h1>
          </div>

          <div className="prose prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#54FFA4] mb-4">Why We Show Ads</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                NPHacks is completely free to use. We don&apos;t charge for access, require subscriptions, or lock features behind paywalls. To cover hosting costs and continue improving the site, we display advertisements from trusted partners.
              </p>
              <p className="text-gray-300 leading-relaxed">
                All ads are carefully selected to be non-intrusive and relevant to our gaming audience. We never use aggressive pop-ups, auto-playing videos with sound, or misleading &quot;download&quot; buttons.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#54FFA4] mb-4">Our Ad Partners</h2>
              <div className="space-y-4">
                <div className="bg-[#0F1B21] border border-[#54FFA4]/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-[#54FFA4]" />
                    <h3 className="text-white font-bold">Google AdSense</h3>
                  </div>
                  <p className="text-gray-400 text-sm">
                    We use Google AdSense to display contextual advertisements relevant to gaming and technology.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#54FFA4] mb-4">Ad Placement Policy</h2>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <TrendingUp className="w-5 h-5 text-[#54FFA4] flex-shrink-0 mt-0.5" />
                  <span>Ads are placed strategically to avoid interfering with gameplay</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="w-5 h-5 text-[#54FFA4] flex-shrink-0 mt-0.5" />
                  <span>We filter out malicious, misleading, or inappropriate advertisements</span>
                </li>
                <li className="flex items-start gap-2">
                  <Target className="w-5 h-5 text-[#54FFA4] flex-shrink-0 mt-0.5" />
                  <span>Mobile users see mobile-optimized ad formats</span>
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#54FFA4] mb-4">Third-Party Cookies</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Our advertising partners may use cookies to deliver personalized ads based on your browsing history. You can control cookie preferences in your browser settings or opt out of personalized advertising through industry opt-out tools.
              </p>
              <p className="text-gray-300 leading-relaxed">
                For more information, see our <Link href="/privacy" className="text-[#54FFA4] hover:underline">Privacy Policy</Link>.
              </p>
            </section>

            <section className="bg-[#54FFA4]/10 border border-[#54FFA4]/30 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-[#54FFA4] mb-3">Support Us</h2>
              <p className="text-gray-300 leading-relaxed">
                By allowing ads, you help us keep NPHacks free and accessible for everyone. If you enjoy using our practice tools, please consider disabling your ad blocker for our site. Every ad view helps us continue developing new features and maintaining the server.
              </p>
            </section>

            <section className="mt-8 pt-8 border-t border-[#54FFA4]/20">
              <h2 className="text-2xl font-bold text-[#54FFA4] mb-4">Questions?</h2>
              <p className="text-gray-300 leading-relaxed">
                If you have questions about our advertising practices, please <Link href="/contact" className="text-[#54FFA4] hover:underline">contact us</Link>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
