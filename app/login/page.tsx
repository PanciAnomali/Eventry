// app/login/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Panggil fungsi signIn dari NextAuth
    const res = await signIn("credentials", {
      redirect: false, // Kita handle redirect manual biar smooth
      email: form.email,
      password: form.password,
    });

    if (res?.ok) {
      router.push("/dashboard"); // Kalau sukses lempar ke dashboard
      router.refresh();
    } else {
      alert("Login gagal! Cek email/password.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded text-black"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded text-black"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button type="submit" className="w-full p-2 text-white bg-green-600 rounded hover:bg-green-700">
            Masuk
          </button>
        </form>
        <p className="text-center text-sm text-gray-600">
          Belum punya akun? <Link href="/register" className="text-blue-500">Daftar</Link>
        </p>
      </div>
    </div>
  );
}
