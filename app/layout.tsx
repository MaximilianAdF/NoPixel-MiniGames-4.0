import type { Metadata } from "next";
import localFont from 'next/font/local'
import "./globals.css";
import Image from 'next/image'
import background from '../public/images/bg.png'
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
  title: "NoPixel Hacking Simulator",
  description: "NoPixel Hacking Simulator is a collection of minigames that simulate the hacking mechanics of NoPixel 4.0. Play Laundromat, LockPick, RepairKit, RoofRunning, SmokeCrack, PinCracker, Word Memory minigames completely for free.",
  keywords: ["NoPixel", "NoPixel 4.0", "NoPixel Hacking Simulator", "Laundromat", "LockPick", "RepairKit", "RoofRunning", "SmokeCrack", "Minigames", "Hacking", "Simulator", "GTA V", "GTA 5", "Grand Theft Auto V", "Grand Theft Auto 5", "RP", "Roleplay", "GTA RP", "NoPixel RP", "NoPixel 4.0 RP", "NoPixel 4.0 Hacking Simulator", "FiveM"],
  verification: {
    google: "S-FJQGrin5Z7C-YheOScSZRfMpd2wcrPb4pWS3L2zf0",
  },
  other: {
    // TODO: Probably remove this? If it's not in the default values, it probably isn't supported
    title: "NoPixel Hacking Simulator: Laundromat, LockPick, RepairKit, RoofRunning, SmokeCrack, Play NoPixel 4.0 Minigames",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={gilroy.className}>
        <Background />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
