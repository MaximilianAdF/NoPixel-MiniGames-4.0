import type { Metadata } from "next";
import localFont from 'next/font/local'
import "./globals.css";
import Image from 'next/image'
import background from '../public/images/bg.png'
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from 'next/script';
import { Orbitron, Rajdhani, Caveat } from 'next/font/google';

function Background() {
  return (
    <div className="fixed h-screen w-screen -z-50 bg-mirage-950">
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

const gilroy = localFont({
  src: [
    {
      path: '../fonts/Gilroy-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-gilroy',
});

const orbitron = Orbitron({
  weight: '900',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-orbitron',
});

const rajdhani = Rajdhani({
  weight: '700',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-rajdhani',
});

const caveat = Caveat({
  weight: '600',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-caveat',
});



export const metadata: Metadata = {
  metadataBase: new URL('https://no-px.vercel.app'),
  applicationName: 'NoPixel Hacking Simulator',
  title: {
    default: "NoPixel 4.0 Hacking Simulator | Practice GTA RP Minigames Free",
    template: "%s | NoPixel 4.0 Minigames"
  },
  description: "Master NoPixel 4.0 hacking minigames with our free practice simulator. Train on Thermite, Lockpick, Laundromat, Roof Running, and more GTA RP challenges. Improve your skills risk-free with authentic replicas and global leaderboards.",
  icons: {
    icon: '/icon',
    shortcut: '/icon',
    apple: '/icon',
  },
  keywords: [
    // Core brand terms
    "NoPixel", "NoPixel 4.0", "NoPixel minigames", "NoPixel hacking simulator",
    // Game specific
    "GTA V RP", "GTA 5 roleplay", "FiveM", "GTA RP minigames",
    // Specific minigames
    "Thermite hack", "Lockpick minigame", "Laundromat hack", "Roof Running",
    "Word Memory", "PinCracker", "Chopping minigame", "RepairKit",
    // User intent keywords
    "practice hacking minigames", "free GTA RP trainer", "NoPixel hack practice",
    "hacking simulator", "minigame practice tool", "GTA RP training",
    // Long-tail keywords
    "how to practice NoPixel hacks", "best NoPixel practice site",
    "NoPixel 4.0 hack trainer", "GTA RP skill improvement"
  ],
  authors: [{ name: "NoPixel Minigames" }],
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
    title: 'NoPixel 4.0 Hacking Simulator | Practice GTA RP Minigames Free',
    description: 'Master NoPixel 4.0 hacking minigames with our free practice simulator. Train on Thermite, Lockpick, Laundromat, and more GTA RP challenges.',
    siteName: 'NoPixel 4.0 Minigames',
    images: [{
      url: '/icon',
      width: 32,
      height: 32,
      alt: 'NoPixel 4.0 Minigames Icon',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NoPixel 4.0 Hacking Simulator | Practice GTA RP Minigames Free',
    description: 'Master NoPixel 4.0 hacking minigames with our free practice simulator. Train on Thermite, Lockpick, Laundromat, and more.',
    images: ['/icon'],
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
  alternates: {
    canonical: 'https://no-px.vercel.app',
  },
  verification: {
    google: "cafrsYUjNLn9L2Y6ssoK0Ip1nnONFp2xMWe622VyCyE",
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover', // This allows content to extend into safe areas
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`bg-gradient-to-br from-mirage-950 via-mirage-900 to-mirage-950 overscroll-y-none ${orbitron.variable} ${rajdhani.variable} ${caveat.variable}`} style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8849653057967400"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${gilroy.className} bg-gradient-to-br from-mirage-950 via-mirage-900 to-mirage-950 overscroll-y-none`} style={{ minHeight: '100vh', paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <Background />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
