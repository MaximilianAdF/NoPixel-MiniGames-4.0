import type { Metadata } from 'next';
import Link from 'next/link';
import { Target, ArrowLeft, Shield, Gamepad2, AlertTriangle, Map, Users, DollarSign } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Complete Guide to NoPixel 4.0 Heists - Planning, Hacks & Execution',
    description: 'Everything you need to know about NoPixel 4.0 heists. Learn which hacking minigames each heist requires, how to plan crew roles, and strategies for successful bank robberies.',
    keywords: ['NoPixel heist guide', 'GTA RP bank robbery', 'NoPixel 4.0 heists', 'Fleeca bank hack', 'Pacific Standard heist', 'NoPixel criminal guide'],
    alternates: {
        canonical: 'https://nphacks.net/guides/nopixel-heist-guide',
    },
    openGraph: {
        title: 'Complete Guide to NoPixel 4.0 Heists - Planning, Hacks & Execution',
        description: 'Everything you need to plan and execute successful heists in NoPixel 4.0, from Fleeca Banks to the Pacific Standard vault.',
        url: 'https://nphacks.net/guides/nopixel-heist-guide',
    },
};

export default function HeistGuidePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0F1B21] via-[#1a2930] to-[#0F1B21] p-4 md:p-8">
            <div className="max-w-3xl mx-auto">
                {/* Navigation */}
                <div className="pt-16 mb-8">
                    <Link href="/guides" className="inline-flex items-center gap-2 text-[#54FFA4] hover:text-[#45e894] transition-colors text-sm font-medium">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Guides
                    </Link>
                </div>

                {/* Article Header */}
                <header className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded border text-yellow-400 border-yellow-400/30 bg-yellow-400/10">Intermediate</span>
                        <span className="text-xs text-gray-500">10 min read</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                        Complete Guide to NoPixel 4.0 Heists
                    </h1>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        From your first Fleeca Bank to the legendary Pacific Standard vault — everything you need to know
                        about planning, preparing, and executing successful heists in NoPixel 4.0.
                    </p>
                </header>

                {/* Article Content */}
                <article className="prose prose-invert max-w-none space-y-8">

                    {/* Section 1: Overview */}
                    <section className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Map className="w-6 h-6 text-[#54FFA4]" />
                            <h2 className="text-2xl font-bold text-white">The Heist Landscape in NoPixel 4.0</h2>
                        </div>
                        <div className="space-y-4 text-gray-300 leading-relaxed">
                            <p>
                                Heists are the pinnacle of criminal activity in NoPixel 4.0. They represent the highest-risk, highest-reward
                                activities available to players, requiring days of planning, significant resource investment, and most importantly,
                                mastery of the various hacking minigames that gate access to the valuables.
                            </p>
                            <p>
                                The heist ecosystem in NoPixel 4.0 is structured as a progression system. New criminals start with small-scale
                                activities like store robberies and work their way up through increasingly complex targets. Each tier requires
                                higher skill levels, more crew members, and better equipment — but the payouts scale proportionally.
                            </p>
                            <p>
                                Understanding this progression is crucial because each heist type requires specific hacking skills. Investing
                                time in practicing the right minigames for your current targets ensures you are not the weak link in your crew&apos;s
                                operation.
                            </p>
                        </div>
                    </section>

                    {/* Section 2: Heist Tiers */}
                    <section className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <DollarSign className="w-6 h-6 text-[#54FFA4]" />
                            <h2 className="text-2xl font-bold text-white">Heist Tiers and Required Hacks</h2>
                        </div>
                        <div className="space-y-6 text-gray-300 leading-relaxed">
                            <p>
                                Each heist location in NoPixel 4.0 requires different combinations of hacking minigames. Here is a breakdown
                                of the major heist targets and what skills you&apos;ll need:
                            </p>

                            <div className="bg-[#0F1B21]/50 rounded-lg p-5 border border-green-500/20">
                                <h3 className="text-xl font-semibold text-green-400 mb-3">Tier 1: Store Robberies & Small Jobs</h3>
                                <p className="text-sm mb-3">
                                    The entry point for criminal activities. These jobs have lower security systems and modest payouts,
                                    but they are where every criminal career begins.
                                </p>
                                <div className="text-sm">
                                    <p className="font-medium text-white mb-1">Required Hacks:</p>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li><strong>Lockpick</strong> — For bypassing door locks and display cases</li>
                                        <li><strong>Chopping</strong> — For vehicle theft operations (chop shop)</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-[#0F1B21]/50 rounded-lg p-5 border border-yellow-500/20">
                                <h3 className="text-xl font-semibold text-yellow-400 mb-3">Tier 2: Fleeca Bank Robberies</h3>
                                <p className="text-sm mb-3">
                                    The classic entry-level bank heist. Fleeca Banks are spread across Los Santos and require a small crew
                                    of 2-4 people. The security systems are notable but manageable with practice.
                                </p>
                                <div className="text-sm">
                                    <p className="font-medium text-white mb-1">Required Hacks:</p>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li><strong>Thermite</strong> (Beginner-Intermediate) — For disabling the vault security</li>
                                        <li><strong>Lockpick</strong> — For safety deposit boxes</li>
                                        <li><strong>PinCracker</strong> — For electronic access codes</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-[#0F1B21]/50 rounded-lg p-5 border border-orange-500/20">
                                <h3 className="text-xl font-semibold text-orange-400 mb-3">Tier 3: Paleto Bay Bank</h3>
                                <p className="text-sm mb-3">
                                    A step up from Fleeca with significantly higher security. Located in the northern part of the map,
                                    Paleto heists require 4-6 crew members and strong hacking skills. The remote location adds complexity
                                    to escape planning.
                                </p>
                                <div className="text-sm">
                                    <p className="font-medium text-white mb-1">Required Hacks:</p>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li><strong>Thermite</strong> (Intermediate-Advanced) — Multiple thermite sequences required</li>
                                        <li><strong>Word Memory</strong> — For the electronic security system</li>
                                        <li><strong>Laundromat</strong> — For pattern-based safe access</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-[#0F1B21]/50 rounded-lg p-5 border border-red-500/20">
                                <h3 className="text-xl font-semibold text-red-400 mb-3">Tier 4: Pacific Standard & Maze Bank</h3>
                                <p className="text-sm mb-3">
                                    The apex of criminal activity. These top-tier heists require elite-level hacking abilities,
                                    large crews of 6+, and meticulous planning. The payouts are legendary, but so are the consequences
                                    of failure.
                                </p>
                                <div className="text-sm">
                                    <p className="font-medium text-white mb-1">Required Hacks:</p>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li><strong>Thermite</strong> (Expert) — Multiple back-to-back expert-level sequences</li>
                                        <li><strong>Word Memory</strong> (Advanced) — Complex word pattern challenges</li>
                                        <li><strong>PinCracker</strong> (Advanced) — Multiple code-breaking stages</li>
                                        <li><strong>Roof Running</strong> — For exterior access routes</li>
                                        <li><strong>RepairKit</strong> — For disabling backup security systems</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Crew Roles */}
                    <section className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Users className="w-6 h-6 text-[#54FFA4]" />
                            <h2 className="text-2xl font-bold text-white">Crew Roles and Specializations</h2>
                        </div>
                        <div className="space-y-4 text-gray-300 leading-relaxed">
                            <p>
                                Successful heist crews assign clear roles based on each member&apos;s strengths. While every crew member
                                should have basic hacking competency, specialization is key to running clean operations.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <span className="text-[#54FFA4] font-bold mt-0.5">▸</span>
                                    <div>
                                        <strong className="text-white">The Hacker:</strong> The most critical role. This person handles all electronic
                                        security — Thermite, PinCracker, Word Memory. They should be the most practiced member of the crew and
                                        is usually the one who determines whether a heist attempt succeeds or fails. Hackers practice daily on
                                        simulators to maintain peak performance.
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#54FFA4] font-bold mt-0.5">▸</span>
                                    <div>
                                        <strong className="text-white">The Lookout:</strong> Monitors police channels, watches entry points, and manages
                                        timing. While not hack-intensive, lookouts need to be familiar with Lockpick for emergency exits and should
                                        be able to serve as backup hackers if needed.
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#54FFA4] font-bold mt-0.5">▸</span>
                                    <div>
                                        <strong className="text-white">The Driver:</strong> Handles the getaway vehicle and escape routes. After the heist,
                                        the driver&apos;s skills determine whether the crew escapes the police response. Should know Lockpick and
                                        RepairKit for vehicle acquisition and emergency repairs.
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#54FFA4] font-bold mt-0.5">▸</span>
                                    <div>
                                        <strong className="text-white">The Negotiator:</strong> Manages hostage situations and police interactions.
                                        This role requires strong roleplay skills more than hacking ability, but having Thermite as a backup
                                        skill makes any crew member more valuable.
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 4: Preparation */}
                    <section className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Shield className="w-6 h-6 text-[#54FFA4]" />
                            <h2 className="text-2xl font-bold text-white">How to Prepare for Your First Heist</h2>
                        </div>
                        <div className="space-y-4 text-gray-300 leading-relaxed">
                            <p>
                                Whether you are joining an existing crew or forming your own, preparation is what separates successful
                                heists from disasters. Here&apos;s a systematic approach to getting heist-ready:
                            </p>
                            <ol className="list-decimal pl-5 space-y-3">
                                <li>
                                    <strong className="text-white">Identify your target</strong> — Know exactly which heist you&apos;re going for
                                    and understand the specific hacking requirements.
                                </li>
                                <li>
                                    <strong className="text-white">Practice the required hacks</strong> — Use our free simulators to practice
                                    each required minigame until you can pass consistently. Don&apos;t attempt a heist until you have at least
                                    an 80% success rate on the required difficulty level.
                                </li>
                                <li>
                                    <strong className="text-white">Gather your crew</strong> — Ensure each member understands their role and
                                    has practiced their specific responsibilities.
                                </li>
                                <li>
                                    <strong className="text-white">Scout the location</strong> — Visit the target in non-criminal contexts to
                                    understand the layout, security camera positions, and escape routes.
                                </li>
                                <li>
                                    <strong className="text-white">Plan your escape</strong> — The heist itself is only half the battle.
                                    Having multiple escape routes planned and vehicles staged is critical.
                                </li>
                                <li>
                                    <strong className="text-white">Do a dry run</strong> — If possible, walk through the plan step-by-step
                                    with your crew before committing real resources.
                                </li>
                            </ol>
                        </div>
                    </section>

                    {/* Section 5: Common Pitfalls */}
                    <section className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertTriangle className="w-6 h-6 text-[#54FFA4]" />
                            <h2 className="text-2xl font-bold text-white">Top Reasons Heists Fail</h2>
                        </div>
                        <div className="space-y-4 text-gray-300 leading-relaxed">
                            <p>
                                Understanding common failure points helps you avoid them. Here are the most frequent reasons heists go wrong:
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <span className="text-red-400 font-bold mt-0.5">1.</span>
                                    <div>
                                        <strong className="text-white">Unpracticed hackers:</strong> The number one cause. Someone claims they
                                        can do Thermite, fails three times, and now the crew is out of supplies with cops closing in.
                                        Always verify hack skills before the operation.
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-400 font-bold mt-0.5">2.</span>
                                    <div>
                                        <strong className="text-white">Poor communication:</strong> Crew members talking over each other, missing
                                        callouts, or forgetting the plan under pressure. Use clear, concise radio communication.
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-400 font-bold mt-0.5">3.</span>
                                    <div>
                                        <strong className="text-white">No backup plan:</strong> When the primary escape route is blocked,
                                        crews without alternatives are caught. Always have at least two exit strategies.
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-400 font-bold mt-0.5">4.</span>
                                    <div>
                                        <strong className="text-white">Greed:</strong> Spending too long inside the vault trying to grab every last
                                        item while the police net tightens. Know when to leave.
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="text-center p-8 bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl">
                        <h2 className="text-2xl font-bold text-white mb-4">Start Preparing for Your Next Heist</h2>
                        <p className="text-gray-300 mb-6">
                            Practice every hacking minigame required for your target heist on our free simulators.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-[#54FFA4] text-[#0F1B21] rounded-lg font-semibold hover:bg-[#45e894] transition-all duration-200"
                            >
                                <Gamepad2 className="w-5 h-5" />
                                Practice All Minigames
                            </Link>
                            <Link
                                href="/guides"
                                className="inline-flex items-center gap-2 px-6 py-3 border border-[#54FFA4]/50 text-[#54FFA4] rounded-lg font-semibold hover:bg-[#54FFA4]/10 transition-all duration-200"
                            >
                                More Guides
                            </Link>
                        </div>
                    </section>
                </article>
            </div>
        </div>
    );
}
