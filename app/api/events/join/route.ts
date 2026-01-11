// app/api/events/join/route.ts
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export const dynamic = "force-dynamic";
// GET: Ambil daftar event yang diikuti user ini
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const registrations = await prisma.registration.findMany({
    where: { userId: (session.user as any).id },
    include: { event: true }, // Kita butuh data event-nya juga
    orderBy: { registeredAt: 'desc' }
  });

  return NextResponse.json(registrations);
}

// POST: Proses join event pake kode
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { eventCode } = await req.json();

    // 1. Cari event berdasarkan kode unik
    const event = await prisma.event.findUnique({
      where: { uniqueCode: eventCode },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Kode Event tidak ditemukan!" },
        { status: 404 }
      );
    }

    // 2. Cek apakah user udah pernah daftar
    const existing = await prisma.registration.findFirst({
      where: {
        userId: (session.user as any).id,
        eventId: event.id,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Kamu sudah terdaftar di event ini!" },
        { status: 400 }
      );
    }

    // 3. Daftarkan user
    const registration = await prisma.registration.create({
      data: {
        userId: (session.user as any).id,
        eventId: event.id,
        // qrToken otomatis di-generate sama database (default uuid)
      },
    });

    return NextResponse.json({ success: true, registration });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Gagal join event" }, 
      { status: 500 }
    );
  }
}
