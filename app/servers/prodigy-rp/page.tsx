import { ArrowLeft, ArrowRight, Key, Zap, Wrench, Keyboard, Blocks, Server, Car, ShieldCheck, Gamepad2, BookOpen } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import JsonLd from '@/app/components/JsonLd';
import { breadcrumbList, faqPage } from '@/lib/structuredData';

export const metadata: Metadata = {
  title: 'Prodigy RP Hacks & Minigame Practice - Free Lockpick & Hacking Trainers',
  description:
    'Practise the Prodigy RP hacking minigames for free in your browser. Drill the timing lockpick, thermite-style heist grid, safe-cracking, repair and chop-shop hacks before you grind the criminal loop on Prodigy RP.',
  keywords: [
    'prodigy rp lockpick practice',
    'prodigy rp hack practice',
    'prodigy rp lockpick minigame',
    'how to lockpick prodigy rp',
    'prodigy rp lockpick trainer',
    'prodigy rp thermite practice',
    'prodigy rp hacking practice',
  ],
  alternates: {
    canonical: 'https://nphacks.net/servers/prodigy-rp',
  },
  openGraph: {
    title: 'Prodigy RP Hacks & Minigame Practice - Free Lockpick & Hacking Trainers',
    description:
      'Practise the Prodigy RP hacking minigames for free in your browser — the timing lockpick, thermite-style heist grid, safe-cracking, repair and chop-shop hacks.',
    url: 'https://nphacks.net/servers/prodigy-rp',
  },
};

// Trainers on this site that map onto Prodigy RP's criminal loop.
const trainers = [
  {
    slug: 'lockpick',
    title: 'Lockpick Trainer',
    subtitle: 'Vehicle entry',
    description:
      "Rehearse the rotating-lock timing minigame Prodigy uses to break into cars. Same OSU-style rhythm, unlimited free attempts.",
    icon: Key,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
  },
  {
    slug: 'thermite',
    title: 'Thermite Trainer',
    subtitle: 'Heist grid hack',
    description:
      'Drill the 4.0 chain-reaction grid hack that fronts robberies and vault jobs. Keep the chain alive and hit the target before time runs out.',
    icon: Zap,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
  },
  {
    slug: 'laundromat',
    title: 'Laundromat Trainer',
    subtitle: 'Symbol-match decrypt',
    description:
      'Practise the symbol-matching decrypt that turns up on money and data jobs — memorise pairs and clear the grid fast.',
    icon: Blocks,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/20',
  },
  {
    slug: 'repair-kit',
    title: 'Repair Kit Trainer',
    subtitle: 'Precision timing',
    description:
      'Nail the sweet-spot timing repair used to patch gear and vehicles mid-job. One clean click beats five panicked ones.',
    icon: Wrench,
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
  },
  {
    slug: 'chopping',
    title: 'Chopping Trainer',
    subtitle: 'VIN-scratch typing',
    description:
      'Build the typing speed and accuracy that chop-shop VIN scratching rewards so you can clear stolen vehicles quickly.',
    icon: Keyboard,
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
  },
];

const faqs = [
  {
    q: 'Is this an official Prodigy RP tool?',
    a: "No. These are free, fan-made practice trainers and we are not affiliated with or endorsed by Prodigy RP. They recreate the same style of hacking minigames so you can rehearse the timing and patterns off-server before you play.",
  },
  {
    q: 'Does the Prodigy RP lockpick work the same as the trainer here?',
    a: "Yes for practice purposes. Prodigy RP uses a timing- and rhythm-based ('OSU-style') vehicle lockpick, which is the same precision skill our rotating-lock lockpick trainer builds. The exact art and tolerances can differ slightly, but the muscle memory transfers directly.",
  },
  {
    q: 'Which minigames should I practise for Prodigy RP heists?',
    a: 'Start with the lockpick for vehicle entry, then the thermite-style grid hack used on robberies and vaults. Add the laundromat decrypt, the repair-kit timing and the chopping typing drill to cover the rest of the criminal loop.',
  },
  {
    q: 'Do I need to download anything or join the server to practise?',
    a: 'No. Every trainer runs in your browser with unlimited free attempts — no FiveM, no download and no Prodigy RP account required. Practise here, then take the timing into the server.',
  },
  {
    q: 'Will practising here get me banned on Prodigy RP?',
    a: "No. These trainers are standalone web games that never touch FiveM, the Prodigy RP server or your game files. They simply build the same reflexes and patterns, the same way you'd practise any skill before doing it for real.",
  },
];

export default function ProdigyRpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1B21] via-[#1a2930] to-[#0F1B21] p-4 md:p-8">
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', path: '/' },
          { name: 'Servers', path: '/servers' },
          { name: 'Prodigy RP', path: '/servers/prodigy-rp' },
        ])}
      />
      <JsonLd data={faqPage(faqs)} />

      <div className="max-w-4xl mx-auto">
        {/* Back link */}
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
            <div className="p-4 bg-[#54FFA4]/15 rounded-xl">
              <Server className="w-12 h-12 text-[#54FFA4]" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Prodigy RP Hacks &amp; Minigame Practice
              </h1>
              <p className="text-[#54FFA4] text-lg">
                Free browser trainers for the Prodigy RP criminal loop
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
            <span className="px-2 py-1 bg-[#54FFA4]/10 text-[#54FFA4] rounded-md border border-[#54FFA4]/30">
              FiveM GTA RP
            </span>
            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-md border border-yellow-500/30">
              Lockpick + hacking
            </span>
            <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-md border border-orange-500/30">
              Unlimited free attempts
            </span>
          </div>
        </div>

        {/* What is Prodigy RP */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#54FFA4]" />
            What is Prodigy RP?
          </h2>
          <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6 space-y-4">
            <p className="text-gray-300 leading-relaxed">
              Prodigy RP is one of the largest GTA V roleplay servers on FiveM. It broke out in 2025 as the community&apos;s &quot;rising star,&quot; rebounding hard with a 4.0-era overhaul and regularly filling large North American queues. Rather than running a stock base, Prodigy is built on its own custom framework — and the team now sells those systems to other communities through Prodigy Studios, with builds that support ESX, QBCore and QBox.
            </p>
            <p className="text-gray-300 leading-relaxed">
              For anyone grinding the criminal side, the important detail is that Prodigy&apos;s robbery and heist loop is built on the same family of hacking minigames popularised by NoPixel. The timing lockpick, the grid hacks and the precision repairs all follow that template, which means the reflexes and patterns you build here transfer to Prodigy almost one-to-one. Every trainer on this page is free, runs in your browser and is designed to remove the &quot;I&apos;ve never seen this before&quot; panic when a cop is bearing down on you in-server.
            </p>
          </div>
        </section>

        {/* The minigames */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <Car className="w-6 h-6 text-[#54FFA4]" />
            The hacking minigames Prodigy RP uses
          </h2>
          <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6 space-y-4">
            <p className="text-gray-300 leading-relaxed">
              <strong className="text-white">Vehicle lockpicking</strong> on Prodigy RP is a timing- and rhythm-based, &quot;OSU-style&quot; minigame: an indicator sweeps a rotating lock and you have to commit your input inside the sweet spot. That is the exact precision skill our{' '}
              <Link href="/puzzles/lockpick" className="text-[#54FFA4] hover:text-[#45e894] underline underline-offset-2">
                lockpick trainer
              </Link>{' '}
              recreates, and it is the single most-searched &quot;how to lockpick Prodigy RP&quot; question for a reason.
            </p>
            <p className="text-gray-300 leading-relaxed">
              <strong className="text-white">How to lockpick on Prodigy RP:</strong> let the indicator complete a full sweep before you commit so you learn its speed, then press as it enters — not when it sits on — the highlighted zone, to cover input delay. The sweep speed stays constant within an attempt, so once you find the rhythm for the first pin the same beat clears the rest. Spamming inputs only burns attempts and risks snapping the pick; one deliberate, well-timed press is worth five panicked ones.
            </p>
            <p className="text-gray-300 leading-relaxed">
              <strong className="text-white">Robbery and heist hacks</strong> lean on the NoPixel-style toolkit: a thermite-style chain-reaction{' '}
              <Link href="/puzzles/thermite" className="text-[#54FFA4] hover:text-[#45e894] underline underline-offset-2">
                grid hack
              </Link>
              , symbol-matching decrypts like the{' '}
              <Link href="/puzzles/laundromat" className="text-[#54FFA4] hover:text-[#45e894] underline underline-offset-2">
                laundromat
              </Link>{' '}
              puzzle, and sweet-spot{' '}
              <Link href="/puzzles/repair-kit" className="text-[#54FFA4] hover:text-[#45e894] underline underline-offset-2">
                timing repairs
              </Link>{' '}
              for fixing gear and vehicles under pressure. On the chop-shop side, clearing stolen cars rewards fast, accurate typing — exactly what the{' '}
              <Link href="/puzzles/chopping" className="text-[#54FFA4] hover:text-[#45e894] underline underline-offset-2">
                chopping
              </Link>{' '}
              VIN-scratch trainer drills.
            </p>
            <p className="text-gray-300 leading-relaxed">
              <strong className="text-white">How to practise them:</strong> work one mechanic at a time. Run the lockpick until you can clear ten in a row, then move to thermite and learn to read the board a move ahead. Layer in the laundromat for memory, the repair kit for nerve, and chopping for raw speed. Because each trainer is unlimited and pressure-free, you can build the timing calmly here and save the adrenaline for the actual job on Prodigy. For deeper, mechanic-by-mechanic breakdowns, the full{' '}
              <Link href="/guides" className="text-[#54FFA4] hover:text-[#45e894] underline underline-offset-2">
                minigame guides
              </Link>{' '}
              cover strategy, common mistakes and pro tips.
            </p>
          </div>
        </section>

        {/* Trainer cards */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Gamepad2 className="w-6 h-6 text-[#54FFA4]" />
            Practice the Prodigy RP minigames
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {trainers.map((t) => (
              <Link key={t.slug} href={`/puzzles/${t.slug}`} className="group">
                <div className="h-full bg-[#1a2930] border-2 border-[#54FFA4]/20 rounded-xl p-6 hover:border-[#54FFA4]/60 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${t.bgColor}`}>
                      <t.icon className={`w-6 h-6 ${t.color}`} />
                    </div>
                    <span className="text-[#54FFA4] flex items-center gap-1 text-sm group-hover:gap-2 transition-all">
                      Practice <ArrowRight className="w-4 h-4" />
                    </span>
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

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-[#54FFA4]" />
            Prodigy RP practice FAQ
          </h2>
          <div className="bg-[#1a2930] border border-[#54FFA4]/20 rounded-xl p-6">
            <dl className="space-y-6">
              {faqs.map((item, i) => (
                <div key={i}>
                  <dt className="font-semibold text-white">{item.q}</dt>
                  <dd className="mt-1 text-gray-300 leading-relaxed">{item.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-[#54FFA4]/10 to-[#45e894]/10 border-2 border-[#54FFA4]/30 rounded-xl p-8 text-center">
          <Key className="w-12 h-12 text-[#54FFA4] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Ready for the Prodigy RP grind?</h2>
          <p className="text-gray-300 mb-6 max-w-lg mx-auto">
            Lock in the lockpick timing first, then work through the rest of the hacking minigames. Unlimited free attempts, no download, no server required.
          </p>
          <Link
            href="/puzzles/lockpick"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#54FFA4] text-[#0F1B21] rounded-lg font-bold hover:bg-[#45e894] transition-all hover:scale-105"
          >
            <Key className="w-5 h-5" />
            Practice the Lockpick Now
          </Link>
        </div>
      </div>
    </div>
  );
}
