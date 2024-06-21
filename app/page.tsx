import Image from "next/image";
import Link from "next/link";

import { thermiteImg } from "@/public/images/puzzles";
import { describe } from "node:test";

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
    href: "SmokeCrack/SmokeCrack.html",
    img: "https://github.com/MaximilianAdF/NoPixel-MiniGames-4.0/assets/63980031/3d2d218e-ec33-4b16-a981-56a16771aa64",
    title: "SmokeCrack",
    description: "Replica of the SmokeCrack hack that is triggered through the in-game PC when hacking Wi-Fi's on NoPixel 4.0"
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
]

export default function Home() {
  return (
      <main className="flex min-h-screen flex-col items-center p-5 gap-5 ">
        <div className="
          w-full max-w-2xl
          p-5 mx-auto
          flex items-center flex-col
          rounded-lg
          shadow

          bg-mirage-900/50
        ">
          <h1 className="text-white text-5xl m-0 pb-5">NoPixel Hacking Simulator</h1>
          <p className="
            text-white
            text-xl
            text-center

            *:text-spring-green-300 hover:*:text-aquamarine-300
            ">
            Hover over the below <a>images</a> to discover the minigames that are currently available. For more
            information checkout the <Link href="https://github.com/MaximilianAdF/NoPixel-MiniGames-4.0">GitHub Repository</Link>.
          </p>
        </div>
        <div className="flex flex-wrap justify-center max-w-4xl mx-auto">
          {puzzles.map((puzzle, index) => {
            return (
              <div className="flex-item m-2 p-2 rounded-lg text-center relative overflow-hidden bg-spring-green-300 shadow" key={index}>
                <Link href={puzzle.href} className="">
                  <Image
                      src={puzzle.img}
                      alt={puzzle.title}
                      width={250}
                      height={124}
                      className="rounded"
                  />
                  <div className="
                    absolute
                    top-0
                    left-0
                    w-full h-full
                    opacity-0
                    flex justify-center flex-col items-center
                    transition
                    duration-500
                    ease-in-out
                    bg-black/50

                    text-white
                    text-center

                    hover:opacity-100
                  ">
                    <h2 className="text-3xl">{puzzle.title}</h2>
                    <p className="text-xs max-w-[80%]">{puzzle.description}</p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
        <div className="
          w-full max-w-2xl
          p-5 mx-auto
          flex flex-col items-center
          shadow
          rounded-lg

          text-white
          text-center

          bg-mirage-900/50
        ">
          <h2 className="text-5xl pb-5">Highscores</h2>
          <p className="text-xl max-w-[80%]">Coming soon...</p>
        </div>
      </main>
  );
}
