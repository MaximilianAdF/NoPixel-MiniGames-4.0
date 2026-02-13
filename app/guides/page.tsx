import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Flame, Target, Zap, Clock, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Guides & Tips - NoPixel 4.0 Minigame Strategies and Tutorials',
    description: 'Expert guides, strategies, and tips for mastering NoPixel 4.0 hacking minigames. Learn advanced techniques for Thermite, Lockpick, PinCracker, and more GTA RP challenges.',
    alternates: {
        canonical: 'https://no-px.vercel.app/guides',
    },
};

const guides = [
    {
        slug: 'mastering-thermite',
        title: 'Mastering Thermite Hacks in NoPixel 4.0',
        description: 'A comprehensive guide to conquering the most difficult hacking minigame in NoPixel. Learn memory techniques, pattern recognition strategies, and advanced tips used by elite heist crews.',
        icon: Flame,
        readTime: '8 min read',
        difficulty: 'Advanced',
        tags: ['Thermite', 'Memory', 'Bank Heists'],
    },
    {
        slug: 'nopixel-heist-guide',
        title: 'Complete Guide to NoPixel 4.0 Heists',
        description: 'Everything you need to know about planning and executing successful heists in NoPixel 4.0. From Fleeca Banks to the Pacific Standard vault, learn which hacks you need and how to prepare.',
        icon: Target,
        readTime: '10 min read',
        difficulty: 'Intermediate',
        tags: ['Heists', 'Planning', 'All Minigames'],
    },
    {
        slug: 'improving-reaction-time',
        title: 'How to Improve Reaction Time for GTA RP Minigames',
        description: 'Science-backed techniques to boost your reaction speed, hand-eye coordination, and cognitive performance. Applicable to all NoPixel minigames and beyond.',
        icon: Zap,
        readTime: '7 min read',
        difficulty: 'Beginner',
        tags: ['Skills', 'Performance', 'Training'],
    },
];

const difficultyColors: Record<string, string> = {
    Beginner: 'text-green-400 border-green-400/30 bg-green-400/10',
    Intermediate: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
    Advanced: 'text-red-400 border-red-400/30 bg-red-400/10',
};

export default function GuidesPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0F1B21] via-[#1a2930] to-[#0F1B21] p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12 pt-16">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <BookOpen className="w-12 h-12 text-[#54FFA4]" />
                        <h1 className="text-4xl md:text-5xl font-bold text-white">
                            Guides & Tips
                        </h1>
                    </div>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Expert strategies, tutorials, and tips to help you master every NoPixel 4.0 hacking minigame.
                        Written by experienced players who have conquered every challenge.
                    </p>
                </div>

                {/* Guide Cards */}
                <div className="space-y-6 mb-12">
                    {guides.map((guide) => {
                        const Icon = guide.icon;
                        return (
                            <Link key={guide.slug} href={`/guides/${guide.slug}`} className="block group">
                                <article className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-6 md:p-8 hover:border-[#54FFA4]/60 transition-all duration-300 hover:shadow-lg hover:shadow-[#54FFA4]/10">
                                    <div className="flex items-start gap-4 md:gap-6">
                                        <div className="flex-shrink-0">
                                            <div className="w-14 h-14 rounded-lg bg-[#54FFA4]/20 flex items-center justify-center group-hover:bg-[#54FFA4]/30 transition-colors duration-300">
                                                <Icon className="w-7 h-7 text-[#54FFA4]" />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${difficultyColors[guide.difficulty]}`}>
                                                    {guide.difficulty}
                                                </span>
                                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                                    <Clock className="w-3 h-3" />
                                                    {guide.readTime}
                                                </span>
                                            </div>
                                            <h2 className="text-xl md:text-2xl font-bold text-white group-hover:text-[#54FFA4] transition-colors duration-300 mb-2">
                                                {guide.title}
                                            </h2>
                                            <p className="text-gray-400 leading-relaxed mb-3">
                                                {guide.description}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-2">
                                                {guide.tags.map((tag) => (
                                                    <span key={tag} className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded">
                                                        {tag}
                                                    </span>
                                                ))}
                                                <span className="ml-auto flex items-center gap-1 text-sm text-[#54FFA4] font-semibold group-hover:gap-2 transition-all duration-300">
                                                    Read guide <ArrowRight className="w-4 h-4" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        );
                    })}
                </div>

                {/* CTA Section */}
                <div className="text-center p-8 bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl">
                    <h2 className="text-2xl font-bold text-white mb-4">
                        Ready to Practice?
                    </h2>
                    <p className="text-gray-300 mb-6 max-w-lg mx-auto">
                        Put these strategies to the test with our free minigame simulators. Track your improvement on global leaderboards.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#54FFA4] text-[#0F1B21] rounded-lg font-semibold hover:bg-[#45e894] transition-all duration-200"
                    >
                        Start Practicing Now
                    </Link>
                </div>
            </div>
        </div>
    );
}
