// app/dashboard/participant/page.tsx
"use client";

import Link from "next/link"; // <--- Pastikan ini ada
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

type RegistrationData = {
  id: string;
  qrToken: string;
  event: {
    title: string;
    date: string;
    location: string | null;
  };
};

export default function ParticipantDashboard() {
  const { data: session } = useSession();
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/events/join")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setRegistrations(data);
      });
  }, []);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode) return;
    
    setLoading(true);

    const res = await fetch("/api/events/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventCode: joinCode.toUpperCase() }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Berhasil gabung event! 🎉");
      setJoinCode("");
      fetch("/api/events/join")
        .then((res) => res.json())
        .then((newData) => setRegistrations(newData));
    } else {
      alert(data.error || "Gagal gabung event");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] p-8 text-white">
      <div className="max-w-6xl mx-auto">
        <Link href="/dashboard" className="text-blue-400 hover:text-blue-300 mb-6 block font-semibold">
          &larr; Kembali ke Menu Utama
        </Link>
        
        <h1 className="text-3xl font-bold text-blue-400 mb-8">Dashboard Peserta 🎫</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* KIRI: Form Input Kode */}
          <div className="lg:col-span-1">
            <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 shadow-lg sticky top-8">
              <h2 className="text-xl font-bold mb-4 text-white">Gabung Acara</h2>
              <p className="text-gray-400 mb-6 text-sm">
                Masukkan kode unik yang diberikan panitia untuk mendapatkan tiket.
              </p>
              
              <form onSubmit={handleJoin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Kode Event</label>
                  <input
                    type="text"
                    placeholder="Contoh: GRX-293844"
                    className="w-full p-3 bg-[#334155] border border-gray-600 rounded text-white placeholder-gray-400 uppercase font-mono tracking-widest text-center text-lg focus:outline-none focus:border-blue-500 transition"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading || !joinCode}
                  className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
                >
                  {loading ? "Mengecek..." : "Gabung Sekarang"}
                </button>
              </form>
            </div>
          </div>

          {/* KANAN: List Tiket Saya */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-6 text-white">Tiket Saya</h2>
            
            {registrations.length === 0 ? (
              <div className="bg-[#1e293b] p-10 rounded-xl border border-dashed border-gray-600 text-center text-gray-400">
                <p>Kamu belum terdaftar di event apapun.</p>
                <p className="text-sm mt-2">Minta kode ke panitia lalu masukkan di menu sebelah kiri.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {registrations.map((reg) => (
                  <div key={reg.id} className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-md group">
                    <div>
                      <h3 className="font-bold text-xl text-white mb-2">{reg.event.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span className="bg-[#334155] px-2 py-1 rounded text-blue-200">
                          {new Date(reg.event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    
                    {/* --- INI BAGIAN YANG KITA UBAH --- */}
                    {/* Tombol dibungkus Link, mengarah ke detail tiket berdasarkan ID registrasi */}
                    <Link href={`/dashboard/participant/ticket/${reg.id}`}>
                      <button className="mt-4 sm:mt-0 bg-gray-800 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 px-5 py-2 rounded-full transition text-sm font-semibold flex items-center gap-2 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
                        </svg>
                        Lihat QR Code
                      </button>
                    </Link>
                    {/* --- BATAS PERUBAHAN --- */}

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
