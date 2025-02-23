import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid"; // นำเข้า UUID

export async function POST(req) {
  try {
    const formData = await req.formData(); // อ่าน FormData จาก Request
    const file = formData.get("file"); // ดึงไฟล์ออกมา

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // ดึงนามสกุลไฟล์ เช่น .jpg, .png
    const ext = path.extname(file.name);
    
    // สร้างชื่อไฟล์ใหม่ให้ไม่ซ้ำกั
    const uniqueFilename = `${Date.now()}-${uuidv4()}${ext}`;

    // สร้างโฟลเดอร์ "public/uploads" ถ้ายังไม่มี
    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // กำหนด Path ของไฟล์ที่อัปโหลด
    const filePath = path.join(uploadDir, uniqueFilename);
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // เขียนไฟล์ลงระบบ
    fs.writeFileSync(filePath, fileBuffer);

    return NextResponse.json({ 
      message: "Upload success", 
      fileUrl: `/uploads/${uniqueFilename}` 
    }, { status: 200 });

  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}