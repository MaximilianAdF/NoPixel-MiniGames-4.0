import type { Metadata } from "next";
import RepairKit from "./RepairKit";

export const metadata: Metadata = {
  title: "RepairKit",
};

export default function Page() {
    return (
        <RepairKit/>
    );
}
