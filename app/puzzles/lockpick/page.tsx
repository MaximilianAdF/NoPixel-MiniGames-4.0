import type { Metadata } from "next";
import Lockpick from "@/app/puzzles/lockpick/Lockpick";

export const metadata: Metadata = {
  title: "Lockpick",
};

export default function Page() {
    return <Lockpick />;
}
