import type { Metadata, Viewport } from "next";
import localFont from 'next/font/local'
import { gilroy, gilroyNpTitle } from './fonts';
import "./globals.css";
import Image from 'next/image'
import background from '../public/images/bg.png'
import dynamic from 'next/dynamic';
import Script from 'next/script';
import { Orbitron, Rajdhani, Caveat } from 'next/font/google';
import NavigationMenu from './components/NavigationMenu';
import LoginButton from './components/LoginButton';
import ContextualHint from './components/ContextualHint';
import GlobalLoading from './components/GlobalLoading';
import CookieConsent from './components/CookieConsent';
import { UserProvider } from './contexts/UserContext';
import { LoadingProvider } from './contexts/LoadingContext';
import { KeyboardShortcutsProvider } from './contexts/KeyboardShortcutsContext';
import { GuideProvider } from './contexts/GuideContext';
import GoogleTagManager, { GoogleTagManagerNoScript } from './components/GoogleTagManager';
import GoogleAnalytics from './components/GoogleAnalytics';
import Footer from './components/Footer';

function Background() {
  return (
    <div
      className="fixed w-screen -z-50 bg-mirage-950"
      style={{
        inset: 0,
        height: '100vh',
        minHeight: '100dvh',
      }}
    >
      <Image
        alt=""
        src={background}
        placeholder="blur"
        quality={100}
        fill
        sizes="100vw"
        className="opacity-10 object-cover"
        priority
      />
    </div>
  )
}

// fonts are now loaded from app/fonts.ts

const orbitron = Orbitron({
  weight: '900',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-orbitron',
  adjustFontFallback: true,
  preload: false,
});

const rajdhani = Rajdhani({
  weight: '700',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-rajdhani',
  adjustFontFallback: true,
  preload: false,
});

const caveat = Caveat({
  weight: '600',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-caveat',
  adjustFontFallback: true,
  preload: false,
});



export const metadata: Metadata = {
  metadataBase: new URL('https://nphacks.net'),
  applicationName: 'NoPixel 4.0 Minigames',
  title: {
    default: "NoPixel 4.0 Minigames & Hacks - Free Practice Trainer",
    template: "%s | NoPixel 4.0 Practice"
  },
  description: "Practice every NoPixel 4.0 hack and minigame free in your browser - Thermite, Lockpick, Laundromat, Roof Running, PinCracker and more. No download required.",
  alternates: {
    canonical: 'https://nphacks.net',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/manifest.json',
  keywords: [
    // Core brand terms
    "NoPixel", "NoPixel 4.0", "NoPixel minigames", "NoPixel hacking simulator",
    // Game specific
    "GTA V RP", "GTA 5 roleplay", "FiveM", "GTA RP minigames", "GTA RP hacks",
    // Specific minigames
    "Thermite hack", "Lockpick minigame", "Laundromat hack", "Roof Running",
    "Word Memory", "PinCracker", "Chopping minigame", "RepairKit", "Pin Cracker",
    // User intent keywords
    "practice hacking minigames", "free GTA RP trainer", "NoPixel hack practice",
    "hacking simulator", "minigame practice tool", "GTA RP training",
    // Long-tail keywords
    "how to practice NoPixel hacks", "best NoPixel practice site",
    "NoPixel 4.0 hack trainer", "GTA RP skill improvement", "FiveM minigame trainer",
    "free NoPixel practice", "NoPixel tutorial", "GTA RP minigame guide"
  ],
  authors: [{ name: "NoPixel Minigames", url: "https://nphacks.net" }],
  creator: "NoPixel Minigames",
  publisher: "NoPixel Minigames",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nphacks.net',
    title: 'NoPixel 4.0 Minigames & Hacks - Free GTA RP Hacking Practice',
    description: 'Free practice trainers for NoPixel 4.0 GTA RP hacking minigames. Authentic mechanics, daily challenges, and in-depth guides.',
    siteName: 'NoPixel 4.0 Minigames',
    // Next.js will automatically use /app/opengraph-image.tsx
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NoPixel 4.0 Minigames & Hacks - Free GTA RP Hacking Practice',
    description: 'Free practice trainers for NoPixel 4.0 GTA RP hacking minigames. Authentic mechanics, daily challenges, and in-depth guides.',
    // Next.js will automatically use /app/opengraph-image.tsx
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "cafrsYUjNLn9L2Y6ssoK0Ip1nnONFp2xMWe622VyCyE",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover', // This allows content to extend into safe areas
};

// exported fonts moved to app/fonts.ts to avoid importing layout into client bundles
const AppAnalytics = dynamic(() => import('./components/AppAnalytics'), { ssr: false });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`overscroll-y-none ${orbitron.variable} ${rajdhani.variable} ${caveat.variable} ${gilroyNpTitle.variable}`}
      style={{
        backgroundColor: '#020617',
        backgroundImage: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #020617 100%)',
        minHeight: '100dvh',
      }}
    >
      <head>
        <meta name="theme-color" content="#020617" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="color-scheme" content="dark" />

        {/* Google Tag Manager - Replace GTM-XXXXXXX with your actual GTM ID */}
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID || 'GTM-XXXXXXX'} />

        {/* GA4 direct (gtag) — receives the custom game events GTM doesn't forward */}
        <GoogleAnalytics />

        {/* Session Tracking - Load after page is interactive */}
        <Script id="session-tracker" strategy="lazyOnload">
          {`
            if (!sessionStorage.getItem('session_start')) {
              sessionStorage.setItem('session_start', Date.now());
              sessionStorage.setItem('game_count', '0');
            }
          `}
        </Script>

        {/* JSON-LD: site-wide Organization + WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://nphacks.net/#organization",
                  "name": "NoPixel Minigames",
                  "url": "https://nphacks.net",
                  "logo": "https://nphacks.net/icon-512.png",
                  "sameAs": [
                    "https://github.com/MaximilianAdF/NoPixel-MiniGames-4.0"
                  ]
                },
                {
                  "@type": "WebSite",
                  "@id": "https://nphacks.net/#website",
                  "name": "NoPixel 4.0 Minigames",
                  "url": "https://nphacks.net",
                  "publisher": { "@id": "https://nphacks.net/#organization" }
                }
              ]
            })
          }}
        />
      </head>
      <body
        className={`${gilroy.className} overscroll-y-none`}
        style={{
          minHeight: '100dvh',
          backgroundColor: '#020617',
          backgroundImage: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #020617 100%)',
          paddingTop: 'env(safe-area-inset-top, 0px)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          paddingLeft: 'env(safe-area-inset-left, 0px)',
          paddingRight: 'env(safe-area-inset-right, 0px)',
        }}
      >
        {/* Google Tag Manager NoScript Fallback */}
        <GoogleTagManagerNoScript gtmId={process.env.NEXT_PUBLIC_GTM_ID || 'GTM-XXXXXXX'} />

        <Background />
        <LoadingProvider>
          <UserProvider>
            <KeyboardShortcutsProvider>
              <GuideProvider>
                <GlobalLoading />
                <NavigationMenu />
                <LoginButton />
                <ContextualHint />
                {children}
                <CookieConsent />
                <Footer />
              </GuideProvider>
            </KeyboardShortcutsProvider>
          </UserProvider>
        </LoadingProvider>
        <AppAnalytics />
      </body>
    </html>
  );
}
