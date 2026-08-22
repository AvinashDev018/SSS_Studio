"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAdmin(formData) {
 const password = formData.get("password");
 const adminPassword = process.env.ADMIN_PASSWORD || "admin";

 if (password && adminPassword && password.trim().toLowerCase() === adminPassword.trim().toLowerCase()) {
 // Set a cookie that expires in 1 day
 const cookieStore = await cookies();
 cookieStore.set("admin_session", "true", {
 httpOnly: true,
 secure: process.env.NODE_ENV === "production",
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
 redirect("/admin/login");
}
