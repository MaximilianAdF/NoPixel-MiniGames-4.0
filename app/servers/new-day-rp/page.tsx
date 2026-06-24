import { ArrowLeft, Key, Wrench, Server, Target, BookOpen, ArrowRight, ShieldQuestion } from 'lucide-react';
import Icon from '@mdi/react';
import { mdiFuse, mdiWashingMachine } from '@mdi/js';
import Link from 'next/link';
import type { Metadata } from 'next';
import JsonLd from '@/app/components/JsonLd';
import { breadcrumbList, faqPage } from '@/lib/structuredData';

export const metadata: Metadata = {
  title: 'New Day RP Hacks & Minigame Practice - Lockpick, Thermite & More | NPHacks',
  description:
    'Free practice trainers for New Day RP (NDRP) hacking minigames. Drill the circle/timing lockpick, thermite, laundromat and repair-kit hacks used across NDRP criminal jobs — no server queue, unlimited attempts.',
  keywords: [
    'new day rp lockpick',
    'ndrp lockpick practice',
    'new day rp lockpick minigame',
    'new day rp hacking practice',
    'new day rp thermite',
    'new day rp minigames',
  ],
  alternates: {
    canonical: 'https://nphacks.net/servers/new-day-rp',
  },
  openGraph: {
    title: 'New Day RP Hacks & Minigame Practice - Lockpick, Thermite & More | NPHacks',
    description:
      'Free, unlimited practice trainers for the hacking minigames used on New Day RP (NDRP) — lockpick, thermite, laundromat and repair kit. Build muscle memory before your next job.',
    url: 'https://nphacks.net/servers/new-day-rp',
  },
};

const trainers = [
  {
    slug: 'lockpick',
    title: 'Lockpick Trainer',
    subtitle: 'Circle / timing minigame',
    description:
      'NDRP vehicle break-ins and locked doors lean on the rotating ps-ui / qb-lock style timing lock. Drill stopping the indicator in the green zone until it is automatic.',
    iconType: 'lucide' as const,
    icon: Key,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
  },
  {
    slug: 'thermite',
    title: 'Thermite Trainer',
    subtitle: 'Chain-reaction grid',
    description:
      'For the higher-tier scores and fortified entries. Practise reading the grid and keeping the chain reaction alive under the clock before you burn a real charge.',
    iconType: 'mdi' as const,
    icon: mdiFuse,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
  },
  {
    slug: 'laundromat',
    title: 'Laundromat Trainer',
    subtitle: 'Symbol-matching grid hack',
    description:
      'A grid memory hack in the same family NDRP uses for decryption-style jobs. Memorise symbol positions and clear matching pairs fast to finish before the timer.',
    iconType: 'mdi' as const,
    icon: mdiWashingMachine,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/20',
  },
  {
    slug: 'repair-kit',
    title: 'Repair Kit Trainer',
    subtitle: 'Precision timing',
    description:
      'The fix-and-flee skill check. Hit the moving indicator on the sweet spot to patch a vehicle mid-chase — the same reflex NDRP repair interactions test.',
    iconType: 'lucide' as const,
    icon: Wrench,
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
  },
];

const faqs = [
  {
    q: 'Are these the exact New Day RP minigames?',
    a: 'These are free, faithful re-creations of the NoPixel-style hacking minigames that QBCore-derived servers like New Day RP use — the rotating timing lockpick (ps-ui / qb-lock mould), the chain-reaction thermite, a symbol-matching grid hack and a precision repair check. They are not affiliated with NDRP, but the mechanics and muscle memory transfer directly to the in-game versions.',
  },
  {
    q: 'Will practising here actually help on NDRP?',
    a: 'Yes. The skills that matter — reading the rotating lock, timing your input, holding a grid pattern in memory and staying calm under a countdown — are identical to what the server asks of you. Players who came to New Day RP from NoPixel reuse the same reflexes, so a few focused sessions noticeably raise your success rate on real jobs.',
  },
  {
    q: 'Which hack should I practise first for New Day RP?',
    a: 'Start with the lockpick trainer, since the circle/timing lock shows up most often in everyday criminal activity like vehicle theft and forced entry. Add the repair-kit trainer for chases, then move to thermite and the laundromat grid hack as you take on bigger scores.',
  },
  {
    q: 'Do I need to log in or pay anything?',
    a: 'No. Every trainer runs in your browser with unlimited attempts, no queue and no account required. Practise as many reps as you want before you jump back onto the server.',
  },
];

export default function NewDayRpServerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1B21] via-[#1a2930] to-[#0F1B21] p-4 md:p-8">
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', path: '/' },
          { name: 'Servers', path: '/servers' },
          { name: 'New Day RP', path: '/servers/new-day-rp' },
        ])}
      />
      <JsonLd data={faqPage(faqs)} />

      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/guides"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-[#54FFA4] transition-colors mb-8 pt-16"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Guides
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-[#54FFA4]/15 rounded-xl">
              <Server className="w-12 h-12 text-[#54FFA4]" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                New Day RP Minigame Practice
              </h1>
              <p className="text-[#54FFA4] text-lg">
                Free lockpick, thermite &amp; hacking trainers for NDRP
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
            <span className="px-2 py-1 bg-[#54FFA4]/15 text-[#54FFA4] rounded-md border border-[#54FFA4]/30">
              FiveM GTA RP
            </span>
            <span className="px-2 py-1 bg-[#1a2930] rounded-md border border-white/10">
              QBCore-derived framework
            </span>
            <span className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              Unlimited free attempts
            </span>
          </div>
        </div>

        {/* About */}
        <section className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-6 md:p-8 mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">What is New Day RP?</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            New Day RP (NDRP) is a long-running FiveM Grand Theft Auto roleplay server with a
            persistent North American player base, a public website, a community wiki and active
            forums. Like many serious RP communities, it grew out of the NoPixel-inspired,
            QBCore-derived ecosystem, so its criminal loop will feel instantly familiar to anyone
            who has played NoPixel or a similar heavy-RP server.
          </p>
          <p className="text-gray-300 leading-relaxed">
            That shared heritage matters for one practical reason: the minigames. When you boost a
            car, force a door, crack into a stash or burn through a secured entry on New Day RP, the
            skill checks you face are built from the same NoPixel-style minigame family used right
            across the QBCore world. The trainers on this page re-create those mechanics so you can
            grind the muscle memory outside the server — no queue, no risk, no cooldown.
          </p>
        </section>

        {/* The minigames */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">
            The hacking minigames NDRP players run into
          </h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            New Day RP&apos;s criminal activities revolve around a handful of recurring skill
            checks. The headline act is the <strong className="text-white">circle / timing
            lockpick</strong> in the ps-ui / qb-lock mould: a marker sweeps around a dial and you
            release it inside a narrow target zone. It gates everyday jobs like vehicle theft and
            breaking-and-entering, so it is the single highest-value thing to practise. Heavier
            scores layer in <strong className="text-white">grid-based hacks</strong> — pattern and
            symbol-matching boards you have to read and clear before a countdown — alongside
            thermite-style charge placement and timing-based repair interactions for getting away
            clean. Each trainer below maps to one of those mechanics.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {trainers.map((t) => (
              <Link key={t.slug} href={`/puzzles/${t.slug}`} className="group">
                <div className="h-full bg-[#1a2930] border-2 border-[#54FFA4]/20 rounded-xl p-6 hover:border-[#54FFA4]/60 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${t.bgColor}`}>
                      {t.iconType === 'mdi' ? (
                        <Icon path={t.icon as string} size={1.5} className={t.color} />
                      ) : (
                        <t.icon className={`w-6 h-6 ${t.color}`} />
                      )}
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-[#54FFA4] group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#54FFA4] transition-colors">
                    {t.title}
                  </h3>
                  <p className="text-[#54FFA4] text-sm mb-3">{t.subtitle}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{t.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* How to practice */}
        <section className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6 md:p-8 mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">
            How to practise for New Day RP
          </h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Treat it like warming up before a session. Open the{' '}
            <Link href="/puzzles/lockpick" className="text-[#54FFA4] hover:text-[#33f58f] underline underline-offset-2">
              lockpick trainer
            </Link>{' '}
            and run reps until you can stop the dial in the zone ten times in a row without
            thinking — that single habit covers the majority of NDRP&apos;s criminal interactions.
            Next, sharpen your getaway reflex on the{' '}
            <Link href="/puzzles/repair-kit" className="text-[#54FFA4] hover:text-[#33f58f] underline underline-offset-2">
              repair-kit trainer
            </Link>
            , then graduate to the{' '}
            <Link href="/puzzles/thermite" className="text-[#54FFA4] hover:text-[#33f58f] underline underline-offset-2">
              thermite
            </Link>{' '}
            and{' '}
            <Link href="/puzzles/laundromat" className="text-[#54FFA4] hover:text-[#33f58f] underline underline-offset-2">
              laundromat
            </Link>{' '}
            grid hacks once the basics are locked in. For deeper breakdowns of every mechanic —
            timing tricks, common mistakes and pro tips — read the full{' '}
            <Link href="/guides" className="text-[#54FFA4] hover:text-[#33f58f] underline underline-offset-2">
              minigame guides
            </Link>
            .
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            Note: these are independent practice tools, not affiliated with or endorsed by New Day
            RP. Server scripts get tuned over time, so always confirm the live behaviour in-game —
            but the core skills you build here carry straight over.
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <ShieldQuestion className="w-7 h-7 text-[#54FFA4]" />
            <h2 className="text-2xl font-bold text-white">Frequently asked questions</h2>
          </div>
          <dl className="space-y-4">
            {faqs.map((item, i) => (
              <div key={i} className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
                <dt className="font-semibold text-white mb-2">{item.q}</dt>
                <dd className="text-gray-300 leading-relaxed">{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-[#54FFA4]/10 to-[#45e894]/10 border-2 border-[#54FFA4]/30 rounded-xl p-8 text-center">
          <BookOpen className="w-12 h-12 text-[#54FFA4] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Ready before your next NDRP job?</h2>
          <p className="text-gray-300 mb-6 max-w-lg mx-auto">
            Start with the lockpick — it is the hack you will use most. Unlimited free attempts, no
            login, no queue.
          </p>
          <Link
            href="/puzzles/lockpick"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#54FFA4] text-[#0F1B21] rounded-lg font-bold hover:bg-[#45e894] transition-all hover:scale-105"
          >
            <Key className="w-5 h-5" />
            Practise the Lockpick Now
          </Link>
        </div>
      </div>
    </div>
  );
}
