import { HelpCircle, Gamepad2, Trophy, Shield, Zap, Users } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ - NoPixel 4.0 Minigames Trainer',
  description: 'Frequently asked questions about NoPixel 4.0 Minigames Trainer. Learn how to practice Thermite, Lockpick, PinCracker and other GTA RP heist minigames.',
  openGraph: {
    title: 'FAQ - NoPixel 4.0 Minigames Trainer',
    description: 'Get answers to common questions about our free NoPixel minigame practice tools.',
    url: 'https://nphacks.net/faq',
  },
  alternates: {
    canonical: 'https://nphacks.net/faq',
  },
};

export default function FAQPage() {
  const faqs = [
    {
      question: "What is NoPixel 4.0 Minigames?",
      answer: "This is a free practice simulator for the hacking minigames found in NoPixel 4.0, a popular GTA V roleplay server. You can practice Thermite, Lockpick, PinCracker, Laundromat, and other challenges without any risk or cost.",
      icon: Gamepad2,
    },
    {
      question: "Is this official NoPixel content?",
      answer: "No, this is a fan-made practice tool created to help players improve their skills. It's not affiliated with or endorsed by NoPixel. We're just passionate community members who want to help others succeed!",
      icon: Shield,
    },
    {
      question: "Do I need to pay or create an account?",
      answer: "Nope! Everything is 100% free. You can practice all minigames without logging in. Optional Discord login will be available in the future to save your scores and compete on global leaderboards.",
      icon: Users,
    },
    {
      question: "How do the leaderboards work?",
      answer: "Each minigame has its own leaderboard showing top scores. You can view them without logging in. Once Discord authentication is implemented, you'll be able to save your scores permanently and compete globally.",
      icon: Trophy,
    },
    {
      question: "Can I use this on mobile?",
      answer: "Yes! The site is fully responsive and works on phones and tablets. Some minigames (like Thermite) work better on desktop, but most are mobile-friendly. Swipe gestures are supported for navigation.",
      icon: Zap,
    },
    {
      question: "Are the minigames accurate to NoPixel 4.0?",
      answer: "We strive for accuracy, but since NoPixel's code isn't public, these are recreations based on gameplay videos and community feedback. If you notice differences, please let us know on our GitHub!",
      icon: Gamepad2,
    },
    {
      question: "How can I contribute or report bugs?",
      answer: "This is an open-source project! Visit our Open Source page to access the GitHub repository. You can report bugs, suggest features, or even contribute code. We welcome all contributions!",
      icon: Shield,
    },
    {
      question: "Will you add more minigames?",
      answer: "Absolutely! As NoPixel releases new minigames or updates existing ones, we'll add them here. Follow us on social media or star our GitHub repo to stay updated.",
      icon: Zap,
    },
    {
      question: "Can I practice offline?",
      answer: "Currently, the site requires an internet connection. However, since it's open source, you could theoretically clone the repo and run it locally. Check our GitHub for instructions.",
      icon: Gamepad2,
    },
    {
      question: "Why do you collect analytics?",
      answer: "We use basic analytics (Google Analytics) to understand which minigames are most popular and how we can improve the site. No personal data is collected, and we respect your privacy.",
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1B21] via-[#1a2930] to-[#0F1B21] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <HelpCircle className="w-12 h-12 text-[#54FFA4]" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Frequently Asked Questions
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Everything you need to know about the practice simulator
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-6">
          {faqs.map((faq, index) => {
            const Icon = faq.icon;
            return (
              <div
                key={index}
                className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-6 hover:border-[#54FFA4]/50 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-[#54FFA4]/20 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[#54FFA4]" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center p-8 bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl">
          <h2 className="text-2xl font-bold text-white mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-300 mb-6">
            Check out our GitHub discussions or join our Discord community (coming soon!)
          </p>
          <a
            href="https://github.com/MaximilianAdF/NoPixel-MiniGames-4.0"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#54FFA4] text-[#0F1B21] rounded-lg font-semibold hover:bg-[#45e894] transition-all duration-200"
          >
            Visit GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
