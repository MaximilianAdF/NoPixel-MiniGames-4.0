import type { Metadata } from "next";
import localFont from 'next/font/local'
import "./globals.css";
import Image from 'next/image'
import background from '../public/images/bg.png'
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from 'next/script';

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
  ]
});



export const metadata: Metadata = {
  metadataBase: new URL('https://no-px.vercel.app'),
  title: {
    default: "NoPixel 4.0 Hacking Simulator | Practice GTA RP Minigames Free",
    template: "%s | NoPixel 4.0 Minigames"
  },
  description: "Master NoPixel 4.0 hacking minigames with our free practice simulator. Train on Thermite, Lockpick, Laundromat, Roof Running, and more GTA RP challenges. Improve your skills risk-free with authentic replicas and global leaderboards.",
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
      url: '/images/og-image.png',
      width: 1200,
      height: 630,
      alt: 'NoPixel 4.0 Hacking Simulator - Practice GTA RP Minigames',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NoPixel 4.0 Hacking Simulator | Practice GTA RP Minigames Free',
    description: 'Master NoPixel 4.0 hacking minigames with our free practice simulator. Train on Thermite, Lockpick, Laundromat, and more.',
    images: ['/images/og-image.png'],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-gradient-to-br from-mirage-950 via-mirage-900 to-mirage-950 overscroll-y-none">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8849653057967400"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${gilroy.className} bg-gradient-to-br from-mirage-950 via-mirage-900 to-mirage-950 overscroll-y-none`}>
        <Background />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
