// app/dashboard/organizer/scan/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

export default function ScanPage() {
  const [qrToken, setQrToken] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [resultMsg, setResultMsg] = useState("");
  const [userData, setUserData] = useState<any>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setUserData(null);

    const res = await fetch("/api/events/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ qrToken }),
    });

    const data = await res.json();

    if (res.ok) {
      setStatus("success");
      setResultMsg(data.message);
      setUserData(data.data);
      setQrToken(""); // Reset input biar siap scan lagi
    } else {
      setStatus("error");
      setResultMsg(data.error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-8 flex flex-col items-center">
      <Link href="/dashboard/organizer" className="self-start text-blue-400 mb-8 font-bold">
        &larr; Kembali ke Dashboard Panitia
      </Link>

      <h1 className="text-3xl font-bold mb-8 text-purple-400">Scanner Kehadiran 📷</h1>

      <div className="w-full max-w-md bg-[#1e293b] p-8 rounded-2xl border border-gray-700 shadow-2xl">
        <form onSubmit={handleScan} className="space-y-6">
          <div>
            <label className="block text-gray-400 mb-2 text-sm">Scan QR / Input Token</label>
            <input 
              type="text" 
              className="w-full bg-[#0f172a] border border-gray-600 p-4 rounded-xl text-white font-mono text-center text-lg focus:border-purple-500 focus:outline-none transition"
              placeholder="Paste Token QR di sini..."
              value={qrToken}
              onChange={(e) => setQrToken(e.target.value)}
              autoFocus
            />
          </div>
          <button 
            type="submit" 
            disabled={status === "loading" || !qrToken}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition disabled:opacity-50"
          >
            {status === "loading" ? "Memeriksa..." : "CHECK IN SEKARANG"}
          </button>
        </form>

        {/* HASIL SCAN */}
        {status === "success" && (
          <div className="mt-8 bg-green-900/30 border border-green-500 p-6 rounded-xl text-center animate-pulse">
            <div className="text-5xl mb-2">✅</div>
            <h3 className="text-xl font-bold text-green-400 mb-1">BERHASIL!</h3>
            <p className="text-gray-300">{resultMsg}</p>
            <div className="mt-4 bg-[#0f172a] p-4 rounded text-left">
              <p className="text-sm text-gray-400">Nama Peserta:</p>
              <p className="font-bold text-lg text-white">{userData.userName}</p>
              <p className="text-sm text-gray-400 mt-2">Event:</p>
              <p className="font-bold text-white">{userData.eventName}</p>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="mt-8 bg-red-900/30 border border-red-500 p-6 rounded-xl text-center">
             <div className="text-5xl mb-2">❌</div>
            <h3 className="text-xl font-bold text-red-400 mb-1">GAGAL!</h3>
            <p className="text-red-200">{resultMsg}</p>
          </div>
        )}
      </div>
    </div>
  );
}
