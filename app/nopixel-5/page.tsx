import { Rocket, Clock, ArrowRight, Gamepad2, Bell, ShieldQuestion, Sparkles } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import JsonLd from '@/app/components/JsonLd';
import { breadcrumbList, faqPage } from '@/lib/structuredData';

export const metadata: Metadata = {
  // Absolute title so the global "| NoPixel 4.0 Practice" template doesn't
  // collide with the 5.0 framing of this page.
  title: {
    absolute: 'NoPixel 5.0 Minigames & Hacks - Practice Trainers (Coming Soon) | nphacks',
  },
  description:
    'NoPixel 5.0 is on the way. Track which hacking minigames are expected to change, what to know about the update, and practise the current NoPixel 4.0 lockpick, thermite and hacking minigames free right now - with 5.0 trainers landing the moment the new mechanics are known.',
  keywords: [
    'nopixel 5.0',
    'nopixel 5.0 minigames',
    'nopixel 5.0 hacks',
    'nopixel 5.0 release date',
    'nopixel 5 lockpick',
    'nopixel 5.0 thermite',
    'nopixel update',
  ],
  alternates: {
    canonical: 'https://nphacks.net/nopixel-5',
  },
  openGraph: {
    title: 'NoPixel 5.0 Minigames & Hacks - Practice Trainers (Coming Soon)',
    description:
      'Practise the current NoPixel 4.0 hacking minigames free now - and get 5.0 trainers the moment the new mechanics are known.',
    url: 'https://nphacks.net/nopixel-5',
  },
};

// The current 4.0 trainers, surfaced here so the page is genuinely useful today
// (not a thin "coming soon" stub) while it accrues authority for 5.0 searches.
const currentTrainers = [
  { slug: 'thermite', name: 'Thermite' },
  { slug: 'lockpick', name: 'Lockpick' },
  { slug: 'pincracker', name: 'PinCracker' },
  { slug: 'laundromat', name: 'Laundromat' },
  { slug: 'roof-running', name: 'Roof Running' },
  { slug: 'word-memory', name: 'Word Memory' },
  { slug: 'chopping', name: 'Chopping' },
  { slug: 'repair-kit', name: 'Repair Kit' },
];

const faqs = [
  {
    q: 'When is NoPixel 5.0 coming out?',
    a: "There is no officially confirmed NoPixel 5.0 release date yet. NoPixel updates its core systems in major versions (3.0, then the current 4.0), and 5.0 is the anticipated next step. We'll update this page as concrete, confirmed details emerge - bookmark it and check back.",
  },
  {
    q: 'Will NoPixel 5.0 have new minigames and hacks?',
    a: 'Almost certainly. Every major NoPixel version has reworked its hacking minigames - 4.0 replaced the 3.0 mechanics with new lockpick, thermite and decryption loops. Expect 5.0 to refresh the hacking minigames again. The exact mechanics are not yet known.',
  },
  {
    q: 'Can I practise NoPixel 5.0 hacks right now?',
    a: 'NoPixel 5.0 is not released yet, so its specific minigames cannot be practised. But the fundamentals - timing, pattern recognition, reaction speed and grid logic - carry across versions. Practising the current 4.0 trainers now is the best preparation, and we add 5.0 versions the moment the new mechanics are confirmed.',
  },
  {
    q: 'Will nphacks add NoPixel 5.0 trainers?',
    a: 'Yes. As soon as the 5.0 hacking minigames are known, we will build free browser trainers for them, the same way we cover every current 4.0 hack - no download, unlimited attempts.',
  },
  {
    q: 'Is this an official NoPixel page?',
    a: 'No. nphacks is an independent, fan-made practice tool and is not affiliated with or endorsed by NoPixel. Details about future updates here are based on public information and past version patterns, not insider knowledge.',
  },
];

export default function NoPixel5Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1B21] via-[#1a2930] to-[#0F1B21] p-4 md:p-8">
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', path: '/' },
          { name: 'NoPixel 5.0', path: '/nopixel-5' },
        ])}
      />
      <JsonLd data={faqPage(faqs)} />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded-full bg-[#54FFA4]/10 border border-[#54FFA4]/30 text-[#54FFA4] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Coming soon - not yet released
          </span>
          <div className="flex items-center justify-center gap-4 mb-4">
            <Rocket className="w-12 h-12 text-[#54FFA4]" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              NoPixel 5.0 Minigames &amp; Hacks
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            NoPixel 5.0 is the anticipated next major update to the flagship GTA RP server. When it
            lands and reworks the hacking minigames, free browser trainers for every new hack will go
            up here. Until then, practise the current 4.0 hacks below - the fundamentals carry over.
          </p>
        </div>

        {/* Status / what we know */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-6 md:p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <ShieldQuestion className="w-6 h-6 text-[#54FFA4]" />
            What we know about NoPixel 5.0 so far
          </h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p>
              NoPixel updates its core gameplay in major versions. The jump from 3.0 to the current
              4.0 rebuilt the criminal loop and replaced the hacking minigames with new mechanics -
              the chain-reaction thermite, the timing lockpick, grid decrypts and more. NoPixel 5.0 is
              the expected next step in that line.
            </p>
            <p>
              <span className="text-white font-semibold">There is no officially confirmed release
              date yet</span>, and the specific 5.0 minigame mechanics have not been revealed. Rather
              than guess at details, we keep this page honest and update it as concrete information is
              confirmed. What we can promise: the moment the new hacks are known, the trainers go live.
            </p>
          </div>
        </div>

        {/* What changes */}
        <h2 className="text-2xl font-bold text-white mb-6">Will the minigames change in 5.0?</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#1a2930] border-2 border-[#54FFA4]/20 rounded-xl p-6">
            <div className="inline-flex p-3 rounded-lg bg-[#54FFA4]/15 mb-4">
              <Sparkles className="w-6 h-6 text-[#54FFA4]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">New hacking mechanics</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Based on the 3.0 to 4.0 precedent, expect the lockpick, thermite and decryption hacks to
              be reworked rather than kept identical.
            </p>
          </div>
          <div className="bg-[#1a2930] border-2 border-[#54FFA4]/20 rounded-xl p-6">
            <div className="inline-flex p-3 rounded-lg bg-[#54FFA4]/15 mb-4">
              <Gamepad2 className="w-6 h-6 text-[#54FFA4]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Same core skills</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Timing, pattern recognition, reaction speed and grid logic transfer across versions, so
              practising now still pays off when 5.0 drops.
            </p>
          </div>
          <div className="bg-[#1a2930] border-2 border-[#54FFA4]/20 rounded-xl p-6">
            <div className="inline-flex p-3 rounded-lg bg-[#54FFA4]/15 mb-4">
              <Bell className="w-6 h-6 text-[#54FFA4]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Day-one trainers</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              We track NoPixel updates closely and will build free trainers and guides for the new 5.0
              hacks as soon as their mechanics are confirmed.
            </p>
          </div>
        </div>

        {/* Practise now */}
        <h2 className="text-2xl font-bold text-white mb-2">Practise the current NoPixel 4.0 hacks now</h2>
        <p className="text-gray-400 mb-6 max-w-2xl">
          The best way to get ready for 5.0 is to sharpen the fundamentals today. Every current
          NoPixel 4.0 hack has a free, unlimited browser trainer:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {currentTrainers.map((t) => (
            <Link key={t.slug} href={`/puzzles/${t.slug}`} className="group">
              <div className="h-full bg-[#1a2930] border-2 border-[#54FFA4]/20 rounded-xl p-5 hover:border-[#54FFA4]/60 transition-all duration-300 hover:-translate-y-1 flex items-center justify-between gap-2">
                <span className="text-white font-semibold group-hover:text-[#54FFA4] transition-colors">
                  {t.name}
                </span>
                <ArrowRight className="w-4 h-4 text-[#54FFA4] flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-[#54FFA4]/10 to-[#45e894]/10 border-2 border-[#54FFA4]/30 rounded-xl p-8 text-center mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Get ready for NoPixel 5.0</h2>
          <p className="text-gray-300 mb-6 max-w-lg mx-auto">
            Start practising the current hacks free, read the in-depth guides, and check back here for
            5.0 trainers the moment the update lands.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#54FFA4] text-[#0F1B21] rounded-lg font-bold hover:bg-[#45e894] transition-all hover:scale-105"
            >
              <Gamepad2 className="w-5 h-5" />
              Practise the 4.0 hacks
            </Link>
            <Link
              href="/guides"
              className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-[#54FFA4]/40 text-[#54FFA4] rounded-lg font-bold hover:border-[#54FFA4] transition-all"
            >
              Read the guides
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Clock className="w-6 h-6 text-[#54FFA4]" />
          NoPixel 5.0 FAQ
        </h2>
        <dl className="space-y-5 mb-8">
          {faqs.map((item, i) => (
            <div key={i} className="bg-[#1a2930] border border-[#54FFA4]/15 rounded-xl p-5">
              <dt className="text-white font-semibold">{item.q}</dt>
              <dd className="mt-2 text-gray-400 leading-relaxed">{item.a}</dd>
            </div>
          ))}
        </dl>

        <p className="text-center text-xs text-gray-600 max-w-xl mx-auto">
          nphacks is an independent fan-made practice tool and is not affiliated with or endorsed by
          NoPixel. Information about future updates is based on public details and past version
          patterns.
        </p>
      </div>
    </div>
  );
}
