import { Shield, Eye, Cookie, Database, Mail, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - NoPixel 4.0 Minigames Trainer',
  description: 'Privacy Policy for NoPixel 4.0 Minigames - Learn how we protect your data and respect your privacy.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1B21] via-[#1a2930] to-[#0F1B21] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Shield className="w-12 h-12 text-[#54FFA4]" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Privacy Policy
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Last Updated: November 13, 2025
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Welcome to NoPixel 4.0 Minigames Trainer (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy and ensuring you have a positive experience on our website. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
          </p>
          <p className="text-gray-300 leading-relaxed">
            By using our website, you consent to the data practices described in this policy. If you do not agree with our policies and practices, please do not use our services.
          </p>
        </div>

        {/* Information We Collect */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <Database className="w-10 h-10 text-[#54FFA4] flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Information We Collect</h2>
              
              <h3 className="text-xl font-bold text-white mb-3 mt-6">1. Personal Information</h3>
              <p className="text-gray-300 leading-relaxed mb-3">
                When you create an account or use our services, we may collect:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>Discord username and ID (when you log in via Discord OAuth)</li>
                <li>Email address (if provided through Discord)</li>
                <li>Profile avatar/image</li>
                <li>User preferences and settings</li>
              </ul>

              <h3 className="text-xl font-bold text-white mb-3 mt-6">2. Game Data</h3>
              <p className="text-gray-300 leading-relaxed mb-3">
                We automatically collect information about your gameplay:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>Game scores and completion times</li>
                <li>Game statistics and progress</li>
                <li>Leaderboard rankings</li>
                <li>Daily challenge completions</li>
                <li>Practice session data</li>
              </ul>

              <h3 className="text-xl font-bold text-white mb-3 mt-6">3. Usage Information</h3>
              <p className="text-gray-300 leading-relaxed mb-3">
                We collect data about how you interact with our website:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>IP address and device information</li>
                <li>Browser type and version</li>
                <li>Pages visited and time spent</li>
                <li>Referring websites</li>
                <li>Click patterns and navigation paths</li>
              </ul>
            </div>
          </div>
        </div>

        {/* How We Use Your Information */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <Eye className="w-10 h-10 text-[#54FFA4] flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Information</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We use the information we collect for the following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li><strong>To provide our services:</strong> Process your account, save your progress, and display your statistics</li>
                <li><strong>To improve our website:</strong> Analyze usage patterns to enhance user experience and add new features</li>
                <li><strong>To maintain leaderboards:</strong> Display competitive rankings and achievements</li>
                <li><strong>To communicate with you:</strong> Send important updates about the service (if you opt-in)</li>
                <li><strong>To ensure security:</strong> Prevent fraud, abuse, and unauthorized access</li>
                <li><strong>To comply with legal obligations:</strong> Meet regulatory requirements and respond to legal requests</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Third-Party Services */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Third-Party Services</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-3">Google Analytics</h3>
              <p className="text-gray-300 leading-relaxed mb-3">
                We use Google Analytics to understand how visitors use our site. Google Analytics collects information anonymously and reports website trends without identifying individual visitors.
              </p>
              <a 
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#54FFA4] hover:text-[#45e894] inline-flex items-center gap-2"
              >
                Google Privacy Policy <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-3">Discord OAuth</h3>
              <p className="text-gray-300 leading-relaxed mb-3">
                We use Discord for authentication. When you log in via Discord, we receive your Discord username, ID, and avatar. We do not have access to your Discord password.
              </p>
              <a 
                href="https://discord.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#54FFA4] hover:text-[#45e894] inline-flex items-center gap-2"
              >
                Discord Privacy Policy <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-3">Google AdSense</h3>
              <p className="text-gray-300 leading-relaxed mb-3">
                We may use Google AdSense to display advertisements. Google and its partners use cookies to serve ads based on your prior visits to our website or other websites.
              </p>
              <a 
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#54FFA4] hover:text-[#45e894] inline-flex items-center gap-2"
              >
                Google Ads Policy <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Cookies */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <Cookie className="w-10 h-10 text-[#54FFA4] flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Cookies and Tracking Technologies</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We use cookies and similar tracking technologies to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>Keep you logged in to your account</li>
                <li>Remember your preferences and settings</li>
                <li>Analyze site traffic and usage patterns</li>
                <li>Deliver relevant advertisements</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                You can control cookies through your browser settings. However, disabling cookies may limit your ability to use certain features of our website.
              </p>
            </div>
          </div>
        </div>

        {/* Data Security */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Data Security</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>Encrypted data transmission (HTTPS/SSL)</li>
            <li>Secure database storage with MongoDB</li>
            <li>Regular security audits and updates</li>
            <li>Access controls and authentication</li>
          </ul>
          <p className="text-gray-300 leading-relaxed mt-4">
            However, no method of transmission over the Internet is 100% secure. While we strive to protect your personal information, we cannot guarantee its absolute security.
          </p>
        </div>

        {/* Your Rights */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Your Rights and Choices</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            You have the following rights regarding your personal information:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li><strong>Access:</strong> You can view your profile and game statistics at any time</li>
            <li><strong>Correction:</strong> You can update your preferences and settings through your account</li>
            <li><strong>Deletion:</strong> You can delete your account and all associated data through the Settings page</li>
            <li><strong>Opt-out:</strong> You can opt-out of analytics tracking through your browser settings</li>
            <li><strong>Data portability:</strong> You can request a copy of your data by contacting us</li>
          </ul>
        </div>

        {/* Children's Privacy */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Children&apos;s Privacy</h2>
          <p className="text-gray-300 leading-relaxed">
            Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us, and we will delete such information.
          </p>
        </div>

        {/* International Users */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">International Users</h2>
          <p className="text-gray-300 leading-relaxed">
            Our servers are located in various regions. If you are accessing our website from outside these regions, your information may be transferred to, stored, and processed in a country with different data protection laws. By using our services, you consent to this transfer.
          </p>
        </div>

        {/* Changes to Privacy Policy */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Changes to This Privacy Policy</h2>
          <p className="text-gray-300 leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date. You are advised to review this Privacy Policy periodically for any changes.
          </p>
        </div>

        {/* Contact */}
        <div className="bg-[#1a2930] border-2 border-[#54FFA4]/30 rounded-xl p-8 mb-8">
          <div className="flex items-start gap-4">
            <Mail className="w-10 h-10 text-[#54FFA4] flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2">
                <p className="text-gray-300">
                  <strong>GitHub:</strong>{' '}
                  <a 
                    href="https://github.com/MaximilianAdF/NoPixel-MiniGames-4.0/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#54FFA4] hover:text-[#45e894]"
                  >
                    Report an Issue
                  </a>
                </p>
                <p className="text-gray-300">
                  <strong>Contact Page:</strong>{' '}
                  <Link href="/contact" className="text-[#54FFA4] hover:text-[#45e894]">
                    Send us a message
                  </Link>
                </p>
              </div>
            </div>
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
