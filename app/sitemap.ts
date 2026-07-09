import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteConfig";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;

  // Stable content date — bump when pages get a real content refresh. Previously
  // every entry was stamped `new Date()` each deploy, so <lastmod> changed
  // constantly and told crawlers nothing about actual freshness.
  const UPDATED = new Date("2026-07-09");

  // Define all minigame routes
  const minigames = [
    "thermite",
    "roof-running",
    "laundromat",
    "lockpick",
    "repair-kit",
    "word-memory",
    "chopping",
    "pincracker",
  ];

  // Generate sitemap entries for each minigame
  const minigameUrls = minigames.map((game) => ({
    url: `${baseUrl}/puzzles/${game}`,
    lastModified: UPDATED,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Generate sitemap entries for each guide (high priority for SEO)
  const guideUrls = minigames.map((game) => ({
    url: `${baseUrl}/guides/${game}`,
    lastModified: UPDATED,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  // Server landing pages (NoPixel-style minigame practice per FiveM community)
  const servers = ["prodigy-rp", "new-day-rp"];

  const serverUrls = servers.map((server) => ({
    url: `${baseUrl}/servers/${server}`,
    lastModified: UPDATED,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  // Other important pages
  const otherPages = [
    {
      url: `${baseUrl}/leaderboards`,
      lastModified: UPDATED,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/daily-challenge`,
      lastModified: UPDATED,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/open-source`,
      lastModified: UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/lobby`,
      lastModified: UPDATED,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/servers`,
      lastModified: UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guides/nopixel-heist-guide`,
      lastModified: UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guides/improving-reaction-time`,
      lastModified: UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ];

  return [
    {
      url: baseUrl,
      lastModified: UPDATED,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/nopixel-5`,
      lastModified: UPDATED,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: UPDATED,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...guideUrls,
    ...minigameUrls,
    ...serverUrls,
    ...otherPages,
  ];
}
