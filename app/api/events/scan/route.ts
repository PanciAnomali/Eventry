// app/api/events/scan/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { qrToken } = await req.json();

    // 1. Cari Tiket berdasarkan Token QR
    const registration = await prisma.registration.findUnique({
      where: { qrToken },
      include: { user: true, event: true }
    });

    if (!registration) {
      return NextResponse.json(
        { error: "QR Code TIDAK VALID! Tiket tidak ditemukan." }, 
        { status: 404 }
      );
    }

    // 2. Cek apakah sudah pernah absen
    if (registration.attended) {
      return NextResponse.json(
        { error: `Peserta ${registration.user.name} SUDAH check-in sebelumnya.` }, 
        { status: 400 }
      );
    }

    // 3. Update jadi Hadir
    await prisma.registration.update({
      where: { id: registration.id },
      data: { attended: true }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Check-in Berhasil!",
      data: {
        userName: registration.user.name,
        eventName: registration.event.title,
        email: registration.user.email
      }
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Terjadi kesalahan sistem" }, 
      { status: 500 }
    );
  }
}
