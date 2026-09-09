import { describe, it, expect } from "vitest";
import { findRouteForQuery, buildWebsiteGuideReply, WEBSITE_MAP } from "@/lib/agent/websiteKnowledge";

describe("chatbot website training knowledge", () => {
  it("maps common questions to the correct routes", () => {
    expect(findRouteForQuery("where is packages pricing").path).toBe("/packages");
    expect(findRouteForQuery("open the store cart").path).toBe("/store");
    expect(findRouteForQuery("track my order").path).toBe("/track");
    expect(findRouteForQuery("gallery portfolio photos").path).toBe("/gallery");
    expect(findRouteForQuery("how to book consultation").path).toBe("/book");
  });

  it("builds a website guide that lists key pages", () => {
    const guide = buildWebsiteGuideReply({
      lang: "en",
      packagesText: "• Package 1: ₹45,000",
      framesText: "• 8x10: ₹349",
    });
    expect(guide).toContain("/packages");
    expect(guide).toContain("/store");
    expect(guide).toContain("/track");
    expect(guide).toContain("Package 1");
  });

  it("includes how-to flows a developer would document", () => {
    expect(WEBSITE_MAP.howTos.bookShoot).toMatch(/book/i);
    expect(WEBSITE_MAP.howTos.buyFrame).toMatch(/store/i);
    expect(WEBSITE_MAP.howTos.trackOrder).toMatch(/track/i);
    expect(WEBSITE_MAP.howTos.usePromo).toMatch(/promo/i);
  });
});
