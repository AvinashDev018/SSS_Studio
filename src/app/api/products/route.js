import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

let MEMORY_PRODUCTS = [
  // Realistic AI Product Mockups - Standard
  { id: "g1", name: "Classic Wooden Photo Frame", price: 899, category: "Gift", image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787849569/ufg8zbedswxead69qhvj.jpg", hasCustomPhoto: true },
  { id: "g2", name: "Personalized Magic Mug", price: 499, category: "Gift", image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787849570/pwdvbfzdu1vktn0s4d9z.jpg", hasCustomPhoto: true },
  { id: "g3", name: "3D Crystal Photo Cube", price: 1499, category: "Gift", image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787849571/mu9ziwf9yijwnth0mlsj.jpg", hasCustomPhoto: true },
  { id: "g4", name: "Romantic Heart Frame", price: 650, category: "Gift", image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787849572/elyfvzgce3v3jukp7bfg.jpg", hasCustomPhoto: true },

  // Realistic AI Product Mockups - Custom Shapes
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
    let products = await prisma.product.findMany();

    if (products.length === 0) {
      await prisma.product.createMany({
        data: MEMORY_PRODUCTS.map(({ id, ...rest }) => rest),
      });
      products = await prisma.product.findMany();
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products from DB, using fallback:", error);
    return NextResponse.json(MEMORY_PRODUCTS);
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, price, category = "Gift", image } = body;

    const newProduct = {
      name,
      price: parseFloat(price) || 499,
      category,
      image: image || "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787849570/pwdvbfzdu1vktn0s4d9z.jpg",
    };

    try {
      const created = await prisma.product.create({
        data: newProduct,
      });
      return NextResponse.json({ success: true, product: created });
    } catch (dbErr) {
      const fallbackItem = { ...newProduct, id: `g_${Date.now()}`, createdAt: new Date() };
      MEMORY_PRODUCTS.push(fallbackItem);
      return NextResponse.json({ success: true, product: fallbackItem });
    }
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, name, price, category, image } = body;

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (category) updateData.category = category;
    if (image) updateData.image = image;

    try {
      const updated = await prisma.product.update({
        where: { id },
        data: updateData,
      });
      return NextResponse.json({ success: true, product: updated });
    } catch (dbErr) {
      const idx = MEMORY_PRODUCTS.findIndex((p) => p.id === id);
      if (idx !== -1) {
        MEMORY_PRODUCTS[idx] = { ...MEMORY_PRODUCTS[idx], ...updateData };
        return NextResponse.json({ success: true, product: MEMORY_PRODUCTS[idx] });
      }
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    try {
      await prisma.product.delete({
        where: { id },
      });
    } catch (dbErr) {
      MEMORY_PRODUCTS = MEMORY_PRODUCTS.filter((p) => p.id !== id);
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
