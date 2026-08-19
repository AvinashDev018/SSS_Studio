"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function getPackages() {
  try {
    const packages = await prisma.package.findMany({
      orderBy: {
        createdAt: "asc"
      }
    });
    return packages;
  } catch (error) {
    console.error("Error fetching packages:", error);
    return [];
  }
}

export async function addPackage(data) {
  try {
    const pkg = await prisma.package.create({
      data: {
        name: data.name,
        price: data.price,
        description: data.description,
        features: data.features.split(',').map(f => f.trim()).filter(f => f.length > 0),
        popular: data.popular === "true" || data.popular === true,
      }
    });
    revalidatePath("/packages");
    revalidatePath("/admin/packages");
    return { success: true, pkg };
  } catch (error) {
    console.error("Error adding package:", error);
    return { success: false, error: "Failed to add package" };
  }
}

export async function deletePackage(id) {
  try {
    await prisma.package.delete({
      where: { id }
    });
    revalidatePath("/packages");
    revalidatePath("/admin/packages");
    return { success: true };
  } catch (error) {
    console.error("Error deleting package:", error);
    return { success: false, error: "Failed to delete package" };
  }
}
