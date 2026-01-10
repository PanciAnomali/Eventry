// app/dashboard/organizer/page.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

type EventData = {
  id: string;
  title: string;
  uniqueCode: string;
  date: string;
};

export default function OrganizerDashboard() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<EventData[]>([]);
  const [form, setForm] = useState({ title: "", uniqueCode: "", date: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setEvents(data);
      });
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Event berhasil dibuat! 🎉");
      setEvents([data, ...events]);
      setForm({ title: "", uniqueCode: "", date: "" });
    } else {
      alert(data.error || "Gagal membuat event");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] p-8 text-white">
      <div className="max-w-6xl mx-auto">
        <Link href="/dashboard" className="text-blue-400 hover:text-blue-300 mb-6 block font-semibold">
          &larr; Kembali ke Menu Utama
        </Link>
        
        {/* --- BAGIAN INI KITA UBAH --- */}
        {/* Judul dan Tombol Scanner kita jejerin pakai Flexbox */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-purple-400">Dashboard Panitia 📋</h1>
          
          {/* Ini tombol Scanner-nya */}
          <Link href="/dashboard/organizer/scan">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg flex items-center gap-2 transition transform hover:scale-105">
              📷 Buka Scanner
            </button>
          </Link>
        </div>
        {/* --- BATAS PERUBAHAN --- */}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Kolom KIRI: Form Buat Event */}
          <div className="lg:col-span-1">
            <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 shadow-lg">
              <h2 className="text-xl font-bold mb-6 text-white">Buat Event Baru</h2>
              <form onSubmit={handleCreate} className="space-y-5">
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nama Acara</label>
                  <input
                    type="text"
                    placeholder="Contoh: GEREX-2025"
                    className="w-full p-3 bg-[#334155] border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition"
                    value={form.title}
                    onChange={(e) => setForm({...form, title: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Kode Unik</label>
                  <input
                    type="text"
                    placeholder="GRX-293844"
                    className="w-full p-3 bg-[#334155] border border-gray-600 rounded text-white placeholder-gray-400 uppercase font-mono tracking-wider focus:outline-none focus:border-purple-500 transition"
                    value={form.uniqueCode}
                    onChange={(e) => setForm({...form, uniqueCode: e.target.value.toUpperCase()})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tanggal Acara</label>
                  <input
                    type="datetime-local"
                    className="w-full p-3 bg-[#334155] border border-gray-600 rounded text-white focus:outline-none focus:border-purple-500 transition [color-scheme:dark]"
                    value={form.date}
                    onChange={(e) => setForm({...form, date: e.target.value})}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-purple-600 text-white py-3 rounded font-bold hover:bg-purple-700 disabled:opacity-50 transition shadow-lg"
                >
                  {loading ? "Memproses..." : "+ Buat Event"}
                </button>
              </form>
            </div>
          </div>

          {/* Kolom KANAN: List Event Saya */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-6 text-white">Event Saya</h2>
            
            {events.length === 0 ? (
              <div className="bg-[#1e293b] p-8 rounded-xl border border-dashed border-gray-600 text-center text-gray-400">
                <p>Belum ada event yang dibuat.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-md">
                    <div className="mb-4 sm:mb-0">
                      <h3 className="font-bold text-lg text-white mb-1">{event.title}</h3>
                      <div className="flex items-center gap-3">
                        <span className="bg-purple-900 text-purple-200 px-3 py-1 rounded text-sm font-mono border border-purple-700">
                          {event.uniqueCode}
                        </span>
                        <span className="text-sm text-gray-400">
                          {new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    {/* Tombol scan shortcut di tiap event (opsional, tapi udah ada tombol scan utama di atas) */}
                    <button className="text-purple-400 font-semibold border border-purple-500 px-4 py-2 rounded hover:bg-purple-900 hover:text-white transition text-sm">
                       Info Detail
                    </button>
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
