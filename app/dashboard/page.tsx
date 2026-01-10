// app/dashboard/page.tsx
"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Dashboard() {
  const { data: session } = useSession();

  return (
    // UBAH 1: Background Utama Gelap
    <div className="min-h-screen bg-[#0f172a] p-8 text-white">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-10 border-b border-gray-700 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Halo, {session?.user?.name}! 👋</h1>
          <p className="text-gray-300 mt-2">Siap untuk kegiatan hari ini?</p>
        </div>
        <button 
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition font-semibold shadow-lg"
        >
          Logout
        </button>
      </div>

      {/* Menu Pilihan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-10">
        
        {/* Kartu Peserta */}
        <Link href="/dashboard/participant" className="group">
          {/* UBAH 2: Kartu jadi Gelap (bg-[#1e293b]) dengan Border Glowing */}
          <div className="bg-[#1e293b] border border-gray-700 p-8 rounded-xl hover:border-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition cursor-pointer h-full">
            <h2 className="text-2xl font-bold text-blue-400 group-hover:text-blue-300 mb-4">
              Masuk sebagai Peserta 🎫
            </h2>
            <p className="text-gray-200 text-lg leading-relaxed">
              Daftar event baru, lihat jadwal acara, dan akses tiket QR Code kamu di sini.
            </p>
          </div>
        </Link>

        {/* Kartu Panitia */}
        <Link href="/dashboard/organizer" className="group">
          {/* UBAH 3: Kartu Panitia juga Gelap */}
          <div className="bg-[#1e293b] border border-gray-700 p-8 rounded-xl hover:border-purple-500 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition cursor-pointer h-full">
            <h2 className="text-2xl font-bold text-purple-400 group-hover:text-purple-300 mb-4">
              Masuk sebagai Panitia 📋
            </h2>
            <p className="text-gray-200 text-lg leading-relaxed">
              Buat acara baru (Generate Kode), kelola peserta, dan scan kehadiran.
            </p>
          </div>
        </Link>

      </div>
    </div>
  );
}
