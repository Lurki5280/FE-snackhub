import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSnackById } from "../api/snacks";
import { getSnackReviews, createReview, updateReview, deleteReview } from "../api/reviews";
import { addToFavorites, removeFromFavorites, checkIsFavorite } from "../api/favorites";
import { axiosInstance } from "../config/axiosConfig";
import { toast } from "react-toastify";
import { FaMinus, FaPlus, FaStar, FaEdit, FaTrash, FaTag, FaGift, FaTruck, FaHeart } from "react-icons/fa";
import Spinner from "../components/Spinner";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [snack, setSnack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ""
  });
  const [editingReview, setEditingReview] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Decode token to get user ID
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(tokenPayload.userId);
      } catch (error) {
        console.error("Error decoding token:", error);
        // Invalid token, remove it
        localStorage.removeItem("token");
      }
    }
  }, []);

  // Check if product is in favorites
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!currentUserId) {
        // Nếu không có người dùng đăng nhập, không cần kiểm tra
        setIsFavorite(false);
        return;
      }
      
      try {
        // Sử dụng try/catch để xử lý mọi lỗi có thể xảy ra
        const isFav = await checkIsFavorite(id);
        setIsFavorite(!!isFav); // Chuyển đổi về boolean chắc chắn
      } catch (error) {
        console.error("Error checking favorite status:", error);
        setIsFavorite(false); // Nếu có lỗi, đặt giá trị về false
      }
    };
    
    checkFavoriteStatus();
  }, [id, currentUserId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [snackData, reviewsData] = await Promise.all([
          getSnackById(id),
          getSnackReviews(id)
        ]);
        setSnack(snackData);
        setReviews(reviewsData);
        
        // Check if current user has already reviewed this product
        if (currentUserId) {
          const userReview = reviewsData.find(
            review => review.userId && review.userId._id === currentUserId
          );
          
          if (userReview) {
            setUserHasReviewed(true);
            // Pre-fill the form with the user's existing review
            setReviewForm({
              rating: userReview.rating,
              comment: userReview.comment
            });
            setEditingReview(userReview);
          } else {
            setUserHasReviewed(false);
            setReviewForm({ rating: 5, comment: "" });
            setEditingReview(null);
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Không thể tải thông tin sản phẩm");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, currentUserId]);

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

  const handleToggleFavorite = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Vui lòng đăng nhập để thêm vào yêu thích");
      navigate("/login");
      return;
    }

    try {
      setFavoriteLoading(true);
      if (isFavorite) {
        await removeFromFavorites(id);
        toast.success("Đã xóa khỏi danh sách yêu thích");
      } else {
        await addToFavorites(id);
        toast.success("Đã thêm vào danh sách yêu thích");
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Failed to update favorites:", error);
      // Hiển thị thông báo lỗi chi tiết hơn
      let errorMessage = "Không thể cập nhật danh sách yêu thích";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        localStorage.removeItem("token");
        errorMessage = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại";
        navigate("/login");
      } else if (!navigator.onLine) {
        errorMessage = "Không có kết nối internet. Vui lòng kiểm tra lại mạng của bạn";
      }
      
      toast.error(errorMessage);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (snack?.stock || 1)) {
      setQuantity(newQuantity);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Vui lòng đăng nhập để đánh giá sản phẩm");
      navigate("/login");
      return;
    }

    // Validate form data
    if (!reviewForm.comment.trim()) {
      toast.error("Vui lòng nhập nội dung đánh giá");
      return;
    }

    try {
      setSubmittingReview(true);
      
      // Log the user ID and product ID to debug
      console.log("Submitting review for user:", currentUserId, "and product:", id);
      
      if (editingReview) {
        await updateReview(editingReview._id, reviewForm);
        toast.success("Đã cập nhật đánh giá");
      } else {
        await createReview(id, reviewForm);
        toast.success("Đã thêm đánh giá");
      }
      
      // Refresh the reviews
      const updatedReviews = await getSnackReviews(id);
      setReviews(updatedReviews);
      
      // Find the user's review in the updated reviews
      if (currentUserId) {
        const userReview = updatedReviews.find(
          review => review.userId && review.userId._id === currentUserId
        );
        
        if (userReview) {
          setUserHasReviewed(true);
          setEditingReview(userReview);
          setReviewForm({
            rating: userReview.rating,
            comment: userReview.comment
          });
        }
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
      let errorMessage = "Không thể gửi đánh giá";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
        
        // Vietnamese translation of common errors
        if (errorMessage === "You have already reviewed this snack") {
          errorMessage = "Bạn đã đánh giá sản phẩm này rồi";
        } else if (errorMessage.includes("Duplicate review error")) {
          errorMessage = "Bạn đã đánh giá sản phẩm này rồi";
        }
        
        // Log detailed error information for debugging
        console.error("Error details:", error.response.data);
      }
      
      toast.error(errorMessage);
      
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại");
        navigate("/login");
      }
      
      // Try to reload the reviews to see if the user already has a review
      try {
        const currentReviews = await getSnackReviews(id);
        setReviews(currentReviews);
        
        if (currentUserId) {
          const existingReview = currentReviews.find(
            review => review.userId && review.userId._id === currentUserId
          );
          
          if (existingReview) {
            setUserHasReviewed(true);
            setEditingReview(existingReview);
            setReviewForm({
              rating: existingReview.rating,
              comment: existingReview.comment
            });
            toast.info("Bạn đã có đánh giá cho sản phẩm này, có thể chỉnh sửa nếu muốn");
          }
        }
      } catch (reloadError) {
        console.error("Failed to reload reviews:", reloadError);
      }
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm("Bạn có chắc chắn muốn xóa đánh giá này không?")) {
      return;
    }
    
    try {
      await deleteReview(reviewId);
      const updatedReviews = await getSnackReviews(id);
      setReviews(updatedReviews);
      toast.success("Đã xóa đánh giá");
      
      // Reset review form
      setUserHasReviewed(false);
      setReviewForm({ rating: 5, comment: "" });
      setEditingReview(null);
    } catch (error) {
      console.error("Failed to delete review:", error);
      toast.error("Không thể xóa đánh giá");
      
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setReviewForm({
      rating: review.rating,
      comment: review.comment
    });
    
    // Scroll to review form
    document.getElementById("review-form")?.scrollIntoView({ behavior: "smooth" });
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
          
          <div className="mb-6 bg-amber-50 p-4 rounded-lg border border-amber-100">
            <h3 className="font-bold text-amber-800 mb-2 flex items-center">
              <FaTag className="mr-2" /> Khuyến mãi hot nhất:
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <FaTruck className="text-[#ff784e] mt-1 mr-2 flex-shrink-0" />
                <span>Miễn phí vận chuyển với đơn hàng 200k</span>
              </li>
              <li className="flex items-start">
                <FaGift className="text-[#ff784e] mt-1 mr-2 flex-shrink-0" />
                <span>Giftcard lên tới 100K</span>
              </li>
              <li className="flex items-start">
                <FaTag className="text-[#ff784e] mt-1 mr-2 flex-shrink-0" />
                <span>Phiếu mua hàng trị giá 50K</span>
              </li>
            </ul>
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

          <div className="flex items-center space-x-4">
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || snack.stock === 0}
              className="bg-[#ff784e] text-white px-6 py-3 rounded-xl hover:bg-[#cc603e] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-grow"
            >
              {snack.stock === 0 ? "Hết hàng" : "Thêm vào giỏ"}
            </button>
            
            <button
              onClick={handleToggleFavorite}
              disabled={favoriteLoading}
              className={`flex items-center justify-center rounded-xl px-4 py-3 border transition duration-200 
                ${isFavorite 
                  ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100' 
                  : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}
            >
              <FaHeart className={`text-lg ${isFavorite ? 'text-red-500' : 'text-gray-400'}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Mô tả sản phẩm</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-gray-600 text-lg mb-6 text-justify">{snack.description}</p>
          
          {snack.longDescription && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h3 className="text-xl font-semibold mb-3">Thông tin chi tiết</h3>
              <p className="text-gray-700 leading-relaxed text-justify">{snack.longDescription}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-4">Đánh giá sản phẩm</h2>
        
        {currentUserId ? (
          <form id="review-form" onSubmit={handleReviewSubmit} className="mb-8 bg-gray-50 p-6 rounded-lg">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-semibold">
                {editingReview ? "Cập nhật đánh giá của bạn" : "Đánh giá của bạn"}
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                    className={`text-2xl ${star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    <FaStar />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-semibold">Bình luận</label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff784e]"
                rows="4"
                required
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={submittingReview}
                className="bg-[#ff784e] text-white px-6 py-2 rounded-lg hover:bg-[#cc603e] transition duration-200 disabled:opacity-50"
              >
                {submittingReview 
                  ? "Đang gửi..." 
                  : (editingReview ? "Cập nhật đánh giá" : "Gửi đánh giá")}
              </button>
              
              {editingReview && (
                <button
                  type="button"
                  onClick={() => handleDeleteReview(editingReview._id)}
                  className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition duration-200"
                >
                  Xóa đánh giá
                </button>
              )}
            </div>
          </form>
        ) : (
          <div className="mb-8 bg-gray-50 p-6 rounded-lg text-center">
            <p className="text-gray-700 mb-4">Vui lòng đăng nhập để đánh giá sản phẩm</p>
            <button
              onClick={() => navigate("/login")}
              className="bg-[#ff784e] text-white px-6 py-2 rounded-lg hover:bg-[#cc603e] transition duration-200"
            >
              Đăng nhập
            </button>
          </div>
        )}

        <div className="space-y-6">
          <h3 className="font-semibold text-xl mb-4">
            {reviews.length > 0 
              ? `${reviews.length} đánh giá từ khách hàng` 
              : "Chưa có đánh giá nào"}
          </h3>
          
          {reviews.map((review) => (
            <div key={review._id} className="border-b pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">
                    {review.userId?.firstName} {review.userId?.lastName}
                  </h3>
                  <div className="flex items-center space-x-1 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i} 
                        className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'} 
                      />
                    ))}
                    <span className="text-gray-500 ml-2 text-sm">
                      {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
                
                {currentUserId && review.userId && currentUserId === review.userId._id && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditReview(review)}
                      className="text-gray-500 hover:text-[#ff784e]"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>
              <p className="mt-2 text-gray-700">{review.comment}</p>
            </div>
          ))}
          
          {reviews.length === 0 && (
            <p className="text-gray-500 text-center">Chưa có đánh giá nào cho sản phẩm này</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
