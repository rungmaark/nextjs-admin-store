"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import AddProductButton from "./AddProductButton";
import Swal from "sweetalert2";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingType, setEditingType] = useState(null);
  const [newTypeName, setNewTypeName] = useState("");

  // โหลดข้อมูลสินค้าจาก API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products"); // ดึงข้อมูลจาก API
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Group products ตาม type
  const groupedProducts = products.reduce((acc, product) => {
    if (!acc[product.type]) {
      acc[product.type] = [];
    }
    acc[product.type].push(product);
    return acc;
  }, {});

  const allProductTypes = Object.keys(groupedProducts);

  // ฟังก์ชันแก้ไขชื่อประเภทสินค้า
  const handleEditType = (type) => {
    setEditingType(type);
    setNewTypeName(type);
  };

  // ฟังก์ชันบันทึกชื่อประเภทสินค้าใหม่
  const handleSaveType = async () => {
    if (newTypeName.trim() && newTypeName !== editingType) {
      try {
        const res = await fetch("/api/products", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ oldType: editingType, newType: newTypeName }),
        });
  
        if (!res.ok) throw new Error("Failed to update product type");
  
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.type === editingType ? { ...product, type: newTypeName } : product
          )
        );
      } catch (error) {
        console.error("Error updating product type:", error);
      }
    }
    setEditingType(null);
  };  

  const handleDeleteProduct = async (productId) => {

    const result = await Swal.fire({
      title: "คุณต้องการลบสินค้านี้หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ยกเลิก",
    });
  
    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/products/${productId}`, {
          method: "DELETE",
        });
  
        if (!res.ok) throw new Error("Failed to delete product");
  
        // อัปเดต state ให้ลบสินค้าทิ้ง
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== productId)
        );
  
        Swal.fire("ลบแล้ว!", "สินค้าของคุณถูกลบเรียบร้อยแล้ว", "success");
      } catch (error) {
        console.error("Error deleting product:", error);
        Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถลบสินค้าได้", "error");
      }
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="flex justify-start mb-12">
          <AddProductButton type={null} />
        </div>

        {loading ? (
          <p className="text-center text-gray-500">กำลังโหลดข้อมูล...</p>
        ) : (
          allProductTypes.map((type) => (
            <div key={type} className="mb-12">
              {/* หัวข้อ Type และปุ่มแก้ไข */}
              <div className="flex items-center gap-2 mb-6">
                {editingType === type ? (
                  <input
                    type="text"
                    value={newTypeName}
                    onChange={(e) => setNewTypeName(e.target.value)}
                    onBlur={handleSaveType}
                    autoFocus
                    className="text-2xl font-bold tracking-tight text-gray-900 border border-gray-300 rounded px-2"
                  />
                ) : (
                  <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                    {type}
                  </h2>
                )}
                <button onClick={() => handleEditType(type)}>
                  <Image
                    src="/assets/pen.png"
                    alt="Edit"
                    width={20}
                    height={20}
                  />
                </button>
              </div>

              {/* รายการสินค้า */}
              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                {groupedProducts[type].map((product) => (
                  <div key={product._id} className="group relative" onClick={() => handleDeleteProduct(product._id)}>
                    <img
                      src={product.image}
                      className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                    />
                    <div className="mt-4 flex justify-between gap-x-6">
                      <div>
                        <h3 className="text-sm text-gray-700">
                          <span
                            aria-hidden="true"
                            className="absolute inset-0"
                          />
                          {product.name}
                        </h3>
                      </div>
                      <p className="text-sm font-bold text-gray-900">
                        ฿{product.price}
                      </p>
                    </div>
                  </div>
                ))}

                <AddProductButton type={type} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
