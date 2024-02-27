import Image from "next/image";

import "./page.css";

const puzzles = [
  {
    href: "RoofRunning/RoofRunning.html",
    img: "https://github.com/MaximilianAdF/NoPixel-MiniGames-4.0/assets/63980031/7d94e398-ae40-45d2-ae25-d20fa5a62301",
    title: "Roof Running",
    description: "Replica of the Roof Running hack that is triggered when robbing AC-Units on NoPixel 4.0"
  },
  {
    href: "Laundromat/Laundromat.html",
    img: "https://github.com/MaximilianAdF/NoPixel-MiniGames-4.0/assets/63980031/7a0a6e18-a39f-45b8-b186-5d0069241ce0",
    title: "Laundromat",
    description: "Replica of the Laundromat hack that is triggered when robbing the safe inside the south-side Laundromat on NoPixel 4.0"
  },
  {
    href: "LockPick/LockPick.html",
    img: "https://github.com/MaximilianAdF/NoPixel-MiniGames-4.0/assets/63980031/e5e00eac-ea19-46e1-944c-67c7ff8ca5cf",
    title: "LockPick",
    description: "Replica of the LockPick hack that is triggered when lockpicking vehicles, among other things, on NoPixel 4.0"
  },
  {
    href: "RepairKit/RepairKit.html",
    img: "https://github.com/MaximilianAdF/NoPixel-MiniGames-4.0/assets/63980031/4888fd16-2b24-44c0-9952-275ddb626332",
    title: "RepairKit",
    description: "Replica of the RepairKit hack that is triggered when repairing vehicles on NoPixel 4.0"
  },
  {
    href: "SmokeCrack/SmokeCrack.html",
    img: "https://github.com/MaximilianAdF/NoPixel-MiniGames-4.0/assets/63980031/3d2d218e-ec33-4b16-a981-56a16771aa64",
    title: "SmokeCrack",
    description: "Replica of the SmokeCrack hack that is triggered through the in-game PC when hacking Wi-Fi's on NoPixel 4.0"
  },
]

export default function Home() {
  return (
      <main > {/* className="flex min-h-screen flex-col items-center justify-between p-24" */}
        <div className="header w-4/5 max-w-xl my-5 mx-auto flex items-center flex-col p-5 rounded-lg shadow-[0_0_10px_0_rgba(0,0,0,0.5)]">
          <h1 className="text-white text-5xl m-0 font-bold pb-5">NoPixel Hacking Simulator</h1>
          <p className="text-white text-xl text-center">Hover over the below <a>images</a> to discover the minigames that are currently available. For more
            information checkout the <a href="https://github.com/MaximilianAdF/NoPixel-MiniGames-4.0">GitHub
              Repository</a></p>
        </div>
        <div className="flex flex-wrap justify-center max-w-4xl m-auto">
          {puzzles.map((puzzle, index) => {
            return (
              <div className="flex-item m-2 p-2 rounded-lg text-center relative overflow-hidden bg-[rgb(84,255,164)] shadow-[0_0_0.5rem_0_rgb(127,255,191)]" key={index}>
                <a href={puzzle.href}>
                  <Image
                      src={puzzle.img}
                      alt={puzzle.title}
                      width={250}
                      height={124}
                      className="rounded"
                  />
                  <div className="overlay">
                    <h2>{puzzle.title}</h2>
                    <p>{puzzle.description}</p>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
        <div className="highscores">
          <h2>Highscores</h2>
          <p>Coming soon...</p>
        </div>
      </main>
  );
}
