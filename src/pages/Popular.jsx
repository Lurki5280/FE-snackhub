import React, { useEffect, useState } from "react";
import { getAllSnacks } from "../api/snacks";
import { axiosInstance } from "../config/axiosConfig";
import Spinner from "../components/Spinner";
import { Link } from "react-router-dom";
import { FaMinus, FaPlus, FaShoppingCart } from "react-icons/fa";
import { toast } from "react-toastify";

function Popular() {
  const [snacks, setSnacks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [maxPrice, setMaxPrice] = useState(300000);
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [quantities, setQuantities] = useState({});
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
        
        // Initialize quantities
        const initialQuantities = {};
        snacksData.forEach(snack => {
          initialQuantities[snack._id] = 1;
        });
        setQuantities(initialQuantities);
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleQuantityChange = (snackId, change) => {
    const snack = snacks.find(s => s._id === snackId);
    if (!snack) return;

    setQuantities(prev => {
      const currentQty = prev[snackId] || 1;
      const newQty = currentQty + change;
      
      // Giới hạn trong khoảng từ 1 đến số lượng tồn kho
      const limitedQty = Math.min(Math.max(1, newQty), snack.stock);
      
      // Chỉ hiển thị thông báo khi người dùng cố gắng thêm quá số lượng tồn kho
      if (change > 0 && newQty > snack.stock) {
        toast.warning(`Chỉ còn ${snack.stock} sản phẩm trong kho`);
      }
      
      return {
        ...prev,
        [snackId]: limitedQty
      };
    });
  };

  const handleQuantityInput = (snackId, value) => {
    const snack = snacks.find(s => s._id === snackId);
    if (!snack) return;

    // Nếu input rỗng, giữ nguyên giá trị cũ
    if (value === '') {
      setQuantities(prev => ({
        ...prev,
        [snackId]: prev[snackId] || 1
      }));
      return;
    }

    // Convert to number
    let numValue = parseInt(value);
    
    // Nếu là số hợp lệ
    if (!isNaN(numValue)) {
      // Giới hạn trong khoảng từ 1 đến số lượng tồn kho
      numValue = Math.min(Math.max(1, numValue), snack.stock);
      
      setQuantities(prev => ({
        ...prev,
        [snackId]: numValue
      }));
    }
  };

  const addToCart = async (e, snack) => {
    e.preventDefault(); // Prevent navigation to product detail
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng!');
        return;
      }
      const quantity = quantities[snack._id] || 1;
      await axiosInstance.post('/api/carts', {
        snackId: snack._id,
        quantity: quantity
      });
      toast.success('Đã thêm vào giỏ hàng!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error.response) {
        switch (error.response.status) {
          case 401:
            toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng!');
            break;
          case 400:
            toast.error(error.response.data.message || 'Không đủ số lượng trong kho!');
            break;
          case 404:
            toast.error('Sản phẩm không tồn tại!');
            break;
          default:
            toast.error('Không thể thêm vào giỏ hàng. Vui lòng thử lại sau!');
        }
      } else {
        toast.error('Không thể kết nối đến server. Vui lòng thử lại sau!');
      }
    }
  };

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
            <option value="banh">Bánh</option>
            <option value="keo">Kẹo</option>
            <option value="do_kho">Đồ khô</option>
            <option value="mut">Mứt</option>
            <option value="hat">Hạt</option>
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
        <div className="mb-4 flex justify-between items-center">
          <div className="text-gray-600">
            Hiển thị {currentSnacks.length} / {filteredSnacks.length} sản phẩm
          </div>
          {searchTerm && (
            <div className="text-gray-600">
              Kết quả tìm kiếm cho "{searchTerm}"
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
          {loading ? (
            <Spinner></Spinner>
          ) : currentSnacks.length === 0 ? (
            <p>Không tìm thấy sản phẩm nào.</p>
          ) : (
            currentSnacks.map((snack) => (
              <div
                key={snack._id}
                className="bg-white rounded-xl shadow p-4 hover:shadow-md transition duration-200"
              >
                <Link to={`/product/${snack._id}`} className="block mb-3">
                  <img
                    src={snack.images}
                    alt={snack.snackName}
                    className="h-40 w-full object-cover rounded-md"
                  />
                </Link>
                <div className="space-y-2">
                  <Link to={`/product/${snack._id}`}>
                    <h3 className="font-semibold text-lg">{snack.snackName}</h3>
                    <p className="text-red-500 font-bold">{snack.price.toLocaleString()} VND</p>
                  </Link>
                  <div className="text-sm text-gray-500">
                    Còn lại: {snack.stock} sản phẩm
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border rounded-lg overflow-hidden">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleQuantityChange(snack._id, -1);
                        }}
                        className="px-2 py-1 bg-gray-100 hover:bg-gray-200 border-r"
                      >
                        <FaMinus className="w-3 h-3" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={quantities[snack._id] || 1}
                        onChange={(e) => handleQuantityInput(snack._id, e.target.value)}
                        className="w-12 text-center py-1 focus:outline-none [-moz-appearance:_textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleQuantityChange(snack._id, 1);
                        }}
                        className="px-2 py-1 bg-gray-100 hover:bg-gray-200 border-l"
                      >
                        <FaPlus className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      onClick={(e) => addToCart(e, snack)}
                      className="flex items-center gap-1 bg-[#ff784e] text-white px-3 py-1 rounded-lg hover:bg-[#ff6b3d] text-sm"
                    >
                      <FaShoppingCart className="w-4 h-4" />
                      <span>Thêm</span>
                    </button>
                  </div>
                </div>
              </div>
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
