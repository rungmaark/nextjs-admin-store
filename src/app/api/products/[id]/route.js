import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(req, { params }) {
  try {
    const { id } = params; // ดึง id จาก params
    console.log("Received DELETE request for ID:", id);

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "รหัสสินค้าไม่ถูกต้อง" }, { status: 400 });
    }

    const db = (await connectToDatabase()).db;
    const result = await db.collection("products").deleteOne({ _id: new ObjectId(id) });

    console.log("Delete result:", result);

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "ไม่พบสินค้า" }, { status: 404 });
    }

    return NextResponse.json({ message: "ลบสินค้าเรียบร้อย" }, { status: 200 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" }, { status: 500 });
  }
}