import { Code, Github, Star, GitFork, Heart, ExternalLink, Bug } from 'lucide-react';

export default function OpenSourcePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1B21] via-[#1a2930] to-[#0F1B21] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Code className="w-12 h-12 text-[#54FFA4]" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Open Source
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Built by the community, for the community
          </p>
        </div>

        {/* GitHub Card */}
        <div className="bg-gradient-to-br from-[#1a2930] to-[#0F1B21] border-2 border-[#54FFA4]/30 rounded-xl p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <Github className="w-12 h-12 text-[#54FFA4] flex-shrink-0" />
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-3">
                NoPixel-MiniGames-4.0
              </h2>
              <p className="text-gray-300 mb-6">
                This entire project is open source and available on GitHub. Anyone can view the code, 
                suggest improvements, report bugs, or contribute new features!
              </p>
              <a
                href="https://github.com/MaximilianAdF/NoPixel-MiniGames-4.0"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#54FFA4] text-[#0F1B21] rounded-lg font-semibold hover:bg-[#45e894] transition-all duration-200"
              >
                <Github className="w-5 h-5" />
                View on GitHub
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Tech Stack</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-[#0F1B21] rounded-lg p-4">
              <div className="text-[#54FFA4] font-semibold mb-2">Frontend Framework</div>
              <div className="text-white">Next.js 14 (App Router)</div>
            </div>
            <div className="bg-[#0F1B21] rounded-lg p-4">
              <div className="text-[#54FFA4] font-semibold mb-2">Language</div>
              <div className="text-white">TypeScript</div>
            </div>
            <div className="bg-[#0F1B21] rounded-lg p-4">
              <div className="text-[#54FFA4] font-semibold mb-2">Styling</div>
              <div className="text-white">Tailwind CSS</div>
            </div>
            <div className="bg-[#0F1B21] rounded-lg p-4">
              <div className="text-[#54FFA4] font-semibold mb-2">Database</div>
              <div className="text-white">MongoDB</div>
            </div>
            <div className="bg-[#0F1B21] rounded-lg p-4">
              <div className="text-[#54FFA4] font-semibold mb-2">Hosting</div>
              <div className="text-white">Vercel</div>
            </div>
            <div className="bg-[#0F1B21] rounded-lg p-4">
              <div className="text-[#54FFA4] font-semibold mb-2">Icons</div>
              <div className="text-white">Lucide React</div>
            </div>
          </div>
        </div>

        {/* How to Contribute */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">How to Contribute</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#54FFA4] text-[#0F1B21] font-bold flex items-center justify-center">
                1
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#54FFA4]" />
                  Star the Repository
                </h3>
                <p className="text-gray-300">
                  Show your support by starring the repo on GitHub. It helps others discover the project!
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#54FFA4] text-[#0F1B21] font-bold flex items-center justify-center">
                2
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <Bug className="w-5 h-5 text-red-400" />
                  Report Bugs
                </h3>
                <p className="text-gray-300">
                  Found a bug? Create an issue on GitHub with details about what went wrong and how to reproduce it.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#54FFA4] text-[#0F1B21] font-bold flex items-center justify-center">
                3
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">💡 Suggest Features</h3>
                <p className="text-gray-300">
                  Have an idea for a new feature or improvement? Open a feature request on our GitHub discussions!
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#54FFA4] text-[#0F1B21] font-bold flex items-center justify-center">
                4
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">🔧 Submit Pull Requests</h3>
                <p className="text-gray-300">
                  Know how to code? Fork the repo, make your changes, and submit a pull request. All contributions are welcome!
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#54FFA4] text-[#0F1B21] font-bold flex items-center justify-center">
                5
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">📖 Improve Documentation</h3>
                <p className="text-gray-300">
                  Help us write better guides, fix typos, or translate content for non-English speakers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* License */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">License</h2>
          <p className="text-gray-300 mb-4">
            This project is licensed under the MIT License. You&apos;re free to use, modify, and distribute the code 
            as long as you include the original copyright notice.
          </p>
          <div className="bg-[#0F1B21] rounded-lg p-4 font-mono text-sm text-gray-300">
            MIT License - Free to use, modify, and share
          </div>
        </div>

        {/* Community Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-6 text-center">
            <Star className="w-8 h-8 text-[#54FFA4] mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-2">Star Us</div>
            <div className="text-gray-400">On GitHub</div>
          </div>

          <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-6 text-center">
            <GitFork className="w-8 h-8 text-[#54FFA4] mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-2">Fork It</div>
            <div className="text-gray-400">Make it yours</div>
          </div>

          <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-6 text-center">
            <Heart className="w-8 h-8 text-[#54FFA4] mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-2">Contribute</div>
            <div className="text-gray-400">Join the team</div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-[#54FFA4]/10 to-transparent border-2 border-[#54FFA4]/30 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Join Our Developer Community
          </h2>
          <p className="text-gray-300 mb-6">
            Whether you&apos;re fixing typos or building entire features, every contribution matters!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://github.com/MaximilianAdF/NoPixel-MiniGames-4.0"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#54FFA4] text-[#0F1B21] rounded-lg font-semibold hover:bg-[#45e894] transition-all duration-200"
            >
              <Github className="w-5 h-5" />
              View Repository
            </a>
            <a
              href="https://github.com/MaximilianAdF/NoPixel-MiniGames-4.0/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1a2930] text-white border-2 border-[#54FFA4]/30 rounded-lg font-semibold hover:border-[#54FFA4] transition-all duration-200"
            >
              Report an Issue
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
