"use client";

// import "./puzzle.css";
import DonateContainer from "@/app/components/DonateContainer";
import ErrorBoundary from "@/app/components/ErrorBoundary";
import bmcLogo from "../utils/bmc-logo.png";

export default function PuzzleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <>
          <main
            className="fixed inset-0 pt-16 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgb(5, 15, 25) 0%, rgb(7, 19, 32) 25%, rgb(10, 25, 40) 50%, rgb(7, 19, 32) 75%, rgb(5, 15, 25) 100%)',
              height: 'calc(100dvh - env(keyboard-inset-height, 0px))',
              paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + env(keyboard-inset-height, 0px))',
            }}
          >
              {/* Subtle Background Grid - simplified for performance */}
              <div className="fixed inset-0 opacity-5 pointer-events-none" aria-hidden="true">
                <div className="absolute inset-0" 
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(100, 180, 150, 0.15) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(100, 180, 150, 0.15) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px',
                    willChange: 'auto',
                  }}
                />
              </div>

              {/* Subtle Ambient Glow - reduced blur for better performance */}
              <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-15" aria-hidden="true">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-2xl" 
                  style={{ background: 'radial-gradient(circle, rgba(100, 180, 150, 0.2) 0%, transparent 70%)' }}
                />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-2xl" 
                  style={{ background: 'radial-gradient(circle, rgba(70, 140, 200, 0.15) 0%, transparent 70%)' }}
                />
              </div>

              <div
                className="h-full w-full p-5 m-auto flex items-center justify-center relative z-10"
                style={{
                  paddingBottom: 'calc(env(keyboard-inset-height, 0px) + env(safe-area-inset-bottom, 0px))',
                }}
              >
                  <ErrorBoundary>
                    {children}
                  </ErrorBoundary>
              </div>
          </main>
      </>
  );
}
