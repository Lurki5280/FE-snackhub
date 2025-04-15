
import React, { useEffect, useState } from "react";
import { getAllSnacks } from "../api/snacks";
import Spinner from "../components/Spinner";
import { Link } from "react-router-dom";
function Popular() {
  const [snacks, setSnacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [maxPrice, setMaxPrice] = useState(300000);
  const [sortOrder, setSortOrder] = useState("asc");
  useEffect(() => {
    const fetchSnacks = async () => {
      try {
        const data = await getAllSnacks();
        setSnacks(data);
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSnacks();
  }, []);

  const filteredSnacks = snacks
    .filter((snack) => {
      const matchName = snack.snackName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchPrice = snack.price <= maxPrice;
      return matchName && matchPrice;
    })
    .sort((a, b) => {
      return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
    });

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6">
      <div className="w-full lg:w-1/4 bg-white rounded-xl shadow-md p-4">
        <h2 className="text-xl font-semibold mb-4">Bộ lọc</h2>

        <div className="mb-4">
          <label className="block font-medium mb-1">Tìm kiếm</label>
          <input
            type="text"
            placeholder="Nhập từ khóa"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Khoảng giá</label>
          <input
            type="range"
            min={0}
            max={300000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-sm text-gray-600 mt-1">
            0 đ - {maxPrice.toLocaleString()} đ
          </div>
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Sắp xếp theo</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="asc">Giá: Thấp đến cao</option>
            <option value="desc">Giá: Cao đến thấp</option>
          </select>
        </div>
        <button
          onClick={() => {
            setSearchTerm("");
            setMaxPrice(300000);
            setSortOrder("asc");
          }}
          className="w-full mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
        >
          Xóa bộ lọc
        </button>
      </div>

      <div className="w-full lg:w-3/4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {loading ? (
          <Spinner></Spinner>
        ) : filteredSnacks.length === 0 ? (
          <p>Không tìm thấy sản phẩm nào.</p>
        ) : (
          filteredSnacks.map((snack) => (
            <Link
              to={`/product/${snack._id}`}
              key={snack._id}
              className="bg-white rounded-xl shadow p-4 hover:shadow-md transition duration-200"
            >
              <img
                src={snack.image}
                alt={snack.snackName}
                className="h-40 w-full object-cover rounded-md mb-3"
              />
              <h3 className="font-semibold text-lg">{snack.snackName}</h3>
              <p className="text-red-500 font-bold">{snack.price.toLocaleString()} VND</p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default Popular;
