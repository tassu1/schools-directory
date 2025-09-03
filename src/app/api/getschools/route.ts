import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { RowDataPacket } from "mysql2"; // 👈 important

interface School extends RowDataPacket {
  auto: number;
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  contact: string;
  image: string;
  email: string;
}

export async function GET() {
  try {
    const db = await connectDB();

    // db.execute returns [rows, fields]
    const [rows] = await db.execute<School[]>("SELECT * FROM schoolslist ORDER BY auto DESC");

    console.log(rows);

    return NextResponse.json({
      success: true,
      data: rows
    });
  } catch (error: unknown) {
    console.error("Error fetching schools:", error);

    let message = "Failed to fetch schools";
    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json(
      {
        success: false,
        message,
        error: message
      },
      { status: 500 }
    );
  }
}
