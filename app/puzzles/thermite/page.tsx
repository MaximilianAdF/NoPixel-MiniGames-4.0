import type { Metadata } from "next";
import Thermite from "@/app/puzzles/thermite/Thermite";

export const metadata: Metadata = {
  title: "Thermite - NP MiniGames 4.0",
};

export default function Page() {
  return <Thermite />;
}
