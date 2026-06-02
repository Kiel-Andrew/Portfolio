import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: { startDate: "desc" },
    });

    return NextResponse.json(experiences);
  } catch (error) {
    console.error("Failed to fetch experiences:", error);
    return NextResponse.json(
      { error: "Failed to fetch experiences" },
      { status: 500 }
    );
  }
}
