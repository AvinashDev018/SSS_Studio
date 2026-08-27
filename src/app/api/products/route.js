import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Assuming this is the prisma client path

const DEFAULT_PRODUCTS = [
  // Realistic AI Product Mockups - Standard
  { id: "g1", name: "Classic Wooden Photo Frame", price: 899, category: "Gift", image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787849569/ufg8zbedswxead69qhvj.jpg", hasCustomPhoto: true },
  { id: "g2", name: "Personalized Magic Mug", price: 499, category: "Gift", image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787849570/pwdvbfzdu1vktn0s4d9z.jpg", hasCustomPhoto: true },
  { id: "g3", name: "3D Crystal Photo Cube", price: 1499, category: "Gift", image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787849571/mu9ziwf9yijwnth0mlsj.jpg", hasCustomPhoto: true },
  { id: "g4", name: "Romantic Heart Frame", price: 650, category: "Gift", image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787849572/elyfvzgce3v3jukp7bfg.jpg", hasCustomPhoto: true },

  // Realistic AI Product Mockups - Custom Shapes (from User Templates)
  { id: "g5", name: "Acoustic Guitar Custom Frame", price: 1299, category: "Gift", image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787850200/nga5xcqyrc3augiyawu8.jpg", hasCustomPhoto: true },
  { id: "g6", name: "Butterfly Wing Custom Frame", price: 1150, category: "Gift", image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787850202/ldk02msw5bzsyonodpcj.jpg", hasCustomPhoto: true },
  { id: "g7", name: "Mr & Mrs Wedding Frame", price: 1099, category: "Gift", image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787850203/pfxez8gcazwtn0mybszf.jpg", hasCustomPhoto: true },
  { id: "g8", name: "LOVE Text Collage Frame", price: 950, category: "Gift", image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787850204/aoefnp4x6sa3wycdxrld.jpg", hasCustomPhoto: true },
  { id: "g9", name: "Custom Family Photo Puzzle", price: 550, category: "Gift", image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787850501/whydabv3tsfnscn6jas1.jpg", hasCustomPhoto: true },
  { id: "g10", name: "Personalized 3D Moon Lamp", price: 1100, category: "Gift", image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787850503/btyq7cbcwi7ucekqraur.jpg", hasCustomPhoto: true },


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
