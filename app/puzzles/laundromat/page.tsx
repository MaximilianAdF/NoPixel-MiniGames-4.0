import type { Metadata } from "next";
import Laundromat from "@/app/puzzles/laundromat/Laundromat";

export const metadata: Metadata = {
  title: "Laundromat",
};

export default function Page() {
    return <Laundromat />;
}
