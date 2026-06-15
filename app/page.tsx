"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useEffect, useRef } from "react";
import { Target, Trophy, Zap, ArrowRight, BookOpen, Heart } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines } from "@fortawesome/free-solid-svg-icons";
import HomeHeroBanners from "./components/HomeHeroBanners";
import Reveal from "./components/Reveal";

// NoPixel 4.0 Minigames — static data to prevent re-renders
const puzzles = [
  {
    href: "/puzzles/thermite",
    img: "/puzzles/thermite.png?v=3",
    title: "Thermite",
    description: "Replica of the Thermite hack that is triggered when disabling lasers inside the Maze Bank on NoPixel 4.0",
  },
  {
    href: "/puzzles/roof-running",
    img: "/puzzles/roof-running.png?v=3",
    title: "Roof Running",
    description: "Replica of the Roof Running hack that is triggered when robbing AC-Units on NoPixel 4.0"
  },
  {
    href: "/puzzles/laundromat",
    img: "/puzzles/laundromat.png?v=3",
    title: "Laundromat",
    description: "Replica of the Laundromat hack that is triggered when robbing the safe inside the south-side Laundromat on NoPixel 4.0"
  },
  {
    href: "/puzzles/lockpick",
    img: "/puzzles/lockpick.png?v=3",
    title: "LockPick",
    description: "Replica of the LockPick hack that is triggered when lockpicking vehicles, among other things, on NoPixel 4.0"
  },
  {
    href: "/puzzles/repair-kit",
    img: "/puzzles/repair-kit.png?v=3",
    title: "RepairKit",
    description: "Replica of the RepairKit hack that is triggered when repairing vehicles on NoPixel 4.0"
  },
  {
    href: "/puzzles/word-memory",
    img: "/puzzles/word-memory.png?v=3",
    title: "Word Memory",
    description: "Replica of the Word Memory hack that is triggered when hacking the Maze Bank on NoPixel 4.0"
  },
  {
    href: "/puzzles/chopping",
    img: "/puzzles/chopping.png?v=3",
    title: "Chopping",
    description: "Replica of the Chopping hack that is triggered when chopping vehicles on NoPixel 4.0"
  },
  {
    href: "/puzzles/pincracker",
    img: "/puzzles/pincracker.png?v=3",
    title: "PinCracker",
    description: "Replica of the PinCracker hack that is triggered when hacking the Maze Bank on NoPixel 4.0"
  }
] as const;

const features = [
  {
    icon: Target,
    title: "Authentic Experience",
    body: "Pixel-perfect replicas of the NoPixel 4.0 minigames with identical mechanics, visuals, and difficulty. Practice in an environment that mirrors the real thing.",
  },
  {
    icon: Trophy,
    title: "Global Leaderboards",
    body: "Compete with players worldwide. Earn XP from every game, build your daily-challenge streak, and climb the global level and streak rankings.",
  },
  {
    icon: Zap,
    title: "Risk-Free Practice",
    body: "Build muscle memory and sharpen your reaction time with no in-game consequences. Perfect your technique over unlimited attempts.",
  },
] as const;

const faqs = [
  {
    q: "What is NoPixel 4.0?",
    a: "NoPixel 4.0 is the latest version of the most popular Grand Theft Auto V roleplay server, featuring advanced hacking mechanics and challenging minigames that players must master to succeed in various criminal activities.",
  },
  {
    q: "How accurate are these minigame replicas?",
    a: "Our simulators are pixel-perfect replicas with identical mechanics, timing, and difficulty levels to the actual NoPixel 4.0 minigames. We regularly update them to match any changes on the server.",
  },
  {
    q: "Is this practice tool free to use?",
    a: "Yes! All minigames are completely free to play with unlimited practice attempts. No registration or payment required.",
  },
  {
    q: "Which minigames are available?",
    a: "We offer practice for Thermite, Lockpick, Laundromat, Roof Running, Word Memory, PinCracker, Chopping, and RepairKit minigames - all essential skills for NoPixel 4.0 gameplay.",
  },
  {
    q: "Can I compete with other players?",
    a: "Absolutely! Our global leaderboards rank players by level and daily challenge streak. Earn XP and build your streak to climb the rankings and compete with players worldwide.",
  },
  {
    q: "Do I need to download anything?",
    a: "No downloads necessary! The simulator runs entirely in your web browser. Just visit the site and start practicing immediately.",
  },
] as const;

function SectionHeader({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="max-w-2xl">
      <span className="text-xs font-mono uppercase tracking-[0.25em] text-spring-green-400">{eyebrow}</span>
      <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">{title}</h2>
      {sub && <p className="mt-4 text-lg leading-relaxed text-gray-400">{sub}</p>}
    </div>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Preserve original side effects (reveal the nav info icon, mark visited).
  useEffect(() => {
    document.getElementById("info-icon")?.classList.remove("hidden");
    try { sessionStorage.setItem("homePageVisited", "true"); } catch {}
  }, []);

  // Hero parallax — layered background drifts slower than scroll and the hero
  // content lifts + fades out. Passive listener + rAF + GPU transforms only;
  // disabled entirely under prefers-reduced-motion.
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (gridRef.current) gridRef.current.style.transform = `translate3d(0, ${y * 0.3}px, 0)`;
        if (glowRef.current) glowRef.current.style.transform = `translate3d(0, ${y * 0.5}px, 0)`;
        if (heroRef.current) {
          heroRef.current.style.transform = `translate3d(0, ${y * 0.18}px, 0)`;
          heroRef.current.style.opacity = String(Math.max(0, 1 - y / 520));
        }
        raf = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <main className="relative overflow-x-hidden">
      {/* Structured data */}
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "NoPixel 4.0 Hacking Simulator",
            description:
              "Free practice simulator for NoPixel 4.0 GTA RP hacking minigames including Thermite, Lockpick, Laundromat, Roof Running, Word Memory, and more.",
            url: "https://nphacks.net",
            applicationCategory: "GameApplication",
            operatingSystem: "Web Browser",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            screenshot: "https://nphacks.net/images/og-image.png",
            featureList: [
              "Thermite Hacking Practice",
              "Lockpick Training",
              "Laundromat Puzzle Simulator",
              "Roof Running Challenge",
              "Word Memory Game",
              "PinCracker Practice",
              "Chopping Minigame",
              "RepairKit Simulator",
              "Global Leaderboards",
              "Progress Tracking",
            ],
            browserRequirements: "Requires JavaScript. Requires HTML5.",
            softwareVersion: "4.0",
            author: { "@type": "Organization", name: "NoPixel Minigames" },
          }),
        }}
      />
      <Script
        id="faq-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />

      {/* ===================== HERO ===================== */}
      <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4">
        {/* Parallax grid */}
        <div
          ref={gridRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-20 opacity-[0.10]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(9,222,110,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(9,222,110,0.6) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse at center, black 25%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 25%, transparent 75%)",
          }}
        />
        {/* Parallax glow orbs */}
        <div ref={glowRef} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-[26%] h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-spring-green-500/10 blur-[130px]" />
          <div className="absolute bottom-[8%] right-[14%] h-72 w-72 rounded-full bg-aquamarine-500/10 blur-[110px]" />
        </div>

        <div ref={heroRef} className="relative z-10 mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-spring-green-500/30 bg-spring-green-500/5 px-4 py-1.5 text-xs font-mono uppercase tracking-[0.2em] text-spring-green-300">
            <span className="h-1.5 w-1.5 rounded-full bg-spring-green-400 animate-pulse" />
            NoPixel 4.0 · FiveM · GTA RP
          </span>

          <h1 className="mt-7">
            <span className="sr-only">NoPixel 4.0 Minigames — free hacking practice trainers for FiveM and GTA RP</span>
            <span
              aria-hidden="true"
              className="block animate-gradient-flow bg-clip-text text-6xl font-black text-transparent sm:text-7xl md:text-8xl"
              style={{
                fontFamily: "var(--font-orbitron)",
                letterSpacing: "0.04em",
                backgroundImage: "linear-gradient(90deg, #09de6e, #64ffda, #40e0d0, #09de6e)",
                backgroundSize: "200% 100%",
              }}
            >
              NOPIXEL 4.0
            </span>
            <span
              aria-hidden="true"
              className="mt-1 block text-3xl text-gray-400 sm:text-4xl md:text-5xl"
              style={{ fontFamily: "var(--font-caveat)", fontWeight: 600 }}
            >
              Hacking Simulator
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300/90 sm:text-xl">
            Free, browser-based practice trainers for every NoPixel 4.0 hacking minigame — Lockpick, Thermite,
            Laundromat and more. Authentic mechanics, no download.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#games"
              className="group inline-flex items-center gap-2 rounded-full bg-spring-green-400 px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-mirage-950 shadow-lg shadow-spring-green-500/20 transition-all duration-300 hover:scale-[1.03] hover:bg-spring-green-300"
            >
              Start practicing
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <Link
              href="/guides"
              className="group inline-flex items-center gap-2 rounded-full border border-spring-green-500/30 bg-white/[0.02] px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-spring-green-300 transition-all duration-300 hover:border-spring-green-400/60 hover:bg-spring-green-500/5"
            >
              <BookOpen className="h-4 w-4" />
              Browse guides
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-gray-500">
            <span><strong className="font-semibold text-gray-300">8</strong> minigames</span>
            <span className="text-spring-green-500/40">/</span>
            <span>Daily challenge</span>
            <span className="text-spring-green-500/40">/</span>
            <span>1v1 head-to-head</span>
          </div>
        </div>

        {/* Scroll cue */}
        <div aria-hidden="true" className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-spring-green-500/60">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Scroll</span>
          <span className="h-8 w-px animate-pulse bg-gradient-to-b from-spring-green-400/70 to-transparent" />
        </div>
      </section>

      {/* ===================== BODY ===================== */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="pt-6">
          <HomeHeroBanners />
        </div>

        {/* Games */}
        <Reveal as="section" id="games" className="scroll-mt-24 py-16 sm:py-24">
          <SectionHeader
            eyebrow="The Minigames"
            title="Choose your hack"
            sub="Eight authentic NoPixel 4.0 trainers — pick one and start building muscle memory. Free, instant, and no download."
          />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {puzzles.map((puzzle, index) => (
              <Reveal key={puzzle.href} delay={(index % 4) * 80} className="h-full">
                <Link href={puzzle.href} className="group flex h-full">
                  <div
                    className="relative w-full overflow-hidden rounded-lg border border-spring-green-500/20 bg-gradient-to-br from-mirage-900/50 via-mirage-900/40 to-mirage-800/50 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-spring-green-400/60 hover:shadow-xl hover:shadow-spring-green-500/10"
                    style={{ minHeight: "320px", display: "flex", flexDirection: "column" }}
                  >
                    {/* Sleek corner brackets */}
                    <div className="absolute left-0 top-0 h-6 w-6 border-l border-t border-spring-green-500/30 transition-colors duration-300 group-hover:border-spring-green-400/80" />
                    <div className="absolute right-0 top-0 h-6 w-6 border-r border-t border-spring-green-500/30 transition-colors duration-300 group-hover:border-spring-green-400/80" />
                    <div className="absolute bottom-0 left-0 h-6 w-6 border-b border-l border-spring-green-500/30 transition-colors duration-300 group-hover:border-spring-green-400/80" />
                    <div className="absolute bottom-0 right-0 h-6 w-6 border-b border-r border-spring-green-500/30 transition-colors duration-300 group-hover:border-spring-green-400/80" />
                    <div className="absolute left-6 right-6 top-0 h-px bg-gradient-to-r from-transparent via-spring-green-500/20 to-transparent transition-colors duration-300 group-hover:via-spring-green-400/40" />

                    <div className="relative h-44 flex-shrink-0 p-4 pb-2">
                      <div
                        aria-hidden="true"
                        className="absolute inset-4 rounded-md bg-[radial-gradient(ellipse_at_center,rgba(84,255,164,0.10),transparent_70%)] opacity-60 transition-opacity duration-500 group-hover:opacity-100"
                      />
                      <Image
                        src={puzzle.img}
                        alt={puzzle.title}
                        width={400}
                        height={225}
                        priority={index < 4}
                        loading={index < 4 ? "eager" : "lazy"}
                        className="relative h-full w-full object-contain transition-all duration-500 ease-out [filter:drop-shadow(0_6px_14px_rgba(0,0,0,0.5))] group-hover:-translate-y-1 group-hover:[filter:drop-shadow(0_14px_28px_rgba(84,255,164,0.25))_drop-shadow(0_6px_14px_rgba(0,0,0,0.4))] group-hover:[transform:translateY(-4px)_perspective(800px)_rotateX(4deg)]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    </div>

                    <div className="flex flex-grow flex-col space-y-1 p-3">
                      <div className="relative pb-0.5">
                        <h3 className="font-mono text-lg font-bold tracking-wide text-white transition-colors duration-300 group-hover:text-spring-green-300">
                          {puzzle.title}
                        </h3>
                        <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-spring-green-400 to-transparent transition-all duration-300 group-hover:w-full" />
                      </div>

                      <p className="flex-grow text-xs leading-snug text-gray-400 transition-colors duration-300 group-hover:text-gray-300">
                        {puzzle.description}
                      </p>

                      <div className="flex items-center justify-between pt-0.5">
                        <span className="inline-flex items-center font-mono text-xs font-semibold tracking-wider text-spring-green-400 group-hover:text-spring-green-300">
                          <span className="mr-1.5 text-sm text-spring-green-500/60">›</span>
                          LAUNCH
                          <svg className="ml-1.5 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </span>
                        <div className="flex items-center gap-1">
                          <div className="h-1 w-1 rounded-full bg-spring-green-400 opacity-60" />
                          <div className="h-1 w-1 rounded-full bg-spring-green-400 opacity-80" />
                          <div className="h-1 w-1 animate-pulse rounded-full bg-spring-green-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Reveal>

        {/* Features */}
        <Reveal as="section" className="py-16 sm:py-24">
          <SectionHeader eyebrow="Why nphacks" title="Practice that actually transfers" />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="group rounded-2xl border border-spring-green-500/15 bg-mirage-900/40 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-spring-green-500/40 hover:shadow-lg hover:shadow-spring-green-900/20"
              >
                <Icon className="h-10 w-10 text-spring-green-400 transition-transform duration-300 group-hover:scale-110" />
                <h3 className="mt-5 text-xl font-bold text-white">{title}</h3>
                <p className="mt-3 leading-relaxed text-gray-400">{body}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* About */}
        <Reveal as="section" className="py-16 sm:py-24">
          <div className="rounded-3xl border border-spring-green-500/15 bg-gradient-to-br from-mirage-900/60 to-mirage-950/60 p-8 sm:p-12">
            <SectionHeader eyebrow="About" title="The complete NoPixel 4.0 hacks trainer" />
            <div className="mt-6 max-w-3xl space-y-4 text-lg leading-relaxed text-gray-300">
              <p>
                Welcome to the most comprehensive NoPixel 4.0 hacking simulator available online. This platform provides
                authentic replicas of the challenging minigames featured in the popular Grand Theft Auto V roleplay server,
                NoPixel. Whether you&apos;re a seasoned criminal looking to hone your skills or a curious newcomer wanting to
                experience the thrill of virtual heists, this simulator offers the perfect training ground.
              </p>
              <p>
                NoPixel is renowned for its intricate and demanding hacking mechanics that add an exciting layer of challenge
                to various criminal activities within the game. From breaking into high-security facilities to cracking
                advanced security systems, each minigame requires precision, quick thinking, and practice. Our simulator
                recreates these experiences with pixel-perfect accuracy, letting you practice and improve without the
                pressure of in-game consequences.
              </p>
              <p>
                Each minigame has been carefully crafted to match the look, feel, and mechanics of the original NoPixel 4.0
                implementations. Test your reflexes with the Thermite hack, demonstrate your pattern recognition with the
                Word Memory challenge, or prove your coordination with the Roof Running game. Level up as you play and
                compete with players around the world.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Leaderboards */}
        <Reveal as="section" className="py-16 sm:py-24">
          <div className="rounded-3xl border border-spring-green-500/15 bg-mirage-900/40 p-8 text-center sm:p-12">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Climb the global leaderboards</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
              Earn XP from every game, build your daily streak, and rank up. Visit the{" "}
              <Link href="/leaderboards" className="font-semibold text-spring-green-400 underline hover:text-spring-green-300">
                Leaderboards
              </Link>{" "}
              to see the top players by level and daily streak.
            </p>
          </div>
        </Reveal>

        {/* Community */}
        <Reveal as="section" className="py-16 sm:py-24">
          <div className="rounded-3xl border border-spring-green-500/15 bg-mirage-900/40 p-8 sm:p-12">
            <SectionHeader eyebrow="Open source" title="Built with the community" />
            <div className="mt-6 max-w-3xl space-y-4 text-lg leading-relaxed text-gray-300">
              <p>
                This project is completely open source and available on GitHub. We welcome contributions from the
                community — whether it&apos;s bug reports, feature suggestions, or code. The codebase is built with modern web
                technologies including Next.js, React, and TypeScript, making it easy for developers to understand and
                contribute.
              </p>
              <p>
                If you find this simulator helpful, consider starring the repository on GitHub or sharing it with your
                fellow NoPixel enthusiasts. Your support helps us keep improving and maintaining this free resource for the
                community.
              </p>
            </div>
            <div className="mt-6">
              <Link
                href="https://github.com/MaximilianAdF/NoPixel-MiniGames-4.0"
                className="group inline-flex items-center gap-2 rounded-lg border border-mirage-700 bg-mirage-800 px-6 py-3 font-semibold text-spring-green-300 transition-all duration-300 hover:scale-105 hover:border-spring-green-600 hover:bg-mirage-700 hover:text-spring-green-400"
                target="_blank"
              >
                <FontAwesomeIcon icon={faFileLines} className="size-5 transition-transform duration-300 group-hover:rotate-12" />
                View on GitHub
              </Link>
            </div>
          </div>
        </Reveal>

        {/* FAQ */}
        <Reveal as="section" className="py-16 sm:py-24">
          <SectionHeader eyebrow="FAQ" title="Frequently asked questions" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-2xl border border-spring-green-500/15 bg-mirage-900/40 p-6 transition-colors duration-300 hover:border-spring-green-500/40">
                <h3 className="text-lg font-bold text-white">{f.q}</h3>
                <p className="mt-2 leading-relaxed text-gray-400">{f.a}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mx-auto mt-12 w-full max-w-6xl border-t-2 border-spring-green-500/30 px-4 py-12 text-center text-gray-500 sm:px-6 lg:px-8">
        <p className="text-sm transition-colors duration-300 hover:text-gray-400">
          This is a fan-made simulator and is not affiliated with NoPixel or Rockstar Games. All trademarks belong to their
          respective owners.
        </p>
        <p className="mt-2 flex items-center justify-center gap-2 text-sm transition-colors duration-300 hover:text-gray-400">
          Built with <Heart className="h-4 w-4 fill-red-500 text-red-500" /> for the NoPixel community
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
          <Link href="/about" className="transition-colors duration-300 hover:text-spring-green-400">About</Link>
          <span className="text-gray-700">•</span>
          <Link href="/privacy" className="transition-colors duration-300 hover:text-spring-green-400">Privacy Policy</Link>
          <span className="text-gray-700">•</span>
          <Link href="/terms" className="transition-colors duration-300 hover:text-spring-green-400">Terms of Service</Link>
          <span className="text-gray-700">•</span>
          <Link href="/contact" className="transition-colors duration-300 hover:text-spring-green-400">Contact</Link>
          <span className="text-gray-700">•</span>
          <Link href="/faq" className="transition-colors duration-300 hover:text-spring-green-400">FAQ</Link>
        </div>
      </footer>
    </main>
  );
}
