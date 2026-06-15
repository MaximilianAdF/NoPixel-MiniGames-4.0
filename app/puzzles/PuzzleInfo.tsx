import Link from 'next/link';
import JsonLd from '@/app/components/JsonLd';
import { faqPage } from '@/lib/structuredData';
import { PUZZLE_CONTENT } from '@/lib/puzzleContent';

const GAME_LABELS: Record<string, string> = {
  lockpick: 'Lockpick',
  thermite: 'Thermite',
  laundromat: 'Laundromat',
  'roof-running': 'Roof Running',
  pincracker: 'PinCracker',
  'repair-kit': 'Repair Kit',
  'word-memory': 'Word Memory',
  chopping: 'Chopping',
};

// Crawlable info + FAQ rendered below the (interactive) game. It sits after the
// viewport-height game wrapper in normal flow, so it never overlaps or steals
// focus/keyboard from gameplay — it's only reached by scrolling.
export default function PuzzleInfo({ game }: { game: string }) {
  const c = PUZZLE_CONTENT[game];
  if (!c) return null;

  const linkClass =
    'text-spring-green-400 hover:text-spring-green-300 underline underline-offset-2 transition-colors';

  return (
    <section
      aria-labelledby={`about-${game}`}
      className="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-6 pb-20 text-gray-300"
    >
      <div className="border-t border-spring-green-500/15 pt-10">
        <h2 id={`about-${game}`} className="text-2xl font-bold text-white">
          About the {c.name} minigame
        </h2>
        <p className="mt-3 leading-relaxed">{c.intro}</p>

        <h3 className="mt-8 text-xl font-semibold text-white">
          How the {c.name} minigame works
        </h3>
        <p className="mt-3 leading-relaxed">{c.howItWorks}</p>

        <h3 className="mt-8 text-xl font-semibold text-white">Tips to improve</h3>
        <ul className="mt-3 space-y-2 list-disc pl-5 marker:text-spring-green-500/60">
          {c.tips.map((tip, i) => (
            <li key={i} className="leading-relaxed">
              {tip}
            </li>
          ))}
        </ul>

        <h3 className="mt-8 text-xl font-semibold text-white">
          Frequently asked questions
        </h3>
        <dl className="mt-3 space-y-5">
          {c.faq.map((item, i) => (
            <div key={i}>
              <dt className="font-semibold text-white">{item.q}</dt>
              <dd className="mt-1 leading-relaxed">{item.a}</dd>
            </div>
          ))}
        </dl>

        <nav
          aria-label={`Related to ${c.name}`}
          className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm"
        >
          <Link href={`/guides/${game}`} className={linkClass}>
            Full {c.name} guide
          </Link>
          {c.related.map((slug) => (
            <Link key={slug} href={`/puzzles/${slug}`} className={linkClass}>
              {GAME_LABELS[slug] ?? slug} minigame
            </Link>
          ))}
          <Link href="/daily-challenge" className={linkClass}>
            Daily challenge
          </Link>
          <Link href="/lobby" className={linkClass}>
            1v1 mode
          </Link>
        </nav>
      </div>

      <JsonLd data={faqPage(c.faq)} />
    </section>
  );
}
