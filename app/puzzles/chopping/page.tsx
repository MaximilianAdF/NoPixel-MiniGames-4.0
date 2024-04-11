import type { Metadata } from "next";
import Chopping from "@/app/puzzles/chopping/Chopping";

export const metadata: Metadata = {
  title: "Chopping",
};

export default function Page() {
    return <Chopping />;
}