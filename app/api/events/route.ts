import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route"; 

export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const events = await prisma.event.findMany({
    where: { organizerId: (session.user as any).id },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(events);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, uniqueCode, date } = await req.json();

    const existing = await prisma.event.findUnique({
      where: { uniqueCode },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Kode Unik ini sudah dipakai event lain. Cari kode lain!" },
        { status: 400 }
      );
    }

    const newEvent = await prisma.event.create({
      data: {
        title,
        uniqueCode,
        date: new Date(date),
        organizerId: (session.user as any).id,
      },
    });

    return NextResponse.json(newEvent);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Gagal membuat event" }, 
      { status: 500 }
    );
  }
}
