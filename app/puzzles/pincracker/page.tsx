import type { Metadata } from "next";
import Pincracker from "@/app/puzzles/pincracker/Pincracker";

export const metadata: Metadata = {
  title: "PinCracker - NP MiniGames 4.0",
};

export default function Page() {
    return <Pincracker />;
}