import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Assuming this is the prisma client path

const DEFAULT_PRODUCTS = [
  // Gifts
  { id: "g1", name: "Magic Mug", price: 350, category: "Gift", image: "https://res.cloudinary.com/e5pnwpo5/image/upload/f_auto,q_auto/sss-store/magic-mug" },
  { id: "g2", name: "Crystal Photo Cube", price: 850, category: "Gift", image: "https://res.cloudinary.com/e5pnwpo5/image/upload/f_auto,q_auto/sss-store/crystal-cube" },
  { id: "g3", name: "Custom Keychain", price: 150, category: "Gift", image: "https://res.cloudinary.com/e5pnwpo5/image/upload/f_auto,q_auto/sss-store/custom-keychain" },
  { id: "g4", name: "LED Photo Lamp", price: 1200, category: "Gift", image: "https://res.cloudinary.com/e5pnwpo5/image/upload/f_auto,q_auto/sss-store/led-photo-lamp" },

  // Passports
  { id: "p1", name: "8 Passport Size Photos", price: 100, category: "Passport", image: "https://res.cloudinary.com/e5pnwpo5/image/upload/f_auto,q_auto/passport-mockup" },
  { id: "p2", name: "8 Passport + 8 Stamp Size", price: 150, category: "Passport", image: "https://res.cloudinary.com/e5pnwpo5/image/upload/f_auto,q_auto/passport-mockup" },
  { id: "p3", name: "16 Stamp Size Photos", price: 100, category: "Passport", image: "https://res.cloudinary.com/e5pnwpo5/image/upload/f_auto,q_auto/passport-mockup" }
];

export async function GET() {
  try {
    // Check if there are any products
    let products = await prisma.product.findMany();

    // If empty, seed the default products
    if (products.length === 0) {
      await prisma.product.createMany({
        data: DEFAULT_PRODUCTS,
      });
      products = await prisma.product.findMany();
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products from DB, falling back to defaults:", error);
    // In case DB connection fails, return the default products so the frontend still works
    return NextResponse.json(DEFAULT_PRODUCTS);
  }
}
