export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/login", "/profile", "/demo/"],
    },
    sitemap: "https://sssstudio.online/sitemap.xml",
    host: "https://sssstudio.online",
  };
}
