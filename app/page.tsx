"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { Heart, Target, Trophy, Zap } from 'lucide-react';


import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownLeftAndUpRightToCenter, faFileLines, faInfo, faUpRightAndDownLeftFromCenter, faXmark, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import DonateContainer from "@/app/components/DonateContainer";
import bmcLogo from "./utils/bmc-logo.png";


// NoPixel 4.0 Minigames
const puzzles = [
  {
    href: "/puzzles/thermite",
    img: "https://github.com/MaximilianAdF/NoPixel-MiniGames-4.0/assets/63980031/0674273c-43da-4d39-a98e-1443517a4eac",
    title: "Thermite",
    description: "Replica of the Thermite hack that is triggered when disabling lasers inside the Maze Bank on NoPixel 4.0",
  },
  {
    href: "/puzzles/roof-running",
    img: "https://github.com/MaximilianAdF/NoPixel-MiniGames-4.0/assets/63980031/e8387474-4a34-4f02-842f-195484160a60",
    title: "Roof Running",
    description: "Replica of the Roof Running hack that is triggered when robbing AC-Units on NoPixel 4.0"
  },
  {
    href: "/puzzles/laundromat",
    img: "https://github.com/MaximilianAdF/NoPixel-MiniGames-4.0/assets/63980031/23371a81-fd85-49b5-819b-de1207a5a4f8",
    title: "Laundromat",
    description: "Replica of the Laundromat hack that is triggered when robbing the safe inside the south-side Laundromat on NoPixel 4.0"
  },
  {
    href: "/puzzles/lockpick",
    img: "https://github.com/MaximilianAdF/NoPixel-MiniGames-4.0/assets/63980031/472d8447-c69b-4474-aaeb-474516b8f014",
    title: "LockPick",
    description: "Replica of the LockPick hack that is triggered when lockpicking vehicles, among other things, on NoPixel 4.0"
  },
  {
    href: "/puzzles/repair-kit",
    img: "https://github.com/MaximilianAdF/NoPixel-MiniGames-4.0/assets/63980031/ac828de8-fb5d-4c9f-97ac-ee000702b630",
    title: "RepairKit",
    description: "Replica of the RepairKit hack that is triggered when repairing vehicles on NoPixel 4.0"
  },
  {
    href: "/puzzles/word-memory",
    img: "https://github.com/MaximilianAdF/NoPixel-MiniGames-4.0/assets/63980031/613422a5-39ba-4cd8-bd64-c0a41427629d",
    title: "Word Memory",
    description: "Replica of the Word Memory hack that is triggered when hacking the Maze Bank on NoPixel 4.0"
  },
  {
    href: "/puzzles/chopping",
    img: "https://github.com/MaximilianAdF/NoPixel-MiniGames-4.0/assets/63980031/815913c0-c159-4d17-b363-7136e08a1077",
    title: "Chopping",
    description: "Replica of the Chopping hack that is triggered when chopping vehicles on NoPixel 4.0"
  },
  {
    href: "/puzzles/pincracker",
    img: "https://github.com/MaximilianAdF/NoPixel-MiniGames-4.0/assets/63980031/e3619d89-7059-45fe-b8e5-3d429151ff41",
    title: "PinCracker",
    description: "Replica of the PinCracker hack that is triggered when hacking the Maze Bank on NoPixel 4.0"
  }
];

export default function Home() {
  const [newsAlert, setNewsAlert] = useState(false);
  const [showRevampNotice, setShowRevampNotice] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Changed back to true to prevent FOUC
  const hasLoadedRef = useRef(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const infoIcon = document.getElementById("info-icon");
    infoIcon?.classList.remove("hidden");

    // Check if user has seen the revamp notice
    const hasSeenRevamp = localStorage.getItem('hasSeenRevampNotice');
    if (!hasSeenRevamp) {
      setShowRevampNotice(true);
    }

    // Check if fonts are ready
    if (document.fonts) {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
      });
    } else {
      // Fallback for older browsers
      setFontsLoaded(true);
    }

    // Check if returning from a minigame or first visit
    const isReturning = sessionStorage.getItem('homePageVisited') === 'true';
    
    if (isReturning) {
      // Skip loading animation when returning to homepage
      setIsLoading(false);
      hasLoadedRef.current = true;
    } else {
      // Show loading animation on first visit
      const loadTimer = setTimeout(() => {
        setIsLoading(false);
        hasLoadedRef.current = true;
        sessionStorage.setItem('homePageVisited', 'true');
      }, 800);

      return () => {
        clearTimeout(loadTimer);
      };
    }
  }, []);

  return (
      <main className="relative flex min-h-screen flex-col items-center bg-gradient-to-br from-mirage-950 via-mirage-900 to-mirage-950">
        {/* Structured Data for SEO */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "NoPixel 4.0 Hacking Simulator",
              "description": "Free practice simulator for NoPixel 4.0 GTA RP hacking minigames including Thermite, Lockpick, Laundromat, Roof Running, Word Memory, and more.",
              "url": "https://no-px.vercel.app",
              "applicationCategory": "GameApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "1250",
                "bestRating": "5",
                "worstRating": "1"
              },
              "screenshot": "https://no-px.vercel.app/images/og-image.png",
              "featureList": [
                "Thermite Hacking Practice",
                "Lockpick Training",
                "Laundromat Puzzle Simulator",
                "Roof Running Challenge",
                "Word Memory Game",
                "PinCracker Practice",
                "Chopping Minigame",
                "RepairKit Simulator",
                "Global Leaderboards",
                "Progress Tracking"
              ],
              "browserRequirements": "Requires JavaScript. Requires HTML5.",
              "softwareVersion": "4.0",
              "author": {
                "@type": "Organization",
                "name": "NoPixel Minigames"
              }
            })
          }}
        />
        
        {/* Subtle Background Grid - Static */}
        <div className="fixed inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0" 
            style={{
              backgroundImage: `
                linear-gradient(rgba(9, 222, 110, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(9, 222, 110, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          />
        </div>

        {/* Subtle Ambient Glow - Static */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-spring-green-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-aquamarine-500/10 rounded-full blur-3xl" />
        </div>

        <style jsx>{`
          @keyframes shimmer {
            0% {
              background-position: -1000px 0;
            }
            100% {
              background-position: 1000px 0;
            }
          }
          @keyframes fadeSlideIn {
            0% {
              opacity: 0;
              transform: translateY(16px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes gradientFlow {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          @keyframes colorShift {
            0%, 95%, 100% {
              filter: hue-rotate(0deg);
            }
            96% {
              filter: hue-rotate(10deg);
            }
            97% {
              filter: hue-rotate(-10deg);
            }
          }
          @keyframes microShake {
            0%, 85%, 100% {
              transform: translate(0, 0) rotate(0deg);
            }
            87% {
              transform: translate(1px, 0px) rotate(1deg);
            }
            89% {
              transform: translate(-1px, 0px) rotate(-1deg);
            }
          }
          
          /* Mobile cycling animations */
          @keyframes mobileColorCycle {
            0%, 100% {
              opacity: 0;
            }
            50% {
              opacity: 0.5;
            }
          }
          
          @keyframes mobileScaleRotate {
            0%, 100% {
              transform: scale(1) rotate(0deg);
            }
            50% {
              transform: scale(1.15) rotate(-8deg);
            }
          }
          
          @keyframes mobileSlantCycle {
            0%, 100% {
              transform: rotate(-3deg) scale(1);
            }
            50% {
              transform: rotate(1deg) scale(1.03);
            }
          }
          
          @keyframes mobileUnderline {
            0%, 100% {
              width: 0%;
            }
            50% {
              width: 60%;
            }
          }
          
          @media (min-width: 768px) {
            @keyframes mobileColorCycle {
              0%, 100% {
                opacity: 0;
              }
            }
            
            @keyframes mobileScaleRotate {
              0%, 100% {
                transform: none;
              }
            }
            
            @keyframes mobileSlantCycle {
              0%, 100% {
                transform: rotate(-3deg);
              }
            }
            
            @keyframes mobileUnderline {
              0%, 100% {
                width: 0%;
              }
            }
          }
          
          @keyframes slantShift {
            0%, 80%, 100% {
              transform: rotate(-3deg);
            }
            82% {
              transform: rotate(-2deg);
            }
            84% {
              transform: rotate(-4deg);
            }
            86% {
              transform: rotate(-3deg);
            }
          }
        `}</style>

        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
          {/* Hero Section */}
          <header className="relative pt-16 pb-8 px-2 sm:px-4">
            <div className={`relative flex flex-col sm:flex-row items-center sm:items-start justify-center gap-2 sm:gap-4 transition-all duration-1000 ${isLoading ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'}`}>
              {/* NoPixel - Large on the left */}
              <h1 className="relative group cursor-pointer text-center sm:text-left">
                <span 
                  className="inline-block text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black bg-clip-text text-transparent transition-all duration-500 group-hover:translate-x-2"
                  style={{ 
                    fontFamily: 'var(--font-orbitron)', 
                    letterSpacing: '0.05em',
                    backgroundImage: 'linear-gradient(90deg, #09de6e, #64ffda, #40e0d0, #09de6e)',
                    backgroundSize: '200% 100%',
                    animation: 'gradientFlow 4s ease-in-out infinite'
                  }}
                >
                  NOPIXEL
                </span>
                {/* Color overlay - permanent cycle on mobile, hover on desktop */}
                <span 
                  className="absolute inset-0 text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent md:opacity-0 md:group-hover:opacity-60 transition-all duration-500"
                  style={{ 
                    fontFamily: 'var(--font-orbitron)', 
                    letterSpacing: '0.05em',
                    animation: 'mobileColorCycle 8s ease-in-out infinite'
                  }}
                >
                  NOPIXEL
                </span>
                {/* Subtle constant glitch overlay */}
                <span 
                  className="absolute inset-0 text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-spring-green-400 pointer-events-none"
                  style={{ 
                    fontFamily: 'var(--font-orbitron)', 
                    letterSpacing: '0.05em',
                    opacity: '0.08'
                  }}
                >
                  NOPIXEL
                </span>
              </h1>
              
              {/* 4.0 - Small in top right corner of NoPixel */}
              <div className="relative cursor-pointer -ml-2 -mt-4 sm:-ml-2 sm:mt-2">
                <span 
                  className="inline-block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white"
                  style={{ 
                    fontFamily: 'var(--font-rajdhani)', 
                    fontWeight: 700
                  }}
                >
                  4.0
                </span>
              </div>
            </div>
            
            {/* Minigames - Below and slanted */}
            <div className={`relative mt-2 sm:mt-4 ml-4 sm:ml-8 cursor-pointer w-fit transition-all duration-1000 ${isLoading ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'}`}>
              <span 
                className="inline-block text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-400"
                style={{ 
                  fontFamily: 'var(--font-caveat)', 
                  fontWeight: 600, 
                  transformOrigin: 'left center',
                  transform: 'rotate(-3deg)',
                  animation: 'colorShift 7s infinite'
                }}
              >
                Hacking Simulator
              </span>
            </div>
          </header>

          {/* Minigames Section - Moved to Top */}
          <div className="space-y-8">

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
              {isLoading ? 
                // Skeleton Loading
                Array.from({ length: 8 }).map((_, index) => (
                  <div 
                    key={index}
                    className="relative overflow-hidden rounded-lg bg-mirage-900/40 backdrop-blur-sm border border-spring-green-500/10"
                    style={{ height: '320px' }}
                  >
                    <div className="aspect-video relative overflow-hidden bg-mirage-800/60">
                      <div 
                        className="absolute inset-0 bg-gradient-to-r from-mirage-800/60 via-mirage-700/60 to-mirage-800/60"
                        style={{ animation: 'shimmer 2s infinite linear' }}
                      />
                    </div>
                    <div className="p-3 space-y-2">
                      <div 
                        className="h-5 bg-mirage-800/60 rounded w-3/4"
                        style={{ 
                          backgroundImage: 'linear-gradient(90deg, rgba(21, 27, 48, 0.6) 0%, rgba(31, 41, 73, 0.6) 50%, rgba(21, 27, 48, 0.6) 100%)',
                          backgroundSize: '200% 100%',
                          animation: 'shimmer 2s infinite linear'
                        }}
                      />
                      <div 
                        className="h-3 bg-mirage-800/60 rounded w-full"
                        style={{ 
                          backgroundImage: 'linear-gradient(90deg, rgba(21, 27, 48, 0.6) 0%, rgba(31, 41, 73, 0.6) 50%, rgba(21, 27, 48, 0.6) 100%)',
                          backgroundSize: '200% 100%',
                          animation: 'shimmer 2s infinite linear',
                          animationDelay: '0.1s'
                        }}
                      />
                      <div 
                        className="h-3 bg-mirage-800/60 rounded w-5/6"
                        style={{ 
                          backgroundImage: 'linear-gradient(90deg, rgba(21, 27, 48, 0.6) 0%, rgba(31, 41, 73, 0.6) 50%, rgba(21, 27, 48, 0.6) 100%)',
                          backgroundSize: '200% 100%',
                          animation: 'shimmer 2s infinite linear',
                          animationDelay: '0.2s'
                        }}
                      />
                      <div className="pt-2">
                        <div 
                          className="h-3 bg-mirage-800/60 rounded w-1/2"
                          style={{ 
                            backgroundImage: 'linear-gradient(90deg, rgba(21, 27, 48, 0.6) 0%, rgba(31, 41, 73, 0.6) 50%, rgba(21, 27, 48, 0.6) 100%)',
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 2s infinite linear',
                            animationDelay: '0.3s'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              :
                // Actual Cards
                puzzles.map((puzzle, index) => (
                  <Link href={puzzle.href} key={index} className="group">
                    <div 
                      className="relative overflow-hidden rounded-lg bg-gradient-to-br from-mirage-900/50 via-mirage-900/40 to-mirage-800/50 backdrop-blur-md border border-spring-green-500/20 hover:border-spring-green-400/60 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-spring-green-500/20 hover:-translate-y-2"
                      style={{ 
                        minHeight: '320px',
                        display: 'flex',
                        flexDirection: 'column',
                        animation: `fadeSlideIn 600ms ease-out ${index * 100}ms forwards`,
                        opacity: 0
                      }}
                    >
                      {/* Sleek Corner Brackets */}
                      <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-spring-green-500/30 group-hover:border-spring-green-400/80 transition-all duration-300" />
                      <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-spring-green-500/30 group-hover:border-spring-green-400/80 transition-all duration-300" />
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-spring-green-500/30 group-hover:border-spring-green-400/80 transition-all duration-300" />
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-spring-green-500/30 group-hover:border-spring-green-400/80 transition-all duration-300" />
                      
                      {/* Top Data Bar */}
                      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-spring-green-500/20 to-transparent group-hover:via-spring-green-400/40 transition-colors duration-300" />
                      
                      <div className="aspect-video relative overflow-hidden flex-shrink-0">
                        <Image
                          src={puzzle.img}
                          alt={puzzle.title}
                          width={400}
                          height={225}
                          className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-mirage-950 via-mirage-950/30 to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-300"></div>
                      </div>
                      
                      <div className="p-3 space-y-1 flex flex-col flex-grow">
                        <div className="relative pb-0.5">
                          <h3 className="text-lg font-bold text-white group-hover:text-spring-green-300 transition-colors duration-300 font-mono tracking-wide">
                            {puzzle.title}
                          </h3>
                          <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full bg-gradient-to-r from-spring-green-400 to-transparent transition-all duration-300"></div>
                        </div>
                        
                        <p className="text-gray-400 text-xs leading-snug group-hover:text-gray-300 transition-colors duration-300 flex-grow">
                          {puzzle.description}
                        </p>
                        
                        <div className="flex items-center justify-between pt-0.5">
                          <span className="inline-flex items-center text-spring-green-400 text-xs font-mono font-semibold group-hover:text-spring-green-300 tracking-wider">
                            <span className="mr-1.5 text-spring-green-500/60 text-sm">›</span>
                            LAUNCH
                            <svg className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </span>
                          
                          <div className="flex gap-1 items-center">
                            <div className="w-1 h-1 bg-spring-green-400 rounded-full opacity-60"></div>
                            <div className="w-1 h-1 bg-spring-green-400 rounded-full opacity-80"></div>
                            <div className="w-1 h-1 bg-spring-green-400 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              }
            </div>

            {/* Scroll Indicator */}
            {!isLoading && (
              <div className="flex justify-center pt-12 pb-4">
                <div className="flex flex-col items-center gap-3">
                  <span className="text-gray-400 text-sm font-medium">Scroll for more</span>
                  <FontAwesomeIcon 
                    icon={faChevronDown} 
                    className="text-spring-green-400 text-2xl"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom duration-1000">
            <div className="group bg-gradient-to-br from-mirage-900/80 to-mirage-950/80 backdrop-blur-sm rounded-xl p-6 border-2 border-spring-green-500/30 hover:border-spring-green-600 transition-all duration-500 hover:shadow-xl hover:shadow-spring-green-900/20 hover:-translate-y-2">
              <div className="mb-4"><Target className="w-12 h-12 text-spring-green-400 group-hover:scale-110 transition-transform duration-300" /></div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-spring-green-300 transition-colors duration-300">Authentic Experience</h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                Pixel-perfect replicas of NoPixel 4.0 minigames with identical mechanics, visuals, and difficulty levels. Practice in an environment that mirrors the real thing.
              </p>
            </div>
            <div className="group bg-gradient-to-br from-mirage-900/80 to-mirage-950/80 backdrop-blur-sm rounded-xl p-6 border-2 border-spring-green-500/30 hover:border-spring-green-600 transition-all duration-500 hover:shadow-xl hover:shadow-spring-green-900/20 hover:-translate-y-2">
              <div className="mb-4"><Trophy className="w-12 h-12 text-spring-green-400 group-hover:scale-110 transition-transform duration-300" /></div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-spring-green-300 transition-colors duration-300">Global Leaderboards</h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                Compete with players worldwide. Track your performance, set personal records, and climb to the top of the rankings for each minigame.
              </p>
            </div>
            <div className="group bg-gradient-to-br from-mirage-900/80 to-mirage-950/80 backdrop-blur-sm rounded-xl p-6 border-2 border-spring-green-500/30 hover:border-spring-green-600 transition-all duration-500 hover:shadow-xl hover:shadow-spring-green-900/20 hover:-translate-y-2">
              <div className="mb-4"><Zap className="w-12 h-12 text-spring-green-400 group-hover:scale-110 transition-transform duration-300" /></div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-spring-green-300 transition-colors duration-300">Risk-Free Practice</h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                Build muscle memory and improve reaction times without in-game consequences. Perfect your technique through unlimited practice attempts.
              </p>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-gradient-to-br from-mirage-900/80 to-mirage-950/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 sm:p-10 border-2 border-spring-green-500/30 hover:border-spring-green-400/60 transition-all duration-500 animate-in fade-in slide-in-from-bottom" style={{ animationDuration: '1000ms' }}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 bg-gradient-to-r from-spring-green-400 to-aquamarine-400 bg-clip-text text-transparent">
              About NoPixel Hacking Simulator
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed text-lg">
              <p className="hover:text-gray-200 transition-colors duration-300">
                Welcome to the most comprehensive NoPixel 4.0 hacking simulator available online. 
                This platform provides authentic replicas of the challenging minigames featured in the popular Grand Theft Auto V roleplay 
                server, NoPixel. Whether you&apos;re a seasoned criminal looking to hone your skills or a curious newcomer wanting to experience 
                the thrill of virtual heists, this simulator offers the perfect training ground.
              </p>
              <p className="hover:text-gray-200 transition-colors duration-300">
                NoPixel is renowned for its intricate and demanding hacking mechanics that add an exciting layer of challenge to various 
                criminal activities within the game. From breaking into high-security facilities to cracking advanced security systems, 
                each minigame requires precision, quick thinking, and practice. Our simulator recreates these experiences with pixel-perfect 
                accuracy, allowing you to practice and improve your skills without the pressure of in-game consequences.
              </p>
              <p className="hover:text-gray-200 transition-colors duration-300">
                Each minigame has been carefully crafted to match the look, feel, and mechanics of the original NoPixel 4.0 implementations. 
                Test your reflexes with the Thermite hack, demonstrate your pattern recognition with the Word Memory 
                challenge, or prove your coordination with the Roof Running game. Track your progress with our integrated highscore system 
                and compete with players from around the world.
              </p>
            </div>
          </div>

          {/* Highscores Section */}
          <div className="bg-gradient-to-br from-mirage-900/80 to-mirage-950/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 sm:p-10 border-2 border-spring-green-500/30 text-center hover:border-spring-green-400/60 transition-all duration-500 animate-in fade-in slide-in-from-bottom" style={{ animationDuration: '1000ms' }}>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-spring-green-400 to-aquamarine-400 bg-clip-text text-transparent">
              Global Leaderboards
            </h2>
            <p className="text-gray-400 text-lg mb-6 max-w-2xl mx-auto hover:text-gray-300 transition-colors duration-300">
              Compete with players worldwide! Visit the <Link href="/leaderboards" className="text-spring-green-400 hover:text-spring-green-300 font-semibold underline">Leaderboards</Link> page to see top performers for each minigame.
            </p>
          </div>

          {/* Community Section */}
          <div className="bg-gradient-to-br from-mirage-900/80 to-mirage-950/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 sm:p-10 border-2 border-spring-green-500/30 hover:border-spring-green-400/60 transition-all duration-500 animate-in fade-in slide-in-from-bottom" style={{ animationDuration: '1000ms' }}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 bg-gradient-to-r from-spring-green-400 to-aquamarine-400 bg-clip-text text-transparent">
              Open Source & Community
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed text-lg">
              <p className="hover:text-gray-200 transition-colors duration-300">
                This project is completely open source and available on GitHub. We welcome contributions from the community, whether 
                it&apos;s bug reports, feature suggestions, or code contributions. The codebase is built with modern web technologies 
                including Next.js, React, and TypeScript, making it easy for developers to understand and contribute.
              </p>
              <p className="hover:text-gray-200 transition-colors duration-300">
                If you find this simulator helpful, consider starring the repository on GitHub or sharing it with your fellow NoPixel 
                enthusiasts. Your support helps us continue to improve and maintain this free resource for the community. We&apos;re constantly 
                working to add new features, improve existing minigames, and ensure the simulator stays up-to-date with the latest NoPixel updates.
              </p>
              <div className="pt-4">
                <Link 
                  href="https://github.com/MaximilianAdF/NoPixel-MiniGames-4.0" 
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-mirage-800 hover:bg-mirage-700 text-spring-green-300 hover:text-spring-green-400 font-semibold rounded-lg transition-all duration-300 border border-mirage-700 hover:border-spring-green-600 hover:scale-105"
                  target="_blank"
                >
                  <FontAwesomeIcon icon={faFileLines} className="size-5 group-hover:rotate-12 transition-transform duration-300" />
                  View on GitHub
                </Link>
              </div>
            </div>
          </div>

          {/* FAQ Section for SEO */}
          <div className="bg-gradient-to-br from-mirage-900/80 to-mirage-950/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 sm:p-10 border-2 border-spring-green-500/30 hover:border-spring-green-400/60 transition-all duration-500">
            <Script
              id="faq-structured-data"
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": "What is NoPixel 4.0?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "NoPixel 4.0 is the latest version of the most popular Grand Theft Auto V roleplay server, featuring advanced hacking mechanics and challenging minigames that players must master to succeed in various criminal activities."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "How accurate are these minigame replicas?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Our simulators are pixel-perfect replicas with identical mechanics, timing, and difficulty levels to the actual NoPixel 4.0 minigames. We regularly update them to match any changes on the server."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Is this practice tool free to use?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Yes! All minigames are completely free to play with unlimited practice attempts. No registration or payment required."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Which minigames are available?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "We offer practice for Thermite, Lockpick, Laundromat, Roof Running, Word Memory, PinCracker, Chopping, and RepairKit minigames - all essential skills for NoPixel 4.0 gameplay."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Can I compete with other players?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Absolutely! Each minigame features global leaderboards where you can track your performance, compare scores, and compete with players worldwide."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Do I need to download anything?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "No downloads necessary! The simulator runs entirely in your web browser. Just visit the site and start practicing immediately."
                      }
                    }
                  ]
                })
              }}
            />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 bg-gradient-to-r from-spring-green-400 to-aquamarine-400 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6 text-gray-300">
              <div className="border-l-4 border-spring-green-500/30 pl-6 hover:border-spring-green-500 transition-colors duration-300">
                <h3 className="text-xl font-bold text-white mb-2">What is NoPixel 4.0?</h3>
                <p className="leading-relaxed">
                  NoPixel 4.0 is the latest version of the most popular Grand Theft Auto V roleplay server, featuring advanced hacking mechanics and challenging minigames that players must master to succeed in various criminal activities.
                </p>
              </div>
              
              <div className="border-l-4 border-spring-green-500/30 pl-6 hover:border-spring-green-500 transition-colors duration-300">
                <h3 className="text-xl font-bold text-white mb-2">How accurate are these minigame replicas?</h3>
                <p className="leading-relaxed">
                  Our simulators are pixel-perfect replicas with identical mechanics, timing, and difficulty levels to the actual NoPixel 4.0 minigames. We regularly update them to match any changes on the server.
                </p>
              </div>
              
              <div className="border-l-4 border-spring-green-500/30 pl-6 hover:border-spring-green-500 transition-colors duration-300">
                <h3 className="text-xl font-bold text-white mb-2">Is this practice tool free to use?</h3>
                <p className="leading-relaxed">
                  Yes! All minigames are completely free to play with unlimited practice attempts. No registration or payment required.
                </p>
              </div>
              
              <div className="border-l-4 border-spring-green-500/30 pl-6 hover:border-spring-green-500 transition-colors duration-300">
                <h3 className="text-xl font-bold text-white mb-2">Which minigames are available?</h3>
                <p className="leading-relaxed">
                  We offer practice for Thermite, Lockpick, Laundromat, Roof Running, Word Memory, PinCracker, Chopping, and RepairKit minigames - all essential skills for NoPixel 4.0 gameplay.
                </p>
              </div>
              
              <div className="border-l-4 border-spring-green-500/30 pl-6 hover:border-spring-green-500 transition-colors duration-300">
                <h3 className="text-xl font-bold text-white mb-2">Can I compete with other players?</h3>
                <p className="leading-relaxed">
                  Absolutely! Each minigame features global leaderboards where you can track your performance, compare scores, and compete with players worldwide.
                </p>
              </div>
              
              <div className="border-l-4 border-spring-green-500/30 pl-6 hover:border-spring-green-500 transition-colors duration-300">
                <h3 className="text-xl font-bold text-white mb-2">Do I need to download anything?</h3>
                <p className="leading-relaxed">
                  No downloads necessary! The simulator runs entirely in your web browser. Just visit the site and start practicing immediately.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-gray-500 border-t-2 border-spring-green-500/30 mt-12">
          <p className="text-sm hover:text-gray-400 transition-colors duration-300">
            This is a fan-made simulator and is not affiliated with NoPixel or Rockstar Games. All trademarks belong to their respective owners.
          </p>
          <p className="text-sm mt-2 hover:text-gray-400 transition-colors duration-300 flex items-center justify-center gap-2">
            Built with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for the NoPixel community
          </p>
        </footer>
        
        {/* <DonateContainer title="Donate" description="If you like this project, consider donating to support development" className="absolute bottom-0 left-0 px-5 py-5 w-80">
          <a href="https://www.buymeacoffee.com/MaximilianAdF" target="_blank" rel="noreferrer">
              <img src={bmcLogo.src} alt="Buy Me A Coffee" className="rounded-lg bg-spring-green-300" style={{ height: 60 }} />
          </a>
        </DonateContainer> */}

      </main>
  );
}
