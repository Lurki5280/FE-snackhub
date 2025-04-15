import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSnackById } from "../api/snacks";
import Spinner from "../components/Spinner";

function ProductDetail() {
  const { id } = useParams();
  const [snack, setSnack] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSnack = async () => {
      try {
        const data = await getSnackById(id);
        setSnack(data);
      } catch (error) {
        console.error("Failed to fetch snack detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSnack();
  }, [id]);

  if (loading) return <Spinner />;

  if (!snack) return <p>Không tìm thấy sản phẩm</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img
            src={snack.image}
            alt={snack.snackName}
            className="rounded-xl shadow-lg w-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-5xl text-[#ff784e] font-bold mb-4">{snack.snackName}</h1>
          <p className="text-gray-600 text-lg mb-4">{snack.description}</p>
          <div className="text-xl font-semibold mb-4">{snack.price} VND</div>
          <button className="bg-[#ff784e] text-white px-6 py-3 rounded-xl hover:bg-[#cc603e] transition duration-200">
            Thêm vào giỏ
          </button>
        </div>
      </div>
      {snack.longDescription && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-4">Mô tả thêm</h2>
          <p className="text-gray-700 leading-relaxed">{snack.longDescription}</p>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
