import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = (await connectToDatabase()).db;
    const products = await db.collection("products").find({}).toArray();

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ message: "เกิดข้อผิดพลาดในการดึงสินค้า" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, type, price, image } = body;

    if (!name || !type || !price || !image) {
      return NextResponse.json({ message: "ข้อมูลไม่ครบถ้วน" }, { status: 400 });
    }

    if (!/^\/uploads\/.+\.(jpg|jpeg|png|gif|webp|jxl)$/i.test(image)) {
      return NextResponse.json({ message: "URL รูปภาพไม่ถูกต้อง" }, { status: 400 });
    }

    const db = (await connectToDatabase()).db;
    const result = await db.collection("products").insertOne({
      name,
      type,
      price: parseFloat(price),
      image,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "บันทึกสินค้าเรียบร้อย", result }, { status: 201 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const body = await req.json();
    const { oldType, newType } = body;

    if (!oldType || !newType || oldType === newType) {
      return NextResponse.json({ message: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
    }

    const db = (await connectToDatabase()).db;
    const result = await db.collection("products").updateMany(
      { type: oldType },
      { $set: { type: newType } }
    );

    return NextResponse.json({ message: "อัปเดตประเภทสินค้าเรียบร้อย", modifiedCount: result.modifiedCount }, { status: 200 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ message: "เกิดข้อผิดพลาดในการอัปเดตประเภทสินค้า" }, { status: 500 });
  }
}