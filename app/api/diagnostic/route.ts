import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  // 1. Secure the endpoint to admin only
  const session = await getServerSession(authOptions);
  const adminEmail = process.env.ADMIN_EMAIL || "kielesta.gc@gmail.com";

  if (!session?.user?.email || session.user.email.toLowerCase() !== adminEmail.toLowerCase()) {
    return NextResponse.json(
      { error: "Unauthorized. You must be signed in as the admin." },
      { status: 401 }
    );
  }

  const results: Record<string, any> = {
    timestamp: new Date().toISOString(),
    env: {
      DATABASE_URL_exists: !!process.env.DATABASE_URL,
      DATABASE_URL_obfuscated: process.env.DATABASE_URL
        ? process.env.DATABASE_URL.replace(/:[^:@]+@/, ":****@")
        : null,
      DIRECT_URL_exists: !!process.env.DIRECT_URL,
      DIRECT_URL_obfuscated: process.env.DIRECT_URL
        ? process.env.DIRECT_URL.replace(/:[^:@]+@/, ":****@")
        : null,
      NEXT_PUBLIC_SUPABASE_URL_exists: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || null,
      NEXT_PUBLIC_SUPABASE_ANON_KEY_exists: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NEXT_PUBLIC_SUPABASE_ANON_KEY_length: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
      ADMIN_EMAIL: process.env.ADMIN_EMAIL || null,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || null,
    },
    database: { status: "unknown" },
    supabase_storage: { status: "unknown" },
  };

  // 2. Test Database Connection
  try {
    const techStackCount = await prisma.techStack.count();
    results.database = {
      status: "success",
      techStackCount,
    };
  } catch (e: any) {
    results.database = {
      status: "failed",
      errorName: e.name || "Error",
      errorMessage: e.message || "Unknown error",
      errorStack: e.stack || null,
    };
  }

  // 3. Test Supabase Storage Upload
  try {
    const fileName = `diag-test-${Date.now()}.txt`;
    const buffer = Buffer.from("Vercel Server diagnostic test upload");

    const { data, error } = await supabase.storage
      .from("portfolio")
      .upload(fileName, buffer, {
        contentType: "text/plain",
        duplex: "half",
      });

    if (error) {
      results.supabase_storage = {
        status: "failed",
        errorName: error.name || "StorageError",
        errorMessage: error.message || "Unknown storage error",
        errorDetails: error,
      };
    } else {
      const { data: urlData } = supabase.storage.from("portfolio").getPublicUrl(fileName);
      
      // Clean up the test file
      await supabase.storage.from("portfolio").remove([fileName]);

      results.supabase_storage = {
        status: "success",
        fileName,
        publicUrl: urlData?.publicUrl || null,
      };
    }
  } catch (e: any) {
    results.supabase_storage = {
      status: "failed",
      errorName: e.name || "Error",
      errorMessage: e.message || "Unknown error",
      errorStack: e.stack || null,
    };
  }

  return NextResponse.json(results);
}
