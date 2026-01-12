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
  display: 'optional',
  variable: '--font-orbitron',
  adjustFontFallback: true,
});

const rajdhani = Rajdhani({
  weight: '700',
  subsets: ['latin'],
  display: 'optional',
  variable: '--font-rajdhani',
  adjustFontFallback: true,
});

const caveat = Caveat({
  weight: '600',
  subsets: ['latin'],
  display: 'optional',
  variable: '--font-caveat',
  adjustFontFallback: true,
});



export const metadata: Metadata = {
  metadataBase: new URL('https://no-px.vercel.app'),
  applicationName: 'NoPixel 4.0 Minigames',
  title: {
    default: "NoPixel 4.0 Minigames - Free Practice Simulator for GTA RP Hacking 🎮",
    template: "%s | NoPixel 4.0 Practice"
  },
  description: "★★★★★ Master NoPixel 4.0 hacking minigames FREE! Practice Thermite, Lockpick, VAR, Laundromat & more GTA RP challenges. Real-time leaderboards, expert tips, mobile-friendly. 100% risk-free training for FiveM & GTA roleplay. Start now!",
  icons: {
    icon: '/icon',
    shortcut: '/icon',
    apple: '/icon',
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
  authors: [{ name: "NoPixel Minigames", url: "https://no-px.vercel.app" }],
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
    url: 'https://no-px.vercel.app',
    title: 'NoPixel 4.0 Minigames - Free GTA RP Hacking Practice Simulator 🎮',
    description: '⭐ Master NoPixel hacks FREE! Practice Thermite, Lockpick, VAR & more. Global leaderboards, expert strategies, mobile-friendly. The #1 GTA RP training simulator!',
    siteName: 'NoPixel 4.0 Minigames',
    // Next.js will automatically use /app/opengraph-image.tsx
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NoPixel 4.0 Minigames - Free GTA RP Hacking Simulator 🎮',
    description: '⭐ Master NoPixel hacks FREE! Practice Thermite, Lockpick, VAR & more. #1 GTA RP training tool with leaderboards & expert tips!',
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
        
        {/* PropellerAds - Zone 1: Main Tag */}
        <Script 
          src="https://3nbf4.com/act/files/tag.min.js?z=10452043" 
          data-cfasync="false" 
          async
          strategy="afterInteractive"
        />
        
        {/* PropellerAds - Zone 2: In-Page Push (Bottom positioned) */}
        <Script 
          id="propellerads-push"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(s){s.dataset.zone='10452047',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`,
          }}
        />
        
        {/* Session Tracking */}
        <Script id="session-tracker" strategy="afterInteractive">
          {`
            if (!sessionStorage.getItem('session_start')) {
              sessionStorage.setItem('session_start', Date.now());
              sessionStorage.setItem('game_count', '0');
            }
          `}
        </Script>
        
        {/* JSON-LD Structured Data for better SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "NoPixel 4.0 Minigames",
              "applicationCategory": "GameApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "Free practice simulator for NoPixel 4.0 GTA RP hacking minigames. Master Thermite, Lockpick, Laundromat, Roof Running and more with real-time leaderboards.",
              "url": "https://no-px.vercel.app",
              "image": "https://no-px.vercel.app/opengraph-image",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "1250",
                "bestRating": "5"
              },
              "featureList": [
                "Thermite Hack Practice",
                "Lockpick Training",
                "Laundromat Minigame",
                "Roof Running Challenge",
                "Word Memory Test",
                "Pin Cracker",
                "Chopping Game",
                "Global Leaderboards",
                "Daily Challenges",
                "Mobile Support"
              ],
              "author": {
                "@type": "Organization",
                "name": "NoPixel Minigames"
              }
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
              </GuideProvider>
            </KeyboardShortcutsProvider>
          </UserProvider>
        </LoadingProvider>
        <AppAnalytics />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8849653057967400"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
