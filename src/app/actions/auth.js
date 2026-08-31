"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { checkRateLimit, resetRateLimit } from "@/lib/rateLimiter";
import { prisma } from "@/lib/prisma";

// Helper function to get client IP
async function getClientIp() {
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0].trim() ||
    headersList.get("x-real-ip") ||
    headersList.get("cf-connecting-ip") ||
    "127.0.0.1";
  return ip;
}

// Helper function to log login attempts
async function logLoginAttempt(ip, success, reason = null, userAgent = null) {
  try {
    await prisma.loginAudit.create({
      data: {
        username: "admin",
        ip,
        success,
        reason,
        userAgent,
      },
    });
  } catch (error) {
    console.error("Failed to log login attempt:", error);
    // Don't throw - let login continue even if logging fails
  }
}

export async function loginAdmin(formData) {
  const password = formData.get("password");
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  // Get client IP and user agent
  const ip = await getClientIp();
  const headersList = await headers();
  const userAgent = headersList.get("user-agent");

  // Check rate limiting
  const rateLimit = checkRateLimit(ip, 5, 15 * 60 * 1000); // 5 attempts per 15 minutes
  if (!rateLimit.allowed) {
    await logLoginAttempt(ip, false, `Rate limited (${rateLimit.attemptCount}/5 attempts)`, userAgent);
    return {
      error: `Too many login attempts. Please try again in ${rateLimit.retryAfter} seconds.`,
      retryAfter: rateLimit.retryAfter,
    };
  }

  // Validate password hash exists
  if (!passwordHash) {
  if (!adminPasswordHash) {
    console.error("ADMIN_PASSWORD_HASH environment variable is not set.");
    await logLoginAttempt(ip, false, "Configuration error - password hash not set", userAgent);
    return { error: "Internal server error" };
  }

  // Validate input
  if (!password) {
    await logLoginAttempt(ip, false, "Empty password provided", userAgent);
    return { error: "Password is required" };
  }

  // Compare password with bcrypt hash
  let isPasswordValid = false;
  try {
    isPasswordValid = await bcrypt.compare(password, passwordHash);
  } catch (error) {
    console.error("Bcrypt comparison error:", error);
    await logLoginAttempt(ip, false, "Password comparison error", userAgent);
    return { error: "Authentication error" };
  }
  const isPasswordValid = await bcrypt.compare(password, adminPasswordHash);

  // Log failed attempt
  if (!isPasswordValid) {
  if (isPasswordValid) {
    // Reset rate limiter for this IP on success
    resetRateLimit(ip);

    // Log successful attempt to audit database
    await logLoginAttempt(ip, true, "Success", userAgent);

    // Set a secure httpOnly cookie with Strict sameSite and restricted path /admin
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 4, // 4 hours
      path: "/admin",
    });
    
    redirect("/admin");
  } else {
    // Log failed attempt to audit database
    await logLoginAttempt(ip, false, "Invalid password", userAgent);

    return { error: "Invalid password" };
  }

  // Successful authentication - reset rate limit and log success
  resetRateLimit(ip);
  await logLoginAttempt(ip, true, null, userAgent);

  // Set secure session cookie
  const cookieStore = await cookies();
  cookieStore.set("admin_session", "true", {
    httpOnly: true, // Cannot be accessed by JavaScript
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "strict", // CSRF protection
    maxAge: 60 * 60 * 4, // 4 hours for admin sessions
    path: "/admin", // Limit to admin routes
  });

  redirect("/admin");
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  cookieStore.delete({
    name: "admin_session",
    path: "/admin",
  });
  redirect("/admin/login");
}

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

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
