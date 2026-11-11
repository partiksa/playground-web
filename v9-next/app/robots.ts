import type { MetadataRoute } from "next";
import { SITE } from "@/lib/i18n";

export const dynamic = "force-static";

const BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Googlebot", "Bingbot"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }, ...BOTS.map((userAgent) => ({ userAgent, allow: "/" }))],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
