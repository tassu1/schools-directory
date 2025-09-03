import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { randomUUID } from "crypto";
import { v2 as cloudinary } from "cloudinary";
import { RowDataPacket, ResultSetHeader } from "mysql2";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface MaxAutoRow extends RowDataPacket {
  maxAuto: number | null;
}

export async function POST(req: NextRequest) {
  try {
    let name: string, address: string, city: string, state: string;
    let contact: string, email: string, imageUrl: string;

    // check content type
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      // Handle FormData (file upload)
      const formData = await req.formData();

      name = formData.get("name") as string;
      address = formData.get("address") as string;
      city = formData.get("city") as string;
      state = formData.get("state") as string;
      contact = formData.get("contact") as string;
      email = formData.get("email") as string;

      const imageFile = formData.get("imageFile") as File | null;

      if (imageFile) {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Image = buffer.toString("base64");
        const dataURI = `data:${imageFile.type};base64,${base64Image}`;

        const uploadResult = await cloudinary.uploader.upload(dataURI, {
          folder: "schools",
        });

        imageUrl = uploadResult.secure_url;
      } else {
        imageUrl = ""; 
      }
    } else {
      // Handle JSON (string image path)
      const body = await req.json();
      name = body.name;
      address = body.address;
      city = body.city;
      state = body.state;
      contact = body.contact;
      email = body.email;
      imageUrl = body.image || "";
    }

    // Validation
    if (!name || !address || !city || !state || !contact || !email) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Connect to database
    const db = await connectDB();
    const id = randomUUID();

    // Get the next auto value
    const [rows] = await db.execute<MaxAutoRow[]>(
      "SELECT MAX(auto) as maxAuto FROM schoolslist"
    );
    const maxAuto = rows[0]?.maxAuto ?? 0;
    const newAuto = maxAuto + 1;

    // Insert the school data
    await db.execute<ResultSetHeader>(
      "INSERT INTO schoolslist (auto, id, name, address, city, state, contact, image, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [newAuto, id, name, address, city, state, contact, imageUrl, email]
    );

    return NextResponse.json({
      success: true,
      message: "School added successfully",
    });
  } catch (error: unknown) {
    console.error("API Error:", error);

    let message = "Something went wrong";
    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
