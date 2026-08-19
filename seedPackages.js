const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding packages...");
  
  await prisma.package.create({
    data: {
      name: "Essential Wedding",
      price: "$1,500",
      description: "Perfect for intimate ceremonies and small gatherings.",
      features: [
        "Up to 6 hours of coverage",
        "1 Photographer",
        "High-res edited digital gallery",
        "Print rights"
      ],
      popular: false
    }
  });

  await prisma.package.create({
    data: {
      name: "Premium Wedding",
      price: "$2,800",
      description: "Our most popular package for full-day coverage.",
      features: [
        "Up to 10 hours of coverage",
        "2 Photographers",
        "Engagement session included",
        "High-res edited digital gallery",
        "Custom wedding album"
      ],
      popular: true
    }
  });

  await prisma.package.create({
    data: {
      name: "Portrait Session",
      price: "$350",
      description: "Ideal for family, maternity, or senior portraits.",
      features: [
        "1 hour on location",
        "Multiple outfit changes",
        "30+ edited digital images",
        "Online viewing gallery"
      ],
      popular: false
    }
  });

  console.log("Packages seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
