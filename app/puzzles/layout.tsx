// import "./puzzle.css";
import Script from "next/script";
import RepairKit from "@/app/puzzles/repair-kit/RepairKit";
import Link from "next/link";

// import "./puzzle.css";

export default function PuzzleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <>
          <Script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/js/all.min.js"/>
          <nav className="
                fixed w-full h-16
                flex items-start justify-start
                gap-2.5 px-5
                z-50
            ">
              {/* TODO: Use more standard navbar practices like "Home" or an icon instead of "Check other minigames" */}
              <Link href="/" className="
                    rounded-full
                    my-auto py-2.5 px-5
                    text-black
                    bg-spring-green-300
                    shadow-[0_0_3px_rgb(127_255_191)]
                    transition-all
                    duration-200
                    text-base
                    select-none

                    hover:[box-shadow:rgba(127,255,191,0.397)_0_-25px_18px_-14px_inset,rgba(127,255,191,0.397)_0_1px_2px,rgba(127,255,191,0.397)_0_2px_4px,rgba(127,255,191,0.397)_0_4px_8px,rgba(127,255,191,0.397)_0_8px_16px,rgba(127,255,191,0.397)_0_16px_32px]
                    hover:scale-110
                    ">
                  {/* TODO: Before react rewrite, this had touch-manipulation set. Is that needed? */}
                  {/* Edit: I don't think so, probably safe to remove it. */}
                  <i className='fas fa-house'></i>
              </Link>
          </nav>
          <main className="absolute h-screen w-screen pt-16">
              <div className="h-full w-full p-5 m-auto flex items-center justify-center">
                  {children}
                  {/*<div className="h-full w-full flex items-center justify-center">*/}
                  {/*{children}*/}
                  {/*</div>*/}
              </div>
          </main>
      </>
  );
}
