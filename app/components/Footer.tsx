import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-[#0F1B21] border-t border-[#54FFA4]/20 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-[#54FFA4] font-bold mb-3">NoPixel 4.0 Practice</h3>
            <p className="text-gray-400 text-sm">
              Free practice tool for NoPixel 4.0 GTA RP minigames. Master every hack with unlimited attempts.
            </p>
          </div>

          {/* Minigames — sitewide crawl paths + descriptive anchors for every trainer */}
          <div>
            <h3 className="text-[#54FFA4] font-bold mb-3">Minigames</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/puzzles/thermite" className="text-gray-400 hover:text-[#54FFA4] transition-colors">Thermite Hack</Link></li>
              <li><Link href="/puzzles/lockpick" className="text-gray-400 hover:text-[#54FFA4] transition-colors">Lockpick Trainer</Link></li>
              <li><Link href="/puzzles/pincracker" className="text-gray-400 hover:text-[#54FFA4] transition-colors">PinCracker</Link></li>
              <li><Link href="/puzzles/laundromat" className="text-gray-400 hover:text-[#54FFA4] transition-colors">Laundromat Hack</Link></li>
              <li><Link href="/puzzles/roof-running" className="text-gray-400 hover:text-[#54FFA4] transition-colors">Roof Running</Link></li>
              <li><Link href="/puzzles/word-memory" className="text-gray-400 hover:text-[#54FFA4] transition-colors">Word Memory</Link></li>
              <li><Link href="/puzzles/chopping" className="text-gray-400 hover:text-[#54FFA4] transition-colors">Chopping</Link></li>
              <li><Link href="/puzzles/repair-kit" className="text-gray-400 hover:text-[#54FFA4] transition-colors">Repair Kit</Link></li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-[#54FFA4] font-bold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/guides" className="text-gray-400 hover:text-[#54FFA4] transition-colors">Guides</Link></li>
              <li><Link href="/servers" className="text-gray-400 hover:text-[#54FFA4] transition-colors">Servers</Link></li>
              <li><Link href="/leaderboards" className="text-gray-400 hover:text-[#54FFA4] transition-colors">Leaderboards</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-[#54FFA4] transition-colors">About</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-[#54FFA4] transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-[#54FFA4] transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-[#54FFA4] font-bold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="text-gray-400 hover:text-[#54FFA4] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-[#54FFA4] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#54FFA4]/20 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>© {currentYear} NPHacks.net - All rights reserved</p>
          <p className="mt-2 md:mt-0">
            Not affiliated with NoPixel or Rockstar Games
          </p>
        </div>
      </div>
    </footer>
  );
}
