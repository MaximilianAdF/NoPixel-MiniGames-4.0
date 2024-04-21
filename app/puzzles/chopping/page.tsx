import type { Metadata } from "next";
import Chopping from "@/app/puzzles/chopping/Chopping";

export const metadata: Metadata = {
  title: "Chopping - NP MiniGames 4.0",
};

export default function Page() {
    return <Chopping />;
}