"use client";

// import "./puzzle.css";
import Script from "next/script";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import DonateContainer from "@/app/components/DonateContainer";
import bmcLogo from "../utils/bmc-logo.png";

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
          {/*<DonateContainer title="Donate" description="If you like this project, consider donating to support development" className="absolute bottom-0 left-0 px-5 py-5 w-80">
            <a href="https://www.buymeacoffee.com/MaximilianAdF" target="_blank" rel="noreferrer">
                <img src={bmcLogo.src} alt="Buy Me A Coffee" className="rounded-lg bg-spring-green-300" style={{ height: 60 }} />
            </a>
          </DonateContainer>*/}
      </>
  );
}
