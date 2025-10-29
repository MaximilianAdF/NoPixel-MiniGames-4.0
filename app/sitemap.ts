import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://no-px.vercel.app";

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
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...minigameUrls,
  ];
}
