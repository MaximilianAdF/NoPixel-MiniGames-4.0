// import "./puzzle.css";
import Script from "next/script";
import RepairKit from "@/app/puzzles/repair-kit/RepairKit";
import Link from "next/link";


export default function PuzzleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <>
          <Script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/js/all.min.js"/>
          <main className="flex flex-col min-h-screen">
              <nav className="
                flex items-start justify-start
                gap-2.5
                p-5
                bg-mirage-900/50
            ">
                  <Link href="/" className="
                    rounded-full
                    py-2.5 px-5
                    text-black
                    bg-spring-green-300
                    shadow-[0_0_3px_rgb(127_255_191)]
                    transition-all
                    duration-200
                    text-base
                    select-none

                    hover:[box-shadow:rgba(127,255,191,0.397)_0_-25px_18px_-14px_inset,rgba(127,255,191,0.397)_0_1px_2px,rgba(127,255,191,0.397)_0_2px_4px,rgba(127,255,191,0.397)_0_4px_8px,rgba(127,255,191,0.397)_0_8px_16px,rgba(127,255,191,0.397)_0_16px_32px]
                    hover:scale-105 hover:-rotate-1
                    ">
                      {/* TODO: Before react rewrite, this had touch-manipulation set. Is that needed? */}
                      Check other Mini-games
                  </Link>
              </nav>
              <div className="grow w-[90%] py-5 m-auto flex">
                  {children}
              </div>
          </main>
      </>
  );
}
