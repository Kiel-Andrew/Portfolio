import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const certifications = await prisma.certification.findMany({
      orderBy: { issueDate: "desc" },
    });

    return NextResponse.json(certifications);
  } catch (error) {
    console.error("Failed to fetch certifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch certifications" },
      { status: 500 }
    );
  }
}
