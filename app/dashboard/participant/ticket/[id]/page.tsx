// app/dashboard/participant/ticket/[id]/page.tsx
"use client";

import { useSession } from "next-auth/react";
import QRCode from "react-qr-code";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function TicketPage() {
  const { id } = useParams(); // Ambil ID dari URL
  const { data: session } = useSession();
  const [ticketData, setTicketData] = useState<any>(null);

  useEffect(() => {
    // Kita ambil data tiket spesifik ini
    // (Note: di real app baiknya bikin API khusus 'get one ticket', 
    // tapi biar cepet kita filter dari list join aja)
    fetch("/api/events/join")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((item: any) => item.id === id);
        setTicketData(found);
      });
  }, [id]);

  if (!ticketData) return <div className="p-8 text-white">Loading tiket...</div>;

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center border-4 border-blue-500 relative overflow-hidden">
        
        {/* Hiasan bulat di atas */}
        <div className="absolute top-0 left-0 w-full h-4 bg-blue-500"></div>

        <h2 className="text-2xl font-bold text-gray-800 mb-1">{ticketData.event.title}</h2>
        <p className="text-gray-500 text-sm mb-6">Tiket Masuk Peserta</p>

        {/* QR CODE GENERATOR */}
        <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 inline-block mb-6">
          <QRCode 
            value={ticketData.qrToken} // <--- INI KUNCI RAHASIANYA
            size={200}
            level="H"
          />
        </div>

        <div className="text-left bg-blue-50 p-4 rounded-lg mb-6">
          <p className="text-xs text-gray-500 uppercase font-bold">Nama Peserta</p>
          <p className="text-gray-800 font-semibold mb-2">{session?.user?.name}</p>
          
          <p className="text-xs text-gray-500 uppercase font-bold">Kode Tiket (Token)</p>
          <p className="font-mono text-blue-600 font-bold break-all text-xs">{ticketData.qrToken}</p>
        </div>

        <p className="text-xs text-gray-400 mb-6">
          Tunjukkan QR Code ini ke panitia di meja registrasi untuk di-scan.
        </p>

        <Link href="/dashboard/participant" className="block w-full bg-gray-800 text-white py-3 rounded-xl font-bold hover:bg-gray-900 transition">
          &larr; Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}
