import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";

console.log(Product)

const products = [
  {
    id: 1,
    name: "Keychron B6 Pro Ultra-Slim Wireless Keyboard",
    price: Number("฿1,990".replace("฿", "").replace(",", "")),
    imageSrc:
      "https://www.keychron.co.th/cdn/shop/files/B6-Pro-4_9dc4c9cc-5880-438d-b78f-f9152eb3b8ca.jpg?v=1729067952&width=1200",
    type: "Keyboard",
    href: "#"
  },
  {
    id: 2,
    name: "Keychron K4 Max QMK Wireless Mechanical Keyboard",
    price: Number("฿1,990".replace("฿", "").replace(",", "")),
    imageSrc:
      "https://www.keychron.co.th/cdn/shop/files/K4-Max-2.jpg?v=1735097784&width=500",
    type: "Keyboard",
    href: "#"
  },
  {
    id: 3,
    name: "Keychron V6 Max QMK/VIA Wireless Custom Mechanical Keyboard (Silent Switch)",
    price: Number("฿1,990".replace("฿", "").replace(",", "")),
    imageSrc:
      "https://www.keychron.co.th/cdn/shop/files/V6-Max-6_10a4469e-080e-42f4-9592-920f71ed670b.jpg?v=1730703574&width=500",
    type: "Keyboard",
    href: "#"
  },
  {
    id: 4,
    name: "Keychron V5 Max QMK/VIA Wireless Custom Mechanical Keyboard (Silent Switch)",
    price: Number("฿1,990".replace("฿", "").replace(",", "")),
    imageSrc:
      "https://www.keychron.co.th/cdn/shop/files/V5-Max-6.jpg?v=1730459792&width=500",
    type: "Keyboard",
    href: "#"
  },
  {
    id: 5,
    name: "Keychron K3 Max QMK Wireless Mechanical Keyboard",
    price: Number("฿1,990".replace("฿", "").replace(",", "")),
    imageSrc:
      "https://www.keychron.co.th/cdn/shop/files/K3-Max-1.jpg?v=1726123780&width=500",
    type: "Keyboard",
    href: "#"
  },
  {
    id: 6,
    name: "V1 Max QMK/VIA Wireless Custom Mechanical Keyboard",
    price: Number("฿1,990".replace("฿", "").replace(",", "")),
    imageSrc:
      "https://www.keychron.co.th/cdn/shop/files/V1-Max-2_40b65a79-0e89-4c4f-8c27-cc81129988a3.jpg?v=1730456758&width=500",
    type: "Keyboard",
    href: "#"
  },
  {
    id: 7,
    name: "lockheed c-130 hercules",
    price: Number("฿1,990".replace("฿", "").replace(",", "")),
    imageSrc:
      "https://cloudfront-us-east-1.images.arcpublishing.com/archetype/Q7XYKG5UTZCLXH6INZOPTM6ET4.jpg",
    type: "Plane",
    href: "#"
  },
  {
    id: 8,
    name: "F-15 Eagle",
    price: Number("฿1,990".replace("฿", "").replace(",", "")),
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/F-15C_Eagle_from_the_44th_Fighter_Squadron_flies_during_a_routine_training_exercise_April_15%2C_2019.jpg/640px-F-15C_Eagle_from_the_44th_Fighter_Squadron_flies_during_a_routine_training_exercise_April_15%2C_2019.jpg",
    type: "Plane",
    href: "#"
  },
  {
    id: 10,
    name: "F-22 Raptor",
    price: Number("฿1,990".replace("฿", "").replace(",", "")),
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/1/1e/F-22_Raptor_edit1_%28cropped%29.jpg",
    type: "Plane",
    href: "#"
  },
  {
    id: 11,
    name: "C-17 Globemaster III",
    price: Number("฿1,990".replace("฿", "").replace(",", "")),
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/b/bc/C-17_test_sortie.jpg",
    type: "Plane",
    href: "#"
  },
  {
    id: 12,
    name: "Northrop B-2 Spirit",
    price: Number("฿1,990".replace("฿", "").replace(",", "")),
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/e/ec/B-2_Spirit_%28cropped%29.jpg",
    type: "Plane",
    href: "#"
  },
];

export async function GET() {
  await connectToDatabase();

  try {
    await Product.insertMany(products);
    return NextResponse.json({ message: "Data seeded successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
