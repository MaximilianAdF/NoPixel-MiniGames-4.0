import { Mail, Github, MessageSquare, Bug, Lightbulb, Shield, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Contact Us - NoPixel 4.0 Minigames Trainer',
  description: 'Get in touch with NoPixel 4.0 Minigames - Report bugs, suggest features, or ask questions.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1B21] via-[#1a2930] to-[#0F1B21] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Mail className="w-12 h-12 text-[#54FFA4]" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Contact Us
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            We&apos;d love to hear from you! Choose the best way to reach out.
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Get in Touch</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Whether you&apos;ve found a bug, have a feature suggestion, need support, or have questions about the site, we&apos;re here to help. Please choose the most appropriate contact method below.
          </p>
          <p className="text-gray-300 leading-relaxed">
            We typically respond within 24-48 hours during business days. For urgent security issues, please use the GitHub Issues option and mark it as a security concern.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Bug Reports */}
          <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-6 hover:border-[#54FFA4]/50 transition-all">
            <div className="flex items-start gap-4 mb-4">
              <Bug className="w-8 h-8 text-red-400 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Report a Bug</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Found something broken? Let us know so we can fix it!
                </p>
                <a
                  href="https://github.com/MaximilianAdF/NoPixel-MiniGames-4.0/issues/new?labels=bug&template=bug_report.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all"
                >
                  <Bug className="w-4 h-4" />
                  Report Bug
                </a>
              </div>
            </div>
            <div className="text-sm text-gray-400 mt-4">
              <strong>Best for:</strong> Game glitches, crashes, broken features, visual bugs
            </div>
          </div>

          {/* Feature Requests */}
          <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-6 hover:border-[#54FFA4]/50 transition-all">
            <div className="flex items-start gap-4 mb-4">
              <Lightbulb className="w-8 h-8 text-yellow-400 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Suggest a Feature</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Have an idea to make the site better? We want to hear it!
                </p>
                <a
                  href="https://github.com/MaximilianAdF/NoPixel-MiniGames-4.0/issues/new?labels=enhancement&template=feature_request.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-[#0F1B21] rounded-lg font-semibold hover:bg-yellow-600 transition-all"
                >
                  <Lightbulb className="w-4 h-4" />
                  Request Feature
                </a>
              </div>
            </div>
            <div className="text-sm text-gray-400 mt-4">
              <strong>Best for:</strong> New games, UI improvements, quality of life features
            </div>
          </div>

          {/* General Questions */}
          <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-6 hover:border-[#54FFA4]/50 transition-all">
            <div className="flex items-start gap-4 mb-4">
              <HelpCircle className="w-8 h-8 text-blue-400 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-white mb-2">General Questions</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Have questions about the site or need help?
                </p>
                <a
                  href="https://github.com/MaximilianAdF/NoPixel-MiniGames-4.0/discussions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  Start Discussion
                </a>
              </div>
            </div>
            <div className="text-sm text-gray-400 mt-4">
              <strong>Best for:</strong> How-to questions, gameplay tips, general inquiries
            </div>
          </div>

          {/* Privacy & Legal */}
          <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-6 hover:border-[#54FFA4]/50 transition-all">
            <div className="flex items-start gap-4 mb-4">
              <Shield className="w-8 h-8 text-[#54FFA4] flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Privacy & Legal</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Questions about privacy, DMCA, or legal concerns?
                </p>
                <a
                  href="https://github.com/MaximilianAdF/NoPixel-MiniGames-4.0/issues/new?labels=legal&template=legal_inquiry.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#54FFA4] text-[#0F1B21] rounded-lg font-semibold hover:bg-[#45e894] transition-all"
                >
                  <Shield className="w-4 h-4" />
                  Legal Inquiry
                </a>
              </div>
            </div>
            <div className="text-sm text-gray-400 mt-4">
              <strong>Best for:</strong> DMCA notices, privacy concerns, data requests
            </div>
          </div>
        </div>

        {/* Email Contact */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-8 mb-8">
          <div className="flex items-start gap-4">
            <Mail className="w-10 h-10 text-[#54FFA4] flex-shrink-0" />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-4">Email Contact</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                For general inquiries, bug reports, or feedback, you can reach us directly via email:
              </p>
              <a 
                href="mailto:maximilian.adf@gmail.com" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#54FFA4] text-[#0F1B21] rounded-lg font-bold hover:bg-[#45e894] transition-all"
              >
                <Mail className="w-5 h-5" />
                maximilian.adf@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* GitHub Main Repository */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-8 mb-8">
          <div className="flex items-start gap-4">
            <Github className="w-10 h-10 text-[#54FFA4] flex-shrink-0" />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-4">GitHub Repository</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                This is an open-source project! Visit our GitHub repository to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-6">
                <li>View the source code</li>
                <li>Contribute to development</li>
                <li>Track ongoing issues and features</li>
                <li>Submit pull requests</li>
                <li>Star the project if you like it!</li>
              </ul>
              <a
                href="https://github.com/MaximilianAdF/NoPixel-MiniGames-4.0"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#24292f] text-white rounded-lg font-bold hover:bg-[#32383f] transition-all"
              >
                <Github className="w-5 h-5" />
                Visit GitHub Repository
              </a>
            </div>
          </div>
        </div>

        {/* Response Times */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Response Times</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-white font-semibold">Critical Bugs & Security Issues</p>
                <p className="text-gray-400 text-sm">Within 24 hours</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-white font-semibold">Feature Requests & General Bugs</p>
                <p className="text-gray-400 text-sm">1-3 business days</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#54FFA4] rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-white font-semibold">General Questions & Discussions</p>
                <p className="text-gray-400 text-sm">3-5 business days</p>
              </div>
            </div>
          </div>
          <p className="text-gray-400 text-sm mt-4">
            * Response times may vary depending on the complexity of the issue and current workload. We appreciate your patience!
          </p>
        </div>

        {/* Before You Contact */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Before You Contact Us</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Please check these resources first - you might find your answer faster:
          </p>
          <div className="grid gap-4">
            <Link
              href="/faq"
              className="flex items-center gap-3 p-4 bg-[#0F1B21] rounded-lg hover:bg-[#152530] transition-all"
            >
              <HelpCircle className="w-6 h-6 text-[#54FFA4]" />
              <div>
                <p className="text-white font-semibold">Frequently Asked Questions</p>
                <p className="text-gray-400 text-sm">Common questions and answers</p>
              </div>
            </Link>
            <Link
              href="/about"
              className="flex items-center gap-3 p-4 bg-[#0F1B21] rounded-lg hover:bg-[#152530] transition-all"
            >
              <MessageSquare className="w-6 h-6 text-[#54FFA4]" />
              <div>
                <p className="text-white font-semibold">About Us</p>
                <p className="text-gray-400 text-sm">Learn about the project</p>
              </div>
            </Link>
            <a
              href="https://github.com/MaximilianAdF/NoPixel-MiniGames-4.0/issues?q=is%3Aissue"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-[#0F1B21] rounded-lg hover:bg-[#152530] transition-all"
            >
              <Github className="w-6 h-6 text-[#54FFA4]" />
              <div>
                <p className="text-white font-semibold">Existing Issues</p>
                <p className="text-gray-400 text-sm">Check if your issue has been reported</p>
              </div>
            </a>
          </div>
        </div>

        {/* Community Guidelines */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Community Guidelines</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            When contacting us, please:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>Be respectful and professional</li>
            <li>Provide clear and detailed information</li>
            <li>Include screenshots or error messages when relevant</li>
            <li>Use the appropriate contact method for your issue type</li>
            <li>Be patient - we&apos;re a small team working on this in our free time</li>
          </ul>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#54FFA4] text-[#0F1B21] rounded-lg font-bold text-lg hover:bg-[#45e894] transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
