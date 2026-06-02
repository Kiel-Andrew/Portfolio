import { NextResponse } from "next/server";
// Adjust this import path if your Prisma client is located elsewhere
import prisma from "@/lib/prisma"; 

export async function GET() {
  try {
    // Fetch all tech stack items from your Supabase database via Prisma
    const techStack = await prisma.techStack.findMany({
      // Optional: Order them by category or name if you prefer
      orderBy: {
        category: 'asc'
      }
    });

    // Return the array of data
    return NextResponse.json(techStack);
    
  } catch (error) {
    console.error("Database Error:", error);
    // If the database fails, safely return an empty array so the frontend doesn't break
    return NextResponse.json([], { status: 500 });
  }
}