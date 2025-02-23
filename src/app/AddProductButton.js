import Swal from "sweetalert2";

export default function AddProductButton({ type }) {
  return (
    <button
      className="flex items-center justify-center aspect-square w-lg h-80 rounded-md border-2 border-dashed border-gray-300 text-gray-500 hover:text-gray-700 hover:border-gray-500 transition"
      onClick={async () => {
        let selectedType = type;

        if (!type) {
          const { value: newType } = await Swal.fire({
            title: "เพิ่มหมวดหมู่สินค้า",
            input: "text",
            inputPlaceholder: "กรอกชื่อหมวดสินค้า",
            showCancelButton: true,
            confirmButtonText: "ถัดไป",
            inputValidator: (value) => {
              if (!value.trim()) {
                return "กรุณากรอกชื่อหมวดสินค้า";
              }
            },
          });

          if (!newType) return;
          selectedType = newType;
        }

        const { value: productData } = await Swal.fire({
          title: `เพิ่มสินค้าในหมวด ${selectedType}`,
          html: `
            <label id="upload-label" class="upload-box">
              <span id="upload-text">คลิกเพื่ออัปโหลดรูป</span>
              <img id="preview-image" class="hidden preview-img">
            </label>
            <input id="product-image" type="file" accept="image/*" class="hidden">
            <input id="product-name" class="swal2-input" placeholder="กรอกชื่อสินค้า">
          `,
          focusConfirm: false,
          showCancelButton: true,
          confirmButtonText: "ถัดไป",
          didOpen: () => {
            const popup = Swal.getPopup();
            const fileInput = popup.querySelector("#product-image");
            const previewImage = popup.querySelector("#preview-image");
            const uploadLabel = popup.querySelector("#upload-label");
            const uploadText = popup.querySelector("#upload-text");

            uploadLabel.addEventListener("click", () => fileInput.click());

            fileInput.addEventListener("change", async (event) => {
              const file = event.target.files[0];
              if (!file) {
                console.error("❌ ไม่มีไฟล์ที่เลือก");
                return;
              }
              console.log("📂 Uploading file:", file.name, file.size, file.type);
            
              if (file) {``
                const formData = new FormData();
                formData.append("file", file);
            
                // อัปโหลดไฟล์ไปที่ API
                const uploadResponse = await fetch("/api/upload", {
                  method: "POST",
                  body: formData,
                });
            
                const uploadData = await uploadResponse.json();
                console.log('uploadData : ', uploadData)
            
                if (!uploadResponse.ok) {
                  Swal.showValidationMessage("อัปโหลดรูปไม่สำเร็จ");
                  return;
                }
            
                // ตั้งค่ารูปที่อัปโหลดแล้ว
                previewImage.src = uploadData.fileUrl;
                previewImage.classList.remove("hidden");
                uploadText.classList.add("hidden");
                previewImage.dataset.imageData = uploadData.fileUrl;
              }
            });
          },
          preConfirm: () => {
            const popup = Swal.getPopup();
            const name = popup.querySelector("#product-name").value;
            const previewImage = popup.querySelector("#preview-image");

            if (!name) {
              Swal.showValidationMessage("กรุณากรอกชื่อสินค้า");
              return false;
            }
            if (!previewImage.src || previewImage.classList.contains("hidden")) {
              Swal.showValidationMessage("กรุณาอัปโหลดรูปสินค้า");
              return false;
            }

            return { name, image: previewImage.dataset.imageData };
          },
        });

        if (!productData) return;

        const { value: price } = await Swal.fire({
          title: `กรอกราคาของ "${productData.name}"`,
          input: "number",
          inputPlaceholder: "ใส่ราคาสินค้า",
          showCancelButton: true,
          confirmButtonText: "เพิ่มสินค้า",
          inputValidator: (value) => {
            if (!value || value <= 0) {
              return "กรุณากรอกราคาที่ถูกต้อง";
            }
          },
        });

        if (!price) return;

        try {
          const response = await fetch("/api/products", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: productData.name,
              type: selectedType,
              price: parseFloat(price),
              image: productData.image,
            }),
          });

          if (!response.ok) {
            throw new Error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
          }

          Swal.fire({
            title: "เพิ่มสินค้าเรียบร้อย!",
            html: `
              <img src="${productData.image}" alt="Product Image" class="preview-img"/>
              <p>หมวดสินค้า: ${selectedType}</p>
              <p>ชื่อสินค้า: ${productData.name}</p>
              <p>ราคา: ${price} บาท</p>
            `,
            icon: "success",
          });
        } catch (error) {
          Swal.fire({
            title: "เกิดข้อผิดพลาด!",
            text: "ไม่สามารถบันทึกสินค้าได้",
            icon: "error",
          });
        }
      }}
    >
      <span className="text-5xl font-bold">+</span>
    </button>
  );
}