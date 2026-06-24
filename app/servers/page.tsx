import { Server, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import JsonLd from '@/app/components/JsonLd';
import { breadcrumbList } from '@/lib/structuredData';

export const metadata: Metadata = {
  title: 'NoPixel-Style FiveM Server Minigames - Free Lockpick & Hacking Practice',
  description:
    'Practise the lockpick, thermite and NoPixel-style hacking minigames used by popular FiveM GTA RP servers. Free, unlimited browser trainers for Prodigy RP, New Day RP and more — no download, no queue.',
  keywords: [
    'fivem server minigames',
    'nopixel style lockpick practice',
    'fivem hacking practice',
    'prodigy rp minigames',
    'new day rp minigames',
    'gta rp lockpick trainer',
  ],
  alternates: {
    canonical: 'https://nphacks.net/servers',
  },
  openGraph: {
    title: 'NoPixel-Style FiveM Server Minigames - Free Lockpick & Hacking Practice',
    description:
      'Free, unlimited browser trainers for the lockpick, thermite and hacking minigames used by popular FiveM GTA RP servers like Prodigy RP and New Day RP.',
    url: 'https://nphacks.net/servers',
  },
};

// Server landing pages — each maps the site's trainers onto a specific FiveM
// community's criminal loop. Blurbs double as the crawlable card copy.
const servers = [
  {
    slug: 'prodigy-rp',
    name: 'Prodigy RP',
    blurb:
      "Prodigy RP — practise the timing lockpick and NoPixel-style heist hacks used by one of FiveM's largest GTA RP servers, free in your browser.",
  },
  {
    slug: 'new-day-rp',
    name: 'New Day RP (NDRP)',
    blurb:
      "New Day RP (NDRP): free trainers for the NoPixel-style lockpick, thermite and grid hacks used across NDRP's criminal jobs.",
  },
];

export default function ServersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1B21] via-[#1a2930] to-[#0F1B21] p-4 md:p-8">
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', path: '/' },
          { name: 'Servers', path: '/servers' },
        ])}
      />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Server className="w-12 h-12 text-[#54FFA4]" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              FiveM Server Minigames
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Popular FiveM GTA roleplay servers build their criminal loops on the same NoPixel-style
            hacking minigames — the timing lockpick, thermite, grid decrypts and precision repairs.
            Pick your server below and drill those exact mechanics for free before your next job.
          </p>
        </div>

        {/* Intro */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-6 md:p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#54FFA4]" />
            Practice once, play anywhere
          </h2>
          <p className="text-gray-300 leading-relaxed">
            Because so many GTA RP servers share the QBCore- and NoPixel-derived minigame family, the
            reflexes you build here transfer almost one-to-one. These server pages map our free
            browser trainers onto each community&apos;s lockpick, heist and chop-shop hacks so you
            know exactly what to practise. Every trainer runs in your browser with unlimited
            attempts — no download, no account and no server queue.
          </p>
        </div>

        {/* Server cards */}
        <h2 className="text-2xl font-bold text-white mb-6">Choose your server</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {servers.map((server) => (
            <Link key={server.slug} href={`/servers/${server.slug}`} className="group">
              <div className="h-full bg-[#1a2930] border-2 border-[#54FFA4]/20 rounded-xl p-6 hover:border-[#54FFA4]/60 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-[#54FFA4]/15">
                    <Server className="w-6 h-6 text-[#54FFA4]" />
                  </div>
                  <span className="text-[#54FFA4] flex items-center gap-1 text-sm group-hover:gap-2 transition-all">
                    Open <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#54FFA4] transition-colors">
                  {server.name}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{server.blurb}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Don&apos;t see your server?</h2>
          <p className="text-gray-400 mb-6 max-w-lg mx-auto">
            The core hacks are the same across the NoPixel ecosystem. Jump straight into the full
            set of minigame guides and trainers to start practising now.
          </p>
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#54FFA4] text-[#0F1B21] rounded-lg font-bold hover:bg-[#45e894] transition-all hover:scale-105"
          >
            <ArrowRight className="w-5 h-5" />
            Browse All Guides
          </Link>
        </div>
      </div>
    </div>
  );
}
