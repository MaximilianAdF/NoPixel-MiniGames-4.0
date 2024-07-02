"use client";

// import "./puzzle.css";
import Script from "next/script";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";


export default function PuzzleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <>
          <Script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/js/all.min.js"/>
          <nav className="
                fixed h-16
                flex items-start justify-between
                gap-2.5 px-5 py-5
                z-50
            ">
              {/* TODO: Use more standard navbar practices like "Home" or an icon instead of "Check other minigames" */}
              <a href='/'>
                <FontAwesomeIcon
                  icon={faHouse}
                  className="cursor-pointer text-spring-green-300 size-9 hover:scale-110 duration-200"
                  title="Return to Home Page"
                />
              </a>
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
