"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function loginAdmin(formData) {
  const password = formData.get("password");
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminPassword && !adminPasswordHash) {
    console.error("Neither ADMIN_PASSWORD nor ADMIN_PASSWORD_HASH environment variable is set.");
    return { error: "Internal server error" };
  }

  if (!password) {
    return { error: "Password is required" };
  }

  let isValid = false;

  if (adminPasswordHash) {
    try {
      isValid = await bcrypt.compare(password, adminPasswordHash);
    } catch (err) {
      console.error("Bcrypt comparison error:", err);
      return { error: "Authentication error" };
    }
  } else if (adminPassword) {
    isValid = password.trim().toLowerCase() === adminPassword.trim().toLowerCase();
  }

  if (isValid) {
    // Set a cookie that expires in 1 day
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    redirect("/admin");
  } else {
    return { error: "Invalid password" };
  }
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  cookieStore.delete({
    name: "admin_session",
    path: "/",
  });
  redirect("/admin/login");
}

export async function registerUser(data) {
  try {
    const { name, email, password, phone } = data;

    if (!name || !email || !password) {
      return { success: false, error: "Missing required fields" };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: "Email already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error registering user:", error);
    return { success: false, error: "Something went wrong during registration" };
  }
}
