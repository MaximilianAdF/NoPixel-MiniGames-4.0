import { FileText, AlertTriangle, Scale, UserX, Shield } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service - NoPixel 4.0 Minigames Trainer',
  description: 'Terms of Service for NoPixel 4.0 Minigames - Read our terms and conditions for using the site.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1B21] via-[#1a2930] to-[#0F1B21] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <FileText className="w-12 h-12 text-[#54FFA4]" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Terms of Service
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Last Updated: November 13, 2025
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Agreement to Terms</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Welcome to NoPixel 4.0 Minigames Trainer. By accessing or using our website, you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you disagree with any part of these Terms, you may not access the service.
          </p>
          <p className="text-gray-300 leading-relaxed">
            These Terms apply to all visitors, users, and others who access or use the service.
          </p>
        </div>

        {/* Use of Service */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Use of Service</h2>
          
          <h3 className="text-xl font-bold text-white mb-3">Eligibility</h3>
          <p className="text-gray-300 leading-relaxed mb-4">
            You must be at least 13 years old to use this service. If you are under 18, you must have parental or guardian consent to use our services.
          </p>

          <h3 className="text-xl font-bold text-white mb-3">Account Registration</h3>
          <p className="text-gray-300 leading-relaxed mb-4">
            To access certain features, you may be required to create an account using Discord OAuth. You agree to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-4">
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account</li>
            <li>Not share your account with others</li>
            <li>Notify us immediately of any unauthorized access</li>
          </ul>

          <h3 className="text-xl font-bold text-white mb-3">Acceptable Use</h3>
          <p className="text-gray-300 leading-relaxed mb-4">
            You agree NOT to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>Use the service for any illegal or unauthorized purpose</li>
            <li>Attempt to hack, cheat, or manipulate game scores or leaderboards</li>
            <li>Use bots, scripts, or automated tools to play games</li>
            <li>Harass, abuse, or harm other users</li>
            <li>Upload malicious code or attempt to compromise the site</li>
            <li>Scrape, crawl, or collect data without permission</li>
            <li>Impersonate others or misrepresent your identity</li>
            <li>Violate any applicable laws or regulations</li>
          </ul>
        </div>

        {/* Disclaimer */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <AlertTriangle className="w-10 h-10 text-[#54FFA4] flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Important Disclaimer</h2>
              <div className="bg-red-500/10 border-2 border-red-500/30 rounded-lg p-4 mb-4">
                <p className="text-red-300 font-bold mb-2">NOT AFFILIATED WITH NOPIXEL OR ROCKSTAR GAMES</p>
                <p className="text-gray-300 leading-relaxed">
                  This website is a FAN-MADE training platform and is NOT officially affiliated with, endorsed by, or connected to NoPixel, NoPixel Roleplay Server, Rockstar Games, or Grand Theft Auto V (GTA V).
                </p>
              </div>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>This is an independent, educational project created by fans for practice purposes</li>
                <li>All game mechanics are recreated based on public knowledge</li>
                <li>NoPixel, GTA V, and related trademarks belong to their respective owners</li>
                <li>We make no claims to ownership of any intellectual property</li>
                <li>Using this trainer does not guarantee improved performance on actual NoPixel servers</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Intellectual Property */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <Scale className="w-10 h-10 text-[#54FFA4] flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Intellectual Property</h2>
              
              <h3 className="text-xl font-bold text-white mb-3">Our Content</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                The website design, code, and original content (excluding game mechanics inspired by NoPixel) are owned by us or our licensors. This content is protected by copyright and other intellectual property laws.
              </p>

              <h3 className="text-xl font-bold text-white mb-3">User-Generated Content</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                By submitting scores, statistics, or other content to our service, you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute that content in connection with the service.
              </p>

              <h3 className="text-xl font-bold text-white mb-3">DMCA Notice</h3>
              <p className="text-gray-300 leading-relaxed">
                If you believe any content on our site infringes your copyright, please contact us with a detailed DMCA notice. We will respond to legitimate requests in accordance with applicable law.
              </p>
            </div>
          </div>
        </div>

        {/* Limitation of Liability */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Limitation of Liability</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL WE BE LIABLE FOR ANY:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>Indirect, incidental, special, consequential, or punitive damages</li>
            <li>Loss of profits, revenue, data, or use</li>
            <li>Damages resulting from unauthorized access to your account</li>
            <li>Errors, mistakes, or inaccuracies in the service</li>
            <li>Service interruptions or downtime</li>
            <li>Damages arising from use or inability to use the service</li>
          </ul>
          <p className="text-gray-300 leading-relaxed mt-4">
            THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
          </p>
        </div>

        {/* Indemnification */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Indemnification</h2>
          <p className="text-gray-300 leading-relaxed">
            You agree to indemnify, defend, and hold harmless NoPixel 4.0 Minigames Trainer and its operators from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-300 mt-4">
            <li>Your use of the service</li>
            <li>Your violation of these Terms</li>
            <li>Your violation of any rights of another party</li>
            <li>Any content you submit or share through the service</li>
          </ul>
        </div>

        {/* Account Termination */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <UserX className="w-10 h-10 text-[#54FFA4] flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Account Termination</h2>
              
              <h3 className="text-xl font-bold text-white mb-3">By You</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                You may delete your account at any time through the Settings page. Upon deletion, all your personal data and game statistics will be permanently removed.
              </p>

              <h3 className="text-xl font-bold text-white mb-3">By Us</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                We reserve the right to suspend or terminate your account and access to the service at our sole discretion, without notice, for conduct that we believe:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>Violates these Terms or any applicable law</li>
                <li>Harms or could harm other users or the service</li>
                <li>Involves cheating, hacking, or manipulation of game data</li>
                <li>Creates liability or legal risk for us</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Data and Privacy */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <Shield className="w-10 h-10 text-[#54FFA4] flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Data and Privacy</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Your use of the service is also governed by our Privacy Policy, which explains how we collect, use, and protect your personal information.
              </p>
              <Link 
                href="/privacy"
                className="text-[#54FFA4] hover:text-[#45e894] font-bold"
              >
                Read our Privacy Policy →
              </Link>
            </div>
          </div>
        </div>

        {/* Changes to Terms */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Changes to Terms</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            We reserve the right to modify or replace these Terms at any time. We will provide notice of any material changes by:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-4">
            <li>Posting the new Terms on this page</li>
            <li>Updating the &quot;Last Updated&quot; date</li>
            <li>Sending a notification (if applicable)</li>
          </ul>
          <p className="text-gray-300 leading-relaxed">
            Your continued use of the service after changes take effect constitutes acceptance of the revised Terms.
          </p>
        </div>

        {/* Governing Law */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Governing Law</h2>
          <p className="text-gray-300 leading-relaxed">
            These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law provisions. Any disputes arising from these Terms or your use of the service shall be resolved through appropriate legal channels.
          </p>
        </div>

        {/* Severability */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Severability</h2>
          <p className="text-gray-300 leading-relaxed">
            If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that these Terms will otherwise remain in full force and effect.
          </p>
        </div>

        {/* Contact */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            If you have any questions about these Terms, please contact us:
          </p>
          <div className="space-y-2">
            <p className="text-gray-300">
              <strong>Contact Page:</strong>{' '}
              <Link href="/contact" className="text-[#54FFA4] hover:text-[#45e894]">
                Send us a message
              </Link>
            </p>
            <p className="text-gray-300">
              <strong>GitHub:</strong>{' '}
              <a 
                href="https://github.com/MaximilianAdF/NoPixel-MiniGames-4.0"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#54FFA4] hover:text-[#45e894]"
              >
                View Repository
              </a>
            </p>
          </div>
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
