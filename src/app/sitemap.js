import { SITE_URL } from "@/lib/site";

export default async function sitemap() {
  const now = new Date().toISOString();

  const routes = [
    { path: "", priority: 1.0, changeFrequency: "weekly" },
    { path: "/services", priority: 0.9, changeFrequency: "weekly" },
    { path: "/packages", priority: 0.9, changeFrequency: "weekly" },
    { path: "/gallery", priority: 0.8, changeFrequency: "weekly" },
    { path: "/store", priority: 0.8, changeFrequency: "weekly" },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
    { path: "/book", priority: 0.8, changeFrequency: "weekly" },
    { path: "/visualizer", priority: 0.6, changeFrequency: "monthly" },
    { path: "/track", priority: 0.5, changeFrequency: "monthly" },
    { path: "/support", priority: 0.5, changeFrequency: "monthly" },
  ];

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
