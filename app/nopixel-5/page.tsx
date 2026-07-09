import {
  Rocket,
  Clock,
  ArrowRight,
  Gamepad2,
  Bell,
  ShieldQuestion,
  Sparkles,
  Newspaper,
  CircleDot,
} from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import JsonLd from '@/app/components/JsonLd';
import { breadcrumbList, faqPage } from '@/lib/structuredData';
import NotifyForm from './NotifyForm';

export const metadata: Metadata = {
  // Absolute title so the global "| NoPixel 4.0 Practice" template doesn't
  // collide with the 5.0 framing of this page.
  title: {
    absolute: 'NoPixel 5.0 (NoPixel V) Release Date, Minigames & Hacks - News + Free Trainers | nphacks',
  },
  description:
    'NoPixel 5.0 (officially "NoPixel V") is coming to the Rockstar Games Launcher in an official Rockstar partnership. Track the latest news, expected release date and which hacking minigames will change - and practise the current NoPixel 4.0 lockpick, thermite and hacking minigames free right now.',
  keywords: [
    'nopixel 5.0',
    'nopixel v',
    'nopixel 5',
    'nopixel 5.0 release date',
    'nopixel v release date',
    'nopixel 5.0 minigames',
    'nopixel 5.0 hacks',
    'nopixel v rockstar',
    'nopixel rockstar launcher',
    'nopixel 5 lockpick',
    'nopixel 5.0 thermite',
    'nopixel update',
  ],
  alternates: {
    canonical: 'https://nphacks.net/nopixel-5',
  },
  openGraph: {
    title: 'NoPixel 5.0 (NoPixel V) - Release News, Minigames & Free Trainers',
    description:
      'Official Rockstar partnership, spotted on the Rockstar Games Launcher. Track the news and practise the current NoPixel 4.0 hacks free now.',
    url: 'https://nphacks.net/nopixel-5',
  },
};

// Dated news log — the reason this page ranks on a live search wave. Newest
// first; each entry is a confirmed, sourced development. Update as news breaks.
const updates = [
  {
    date: 'June 22, 2026',
    title: 'NoPixel V spotted in the Rockstar Games Launcher backend',
    body: 'Dataminers found "NoPixel V" added to the Rockstar Games Launcher backend as a listed title - alongside entries like Red Dead Redemption 2 - with fresh artwork and logos. It is not yet playable, but the groundwork for an official launcher release is now in place. No release date was attached.',
  },
  {
    date: 'September 23, 2025',
    title: 'NoPixel V announced in official collaboration with Rockstar Games',
    body: 'NoPixel revealed NoPixel V - the next evolution of its GTA V roleplay - built in direct collaboration with Rockstar Games, the first time Rockstar has officially partnered with a roleplay server. Rockstar said it was "excited to support the nopixel team as they create the future of GTA RP." It expands NoPixel beyond FiveM onto the Rockstar Games Launcher and other PC platforms, with early invite sign-ups opened at nopixel.net.',
  },
];

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
    q: 'When is NoPixel 5.0 (NoPixel V) coming out?',
    a: 'There is no officially confirmed release date yet. NoPixel V was announced on September 23, 2025 in collaboration with Rockstar Games, and in June 2026 it was spotted added to the Rockstar Games Launcher backend - a strong sign it is nearing an official PC release. Rockstar or the NoPixel team could announce a date at any time. Sign up on this page and we will email you when the new hacking trainers launch.',
  },
  {
    q: 'What is NoPixel V?',
    a: 'NoPixel V is the fifth major iteration of NoPixel, the most popular GTA V roleplay server. It is the first roleplay project built in official collaboration with Rockstar Games and will run on the Rockstar Games Launcher and other PC platforms, expanding NoPixel beyond the FiveM mod framework it previously used.',
  },
  {
    q: 'Is NoPixel V the same as NoPixel 5.0?',
    a: 'Yes. The community widely refers to it as "NoPixel 5.0" because it follows 3.0 and the current 4.0, but the official branding is "NoPixel V". They are the same upcoming release.',
  },
  {
    q: 'Will NoPixel 5.0 have new minigames and hacks?',
    a: 'Almost certainly. Every major NoPixel version has reworked its hacking minigames - 4.0 replaced the 3.0 mechanics with new lockpick, thermite and decryption loops. Expect 5.0 to refresh the hacking minigames again. The exact mechanics have not been revealed yet.',
  },
  {
    q: 'How will I play NoPixel V - is it free?',
    a: 'NoPixel V will be available through the Rockstar Games Launcher on PC. NoPixel uses a whitelist system (an application that can take weeks to be approved), and early invites were opened at nopixel.net. The access model - whether it is free, subscription-based or otherwise - has not been officially confirmed.',
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
    a: 'No. nphacks is an independent, fan-made practice tool and is not affiliated with or endorsed by NoPixel or Rockstar Games. News here is gathered from public sources; future-update details are based on official announcements and past version patterns, not insider knowledge.',
  },
];

export default function NoPixel5Page() {
  return (
    <div className="single-post min-h-screen bg-gradient-to-br from-[#0F1B21] via-[#1a2930] to-[#0F1B21] p-4 md:p-8">
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', path: '/' },
          { name: 'NoPixel 5.0', path: '/nopixel-5' },
        ])}
      />
      <JsonLd data={faqPage(faqs)} />

      <div className="entry-content max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded-full bg-[#54FFA4]/10 border border-[#54FFA4]/30 text-[#54FFA4] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            In development - spotted on the Rockstar Launcher
          </span>
          <div className="flex items-center justify-center gap-4 mb-4">
            <Rocket className="w-12 h-12 text-[#54FFA4]" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              NoPixel 5.0 (NoPixel V)
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            NoPixel V is the next major NoPixel release - the first GTA RP server built in official
            collaboration with Rockstar Games, headed for the Rockstar Games Launcher. When it lands
            and reworks the hacking minigames, free browser trainers for every new hack go up here.
            Until then, track the news below and practise the current 4.0 hacks - the fundamentals
            carry over.
          </p>
        </div>

        {/* Latest news timeline */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Newspaper className="w-6 h-6 text-[#54FFA4]" />
            Latest NoPixel 5.0 news
          </h2>
          <ol className="relative border-l-2 border-[#54FFA4]/20 ml-3 space-y-8">
            {updates.map((u, i) => (
              <li key={i} className="ml-6">
                <span className="absolute -left-[9px] flex h-4 w-4 items-center justify-center rounded-full bg-[#54FFA4]">
                  <CircleDot className="w-3 h-3 text-[#0F1B21]" />
                </span>
                <time className="text-sm font-semibold uppercase tracking-wide text-[#54FFA4]">
                  {u.date}
                </time>
                <h3 className="mt-1 text-lg font-bold text-white">{u.title}</h3>
                <p className="mt-2 text-gray-400 leading-relaxed">{u.body}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Status / what we know */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-6 md:p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <ShieldQuestion className="w-6 h-6 text-[#54FFA4]" />
            What we know about NoPixel 5.0 so far
          </h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p>
              <span className="text-white font-semibold">It is real and officially backed.</span>{' '}
              NoPixel V was announced in September 2025 as a direct collaboration with Rockstar Games
              - the first time Rockstar has partnered with a roleplay server - and in June 2026 it
              surfaced in the Rockstar Games Launcher backend, signalling an official PC release is
              being prepared.
            </p>
            <p>
              <span className="text-white font-semibold">The platform is changing.</span> Where
              NoPixel has run on the FiveM mod framework for years, NoPixel V moves onto the Rockstar
              Games Launcher and other PC platforms. Access still runs through NoPixel&apos;s whitelist
              system, and early invites were opened at nopixel.net.
            </p>
            <p>
              <span className="text-white font-semibold">The minigames are still unknown.</span>{' '}
              There is no confirmed release date, and the specific 5.0 hacking mechanics have not been
              revealed. Rather than guess, we keep this page honest and update it as concrete
              information lands. What we can promise: the moment the new hacks are known, the trainers
              go live.
            </p>
          </div>
        </div>

        {/* Notify capture — the first-mover payoff */}
        <div className="bg-gradient-to-r from-[#54FFA4]/10 to-[#45e894]/10 border-2 border-[#54FFA4]/30 rounded-xl p-8 text-center mb-12">
          <div className="inline-flex p-3 rounded-full bg-[#54FFA4]/15 mb-4">
            <Bell className="w-6 h-6 text-[#54FFA4]" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Be first to practise the 5.0 hacks</h2>
          <p className="text-gray-300 mb-6 max-w-lg mx-auto">
            Drop your email and we&apos;ll notify you the instant the NoPixel 5.0 minigames are
            revealed and the free trainers go live - no spam, just the one launch email.
          </p>
          <NotifyForm />
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
          NoPixel or Rockstar Games. News is gathered from public sources; information about future
          updates is based on official announcements and past version patterns.
        </p>
      </div>
    </div>
  );
}
