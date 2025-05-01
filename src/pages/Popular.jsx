import React, { useEffect, useState } from "react";
import { getAllSnacks } from "../api/snacks";
import { axiosInstance } from "../config/axiosConfig";
import Spinner from "../components/Spinner";
import { Link } from "react-router-dom";

function Popular() {
  const [snacks, setSnacks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [maxPrice, setMaxPrice] = useState(300000);
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [snacksData, categoriesData] = await Promise.all([
          getAllSnacks(),
          axiosInstance.get('/api/categories')
        ]);
        setSnacks(snacksData);
        setCategories(categoriesData.data);
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredSnacks = snacks
    .filter((snack) => {
      const matchName = snack.snackName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchPrice = snack.price <= maxPrice;
      const matchCategory = selectedCategory ? snack.categoryId === selectedCategory : true;
      return matchName && matchPrice && matchCategory;
    })
    .sort((a, b) => {
      return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
    });

  // Tính toán phân trang
  const totalPages = Math.ceil(filteredSnacks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSnacks = filteredSnacks.slice(startIndex, endIndex);

  // Reset về trang 1 khi thay đổi bộ lọc
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, maxPrice, sortOrder, selectedCategory]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Cuộn lên đầu trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setMaxPrice(300000);
    setSortOrder("asc");
    setSelectedCategory("");
  };

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
          <label className="block font-medium mb-1">Danh mục</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.categoryName}
              </option>
            ))}
          </select>
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
          onClick={handleClearFilters}
          className="w-full mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
        >
          Xóa bộ lọc
        </button>
      </div>

      <div className="w-full lg:w-3/4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
          {loading ? (
            <Spinner></Spinner>
          ) : currentSnacks.length === 0 ? (
            <p>Không tìm thấy sản phẩm nào.</p>
          ) : (
            currentSnacks.map((snack) => (
              <Link
                to={`/product/${snack._id}`}
                key={snack._id}
                className="bg-white rounded-xl shadow p-4 hover:shadow-md transition duration-200"
              >
                <img
                  src={snack.images}
                  alt={snack.snackName}
                  className="h-40 w-full object-cover rounded-md mb-3"
                />
                <h3 className="font-semibold text-lg">{snack.snackName}</h3>
                <p className="text-red-500 font-bold">{snack.price.toLocaleString()} VND</p>
              </Link>
            ))
          )}
        </div>

        {/* Phân trang */}
        {!loading && filteredSnacks.length > 0 && (
          <div className="flex justify-center items-center space-x-2 mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === pageNumber
                    ? "bg-[#ff784e] text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {pageNumber}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Popular;
