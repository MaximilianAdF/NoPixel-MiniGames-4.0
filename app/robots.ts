import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteConfig";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/SmokeCrack/",
        "/LockPick/",
        "/Thermite/",
        "/RoofRunning/",
        "/Laundromat/",
        "/RepairKit/",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
