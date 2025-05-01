import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSnackById } from "../api/snacks";
import { axiosInstance } from "../config/axiosConfig";
import { toast } from "react-toastify";
import { FaMinus, FaPlus } from "react-icons/fa";
import Spinner from "../components/Spinner";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [snack, setSnack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchSnack = async () => {
      try {
        const data = await getSnackById(id);
        setSnack(data);
      } catch (error) {
        console.error("Failed to fetch snack detail:", error);
        toast.error("Không thể tải thông tin sản phẩm");
      } finally {
        setLoading(false);
      }
    };
    fetchSnack();
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng");
      navigate("/login");
      return;
    }

    try {
      setAddingToCart(true);
      await axiosInstance.post("/api/carts", {
        snackId: id,
        quantity: quantity
      });
      toast.success("Đã thêm vào giỏ hàng");
      navigate("/cart");
    } catch (error) {
      console.error("Failed to add to cart:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Không thể thêm vào giỏ hàng");
      }
    } finally {
      setAddingToCart(false);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (snack?.stock || 1)) {
      setQuantity(newQuantity);
    }
  };

  if (loading) return <Spinner />;

  if (!snack) return <p>Không tìm thấy sản phẩm</p>;

  const discountedPrice = snack.discount 
    ? snack.price * (1 - snack.discount / 100)
    : snack.price;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img
            src={snack.images}
            alt={snack.snackName}
            className="rounded-xl shadow-lg w-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-5xl text-[#ff784e] font-bold mb-4">{snack.snackName}</h1>
          <p className="text-gray-600 text-lg mb-4">{snack.description}</p>
          
          <div className="mb-4">
            {snack.discount > 0 ? (
              <div>
                <span className="text-xl line-through text-gray-400">{snack.price.toLocaleString('vi-VN')}đ</span>
                <span className="text-2xl font-semibold text-[#ff784e] ml-2">
                  {discountedPrice.toLocaleString('vi-VN')}đ
                </span>
                <span className="ml-2 bg-red-100 text-red-600 px-2 py-1 rounded">
                  -{snack.discount}%
                </span>
              </div>
            ) : (
              <div className="text-2xl font-semibold text-[#ff784e]">
                {snack.price.toLocaleString('vi-VN')}đ
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4 mb-4">
            <span className="text-gray-600">Số lượng:</span>
            <div className="flex items-center border rounded">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="p-2 hover:bg-gray-100 disabled:opacity-50"
              >
                <FaMinus size={12} />
              </button>
              <span className="px-4 py-2">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= snack.stock}
                className="p-2 hover:bg-gray-100 disabled:opacity-50"
              >
                <FaPlus size={12} />
              </button>
            </div>
            <span className="text-gray-500">
              {snack.stock} sản phẩm có sẵn
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={addingToCart || snack.stock === 0}
            className="bg-[#ff784e] text-white px-6 py-3 rounded-xl hover:bg-[#cc603e] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {snack.stock === 0 ? "Hết hàng" : "Thêm vào giỏ"}
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
