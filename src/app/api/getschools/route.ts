import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    const db = await connectDB();
    
    const [rows]: any = await db.execute("SELECT * FROM schoolslist ORDER BY auto DESC");
    console.log(rows);
    return NextResponse.json({
      success: true,
      data: rows
    });
  } catch (error: any) {
    console.error("Error fetching schools:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch schools",
      error: error.message
    }, { status: 500 });
  }
}