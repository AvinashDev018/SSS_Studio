import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

const mockFindUnique = vi.fn();
const mockCreate = vi.fn();
const mockFindMany = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    promo: {
      findUnique: (...a) => mockFindUnique(...a),
      create: (...a) => mockCreate(...a),
      findMany: (...a) => mockFindMany(...a),
      update: (...a) => mockUpdate(...a),
      delete: (...a) => mockDelete(...a),
    },
  },
}));

describe("promo pipeline", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("validates active promo codes for checkout", async () => {
    mockFindUnique.mockResolvedValue({
      id: "1",
      code: "WEDDING2026",
      discount: 10,
      type: "percentage",
      active: true,
      uses: 0,
    });

    const { validatePromoCode } = await import("@/app/actions/promos");
    const res = await validatePromoCode("wedding2026");
    expect(res.success).toBe(true);
    expect(res.promo.code).toBe("WEDDING2026");
    expect(res.promo.discount).toBe(10);
  });

  it("rejects inactive promo codes", async () => {
    mockFindUnique.mockResolvedValue({
      id: "1",
      code: "OLD",
      discount: 10,
      type: "percentage",
      active: false,
      uses: 0,
    });

    const { validatePromoCode } = await import("@/app/actions/promos");
    const res = await validatePromoCode("OLD");
    expect(res.success).toBe(false);
  });
});
