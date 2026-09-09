import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

const mockFindMany = vi.fn();
const mockCreateMany = vi.fn();
const mockCreate = vi.fn();
const mockDelete = vi.fn();
const mockFindUnique = vi.fn();
const mockGalleryCreateMany = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    package: {
      findMany: (...args) => mockFindMany(...args),
      createMany: (...args) => mockCreateMany(...args),
      create: (...args) => mockCreate(...args),
      delete: (...args) => mockDelete(...args),
    },
    galleryPhoto: {
      createMany: (...args) => mockGalleryCreateMany(...args),
    },
    clientGallery: {
      findUnique: (...args) => mockFindUnique(...args),
    },
  },
}));

describe("admin → live packages pipeline", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("seeds official catalog into DB when empty so admin add does not wipe live list", async () => {
    mockFindMany
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([
        { id: "1", name: "Package 1 - Budget Quality", price: "₹45,000", description: "d", features: [], popular: false },
        { id: "2", name: "Package 2 - Classic Wedding", price: "₹75,000", description: "d", features: [], popular: false },
      ]);
    mockCreateMany.mockResolvedValue({ count: 9 });

    const { getPackages } = await import("@/app/actions/packages");
    const list = await getPackages();

    expect(mockCreateMany).toHaveBeenCalledTimes(1);
    expect(list.length).toBe(2);
    expect(list[0].name).toContain("Package 1");
  });

  it("returns DB packages without reseeding when catalog already exists", async () => {
    mockFindMany.mockResolvedValueOnce([
      { id: "a", name: "Package 3 - Elevated Drone & Screen", price: "₹90,000", description: "d", features: [], popular: true },
    ]);

    const { getPackages } = await import("@/app/actions/packages");
    const list = await getPackages();

    expect(mockCreateMany).not.toHaveBeenCalled();
    expect(list).toHaveLength(1);
  });
});

describe("client gallery photo batch revalidation path", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("revalidates client gallery slug after batch upload", async () => {
    const { revalidatePath } = await import("next/cache");
    mockGalleryCreateMany.mockResolvedValue({ count: 2 });
    mockFindUnique.mockResolvedValue({ slug: "srijitha-wedding" });

    const { addPhotosToGallery } = await import("@/app/actions/gallery");
    const result = await addPhotosToGallery("gal-1", [
      { url: "https://cdn.example/a.jpg", filename: "a.jpg" },
    ]);

    expect(result.success).toBe(true);
    expect(revalidatePath).toHaveBeenCalledWith("/client-gallery/srijitha-wedding");
    expect(revalidatePath).toHaveBeenCalledWith("/admin/galleries");
  });
});
