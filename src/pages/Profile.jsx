import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FaUser, FaShoppingCart, FaHistory, FaHeart, FaMapMarkerAlt, FaPlus, FaEdit, FaTrash, FaStar, FaClipboardList, FaComment, FaLock, FaExclamationTriangle, FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';
import { BiCoin } from 'react-icons/bi';
import { getCurrentUser, loadSnackPoints } from '../store/reducers/authReducer';
import { axiosInstance } from '../config/axiosConfig';
import { toast } from 'react-toastify';
import { hcmcDistricts } from '../utils/hcmcData';
import { getUserReviews, updateReview, deleteReview } from '../api/reviews';
import { changePassword } from '../api/auth';
import { getUserFavorites, removeFromFavorites } from '../api/favorites';

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('profile');
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [availableWards, setAvailableWards] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [showCancelOrderModal, setShowCancelOrderModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [showDeleteReviewModal, setShowDeleteReviewModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ""
  });
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    district: '',
    ward: '',
    specificAddress: '',
    isDefault: false
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswordErrorModal, setShowPasswordErrorModal] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [removingFavorite, setRemovingFavorite] = useState(null);
  const [showRemoveFavoriteModal, setShowRemoveFavoriteModal] = useState(false);
  const [snackPointsAmount, setSnackPointsAmount] = useState('');
  const [loadingPoints, setLoadingPoints] = useState(false);

  // Get tab from URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/users/addresses');
      setAddresses(response.data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast.error('Không thể tải danh sách địa chỉ');
    } finally {
      setLoading(false);
    }
  };

  const handleDistrictChange = (districtId) => {
    const district = hcmcDistricts.find(d => d.id === districtId);
    setSelectedDistrict(districtId);
    setAvailableWards(district ? district.wards : []);
    setAddressForm(prev => ({
      ...prev,
      district: district ? district.name : '',
      ward: '' // Reset ward when district changes
    }));
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    
    const formData = {
      fullName: addressForm.fullName.trim(),
      phone: addressForm.phone.trim(),
      district: addressForm.district,
      ward: addressForm.ward,
      specificAddress: addressForm.specificAddress.trim(),
      isDefault: addressForm.isDefault
    };

    // Validate required fields
    if (!formData.fullName || !formData.phone || !formData.district || 
        !formData.ward || !formData.specificAddress) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      setLoading(true);
      if (editingAddress) {
        await axiosInstance.put(`/api/users/addresses/${editingAddress._id}`, formData);
        toast.success('Cập nhật địa chỉ thành công');
      } else {
        await axiosInstance.post('/api/users/addresses', formData);
        toast.success('Thêm địa chỉ thành công');
      }

      // Reset form and fetch updated addresses
      setShowAddressForm(false);
      setEditingAddress(null);
      setAddressForm({
        fullName: '',
        phone: '',
        district: '',
        ward: '',
        specificAddress: '',
        isDefault: false
      });
      setSelectedDistrict('');
      setAvailableWards([]);
      await fetchAddresses();
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error(error.response?.data?.message || 'Không thể lưu địa chỉ');
    } finally {
      setLoading(false);
    }
  };

  const handleEditAddress = (address) => {
    const district = hcmcDistricts.find(d => d.name === address.district);
    if (district) {
      setSelectedDistrict(district.id);
      setAvailableWards(district.wards);
    }
    setEditingAddress(address);
    setAddressForm({
      fullName: address.fullName || '',
      phone: address.phone || '',
      district: address.district || '',
      ward: address.ward || '',
      specificAddress: address.specificAddress || '',
      isDefault: address.isDefault || false
    });
    setShowAddressForm(true);
  };

  const handleDeleteAddress = (addressId) => {
    setAddressToDelete(addressId);
    setShowDeleteModal(true);
  };

  const confirmDeleteAddress = async () => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/api/users/addresses/${addressToDelete}`);
      toast.success('Xóa địa chỉ thành công');
      fetchAddresses();
      setShowDeleteModal(false);
      setAddressToDelete(null);
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Không thể xóa địa chỉ');
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      setLoading(true);
      await axiosInstance.put(`/api/users/addresses/${addressId}/default`);
      toast.success('Đã đặt làm địa chỉ mặc định');
      fetchAddresses();
    } catch (error) {
      console.error('Error setting default address:', error);
      toast.error('Không thể đặt làm địa chỉ mặc định');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Không thể tải lịch sử đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = (orderId) => {
    setOrderToCancel(orderId);
    setShowCancelOrderModal(true);
  };

  const confirmCancelOrder = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.delete(`/api/orders/${orderToCancel}`);
      // Hiển thị thông báo tùy chỉnh từ server nếu có
      if (response.data.message) {
        toast.success(response.data.message);
      } else {
        toast.success('Hủy đơn hàng thành công');
      }
      
      // Cập nhật thông tin người dùng nếu có hoàn SnackPoints
      if (response.data.order?.paymentMethod === 'SnackPoints') {
        dispatch(getCurrentUser());
      }
      
      fetchOrders();
      setShowCancelOrderModal(false);
      setOrderToCancel(null);
    } catch (error) {
      console.error('Error canceling order:', error);
      toast.error('Không thể hủy đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await getUserReviews();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Không thể tải danh sách đánh giá');
    } finally {
      setLoading(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setReviewForm({
      rating: review.rating,
      comment: review.comment
    });
  };

  const handleCancelEditReview = () => {
    setEditingReview(null);
    setReviewForm({
      rating: 5,
      comment: ""
    });
  };

  const handleUpdateReview = async () => {
    try {
      setLoading(true);
      await updateReview(editingReview._id, reviewForm);
      toast.success('Cập nhật đánh giá thành công');
      fetchReviews();
      setEditingReview(null);
    } catch (error) {
      console.error('Error updating review:', error);
      toast.error('Không thể cập nhật đánh giá');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = (reviewId) => {
    setReviewToDelete(reviewId);
    setShowDeleteReviewModal(true);
  };

  const confirmDeleteReview = async () => {
    try {
      setLoading(true);
      await deleteReview(reviewToDelete);
      toast.success('Xóa đánh giá thành công');
      fetchReviews();
      setShowDeleteReviewModal(false);
      setReviewToDelete(null);
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Không thể xóa đánh giá');
    } finally {
      setLoading(false);
    }
  };

  // Password change handler
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordErrorMessage('Mật khẩu mới không khớp với mật khẩu xác nhận');
      setShowPasswordErrorModal(true);
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setPasswordErrorMessage('Mật khẩu mới phải có ít nhất 6 ký tự');
      setShowPasswordErrorModal(true);
      return;
    }
    
    try {
      setPasswordLoading(true);
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      toast.success('Đổi mật khẩu thành công');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      let errorMsg = error.response?.data?.message || 'Không thể đổi mật khẩu';
      if (error.response?.status === 400) {
        errorMsg = 'Mật khẩu hiện tại không chính xác';
      } else if (error.response?.status === 401) {
        errorMsg = 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại';
      } else if (!navigator.onLine) {
        errorMsg = 'Không có kết nối internet. Vui lòng kiểm tra lại kết nối của bạn';
      }
      setPasswordErrorMessage(errorMsg);
      setShowPasswordErrorModal(true);
    } finally {
      setPasswordLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const data = await getUserFavorites();
      
      // Kiểm tra null hoặc undefined
      if (!data) {
        console.error('Favorites data is null or undefined');
        setFavorites([]);
        toast.error('Không thể tải danh sách sản phẩm yêu thích');
        return;
      }
      
      // Kiểm tra loại dữ liệu
      if (!Array.isArray(data)) {
        console.error('Favorites data is not an array:', data);
        setFavorites([]);
        toast.error('Định dạng dữ liệu không đúng. Vui lòng thử lại sau.');
        return;
      }
      
      // Kiểm tra dữ liệu hợp lệ trong mảng
      const validFavorites = data.filter(item => 
        item && 
        typeof item === 'object' && 
        item._id
      );
      
      // Nếu có bất kỳ mục không hợp lệ nào, ghi log để debug
      if (validFavorites.length !== data.length) {
        console.warn('Some favorite items were filtered out due to invalid format', 
          {original: data, filtered: validFavorites});
      }
      
      setFavorites(validFavorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setFavorites([]);
      toast.error('Không thể tải danh sách sản phẩm yêu thích');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromFavorites = (snackId) => {
    setRemovingFavorite(snackId);
    setShowRemoveFavoriteModal(true);
  };

  const confirmRemoveFromFavorites = async () => {
    try {
      setLoading(true);
      await removeFromFavorites(removingFavorite);
      toast.success('Đã xóa khỏi danh sách yêu thích');
      await fetchFavorites();
      setShowRemoveFavoriteModal(false);
      setRemovingFavorite(null);
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast.error('Không thể xóa khỏi danh sách yêu thích');
    } finally {
      setLoading(false);
    }
  };

  // Load SnackPoints
  const handleLoadSnackPoints = async (e) => {
    e.preventDefault();
    
    // Validate số điểm cần nạp
    const amount = parseInt(snackPointsAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Vui lòng nhập số điểm hợp lệ');
      return;
    }
    
    try {
      setLoadingPoints(true);
      await dispatch(loadSnackPoints(amount)).unwrap();
      toast.success(`Nạp thành công ${amount.toLocaleString('vi-VN')} SnackPoints!`);
      setSnackPointsAmount('');
      // Cập nhật thông tin người dùng
      dispatch(getCurrentUser());
    } catch (error) {
      toast.error(error.message || 'Không thể nạp SnackPoints');
    } finally {
      setLoadingPoints(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    dispatch(getCurrentUser());
  }, [token, navigate, dispatch]);

  useEffect(() => {
    if (activeTab === 'addresses') {
      fetchAddresses();
    } else if (activeTab === 'orders') {
      fetchOrders();
    } else if (activeTab === 'reviews') {
      fetchReviews();
    } else if (activeTab === 'favorites') {
      fetchFavorites();
    }
  }, [activeTab]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div role="status" className="mb-4">
            <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin fill-[#ff784e]" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
          <p className="text-lg text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-[#ff784e] p-6 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
                <FaUser className="text-[#ff784e] text-4xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user.firstName} {user.lastName}</h1>
                <p className="text-white/80">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="flex">
              <button
                onClick={() => {
                  setActiveTab('profile');
                  navigate('/profile?tab=profile');
                }}
                className={`flex items-center px-6 py-3 font-medium ${
                  activeTab === 'profile'
                    ? 'text-[#ff784e] border-b-2 border-[#ff784e]'
                    : 'text-gray-600 hover:text-[#ff784e]'
                }`}
              >
                <FaUser className="mr-2" />
                <span>Thông tin cá nhân</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('addresses');
                  navigate('/profile?tab=addresses');
                }}
                className={`flex items-center px-6 py-3 font-medium ${
                  activeTab === 'addresses'
                    ? 'text-[#ff784e] border-b-2 border-[#ff784e]'
                    : 'text-gray-600 hover:text-[#ff784e]'
                }`}
              >
                <FaMapMarkerAlt className="mr-2" />
                <span>Địa chỉ</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('orders');
                  navigate('/profile?tab=orders');
                }}
                className={`flex items-center px-6 py-3 font-medium ${
                  activeTab === 'orders'
                    ? 'text-[#ff784e] border-b-2 border-[#ff784e]'
                    : 'text-gray-600 hover:text-[#ff784e]'
                }`}
              >
                <FaClipboardList className="mr-2" />
                <span>Đơn hàng</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('reviews');
                  navigate('/profile?tab=reviews');
                }}
                className={`flex items-center px-6 py-3 font-medium ${
                  activeTab === 'reviews'
                    ? 'text-[#ff784e] border-b-2 border-[#ff784e]'
                    : 'text-gray-600 hover:text-[#ff784e]'
                }`}
              >
                <FaComment className="mr-2" />
                <span>Đánh giá sản phẩm</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('favorites');
                  navigate('/profile?tab=favorites');
                }}
                className={`flex items-center px-6 py-3 font-medium ${
                  activeTab === 'favorites'
                    ? 'text-[#ff784e] border-b-2 border-[#ff784e]'
                    : 'text-gray-600 hover:text-[#ff784e]'
                }`}
              >
                <FaHeart className="mr-2" />
                <span>Yêu thích</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('snackpoints');
                  navigate('/profile?tab=snackpoints');
                }}
                className={`flex items-center px-6 py-3 font-medium ${
                  activeTab === 'snackpoints'
                    ? 'text-[#ff784e] border-b-2 border-[#ff784e]'
                    : 'text-gray-600 hover:text-[#ff784e]'
                }`}
              >
                <BiCoin className="mr-2" />
                <span>SnackPoints</span>
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <FaUser className="text-[#ff784e]" />
                    <span className="font-medium">Thông tin cá nhân</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Họ</label>
                      <p className="mt-1 p-2 bg-gray-50 rounded">{user.lastName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tên</label>
                      <p className="mt-1 p-2 bg-gray-50 rounded">{user.firstName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 p-2 bg-gray-50 rounded">{user.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                      <p className="mt-1 p-2 bg-gray-50 rounded">{user.phone}</p>
                    </div>
                  </div>
                </div>
                
                {/* Phần đổi mật khẩu */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-2 mb-4">
                    <FaLock className="text-[#ff784e]" />
                    <span className="font-medium">Đổi mật khẩu</span>
                  </div>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="relative">
                      <label className="block mb-1 font-medium">Mật khẩu hiện tại</label>
                      <div className="flex relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          className="w-full border border-gray-300 rounded-md p-2 pr-10"
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                          required
                        />
                        <button 
                          type="button"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                    <div className="relative">
                      <label className="block mb-1 font-medium">Mật khẩu mới</label>
                      <div className="flex relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          className="w-full border border-gray-300 rounded-md p-2 pr-10"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                          required
                          minLength={6}
                        />
                        <button 
                          type="button"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                    <div className="relative">
                      <label className="block mb-1 font-medium">Xác nhận mật khẩu mới</label>
                      <div className="flex relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          className="w-full border border-gray-300 rounded-md p-2 pr-10"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                          required
                          minLength={6}
                        />
                        <button 
                          type="button"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="bg-[#ff784e] text-white px-4 py-2 rounded-md hover:bg-[#cc603e] disabled:bg-gray-400"
                      disabled={passwordLoading}
                    >
                      {passwordLoading ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FaMapMarkerAlt className="text-[#ff784e]" />
                    <span className="font-medium">Địa chỉ giao hàng</span>
                  </div>
                  <button
                    onClick={() => {
                      setShowAddressForm(true);
                      setEditingAddress(null);
                      setAddressForm({
                        fullName: '',
                        phone: '',
                        district: '',
                        ward: '',
                        specificAddress: '',
                        isDefault: false
                      });
                      setSelectedDistrict('');
                      setAvailableWards([]);
                    }}
                    className="flex items-center space-x-2 text-[#ff784e] hover:text-[#cc603e]"
                  >
                    <FaPlus />
                    <span>Thêm địa chỉ mới</span>
                  </button>
                </div>

                {showAddressForm && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <form onSubmit={handleAddressSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Họ và tên người nhận
                          </label>
                          <input
                            type="text"
                            value={addressForm.fullName}
                            onChange={(e) =>
                              setAddressForm({ ...addressForm, fullName: e.target.value })
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff784e] focus:ring-[#ff784e]"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Số điện thoại
                          </label>
                          <input
                            type="tel"
                            value={addressForm.phone}
                            onChange={(e) =>
                              setAddressForm({ ...addressForm, phone: e.target.value })
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff784e] focus:ring-[#ff784e]"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Quận
                          </label>
                          <select
                            value={selectedDistrict}
                            onChange={(e) => handleDistrictChange(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff784e] focus:ring-[#ff784e]"
                            required
                          >
                            <option value="">Chọn quận</option>
                            {hcmcDistricts.map((district) => (
                              <option key={district.id} value={district.id}>
                                {district.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Phường
                          </label>
                          <select
                            value={addressForm.ward}
                            onChange={(e) =>
                              setAddressForm({ ...addressForm, ward: e.target.value })
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff784e] focus:ring-[#ff784e]"
                            required
                            disabled={!selectedDistrict}
                          >
                            <option value="">Chọn phường</option>
                            {availableWards.map((ward) => (
                              <option key={ward} value={ward}>
                                {ward}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Địa chỉ cụ thể
                          </label>
                          <input
                            type="text"
                            value={addressForm.specificAddress}
                            onChange={(e) =>
                              setAddressForm({ ...addressForm, specificAddress: e.target.value })
                            }
                            placeholder="Số nhà, tên đường..."
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff784e] focus:ring-[#ff784e]"
                            required
                          />
                        </div>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="isDefault"
                          checked={addressForm.isDefault}
                          onChange={(e) =>
                            setAddressForm({ ...addressForm, isDefault: e.target.checked })
                          }
                          className="h-4 w-4 text-[#ff784e] focus:ring-[#ff784e] border-gray-300 rounded"
                        />
                        <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
                          Đặt làm địa chỉ mặc định
                        </label>
                      </div>
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddressForm(false);
                            setEditingAddress(null);
                            setSelectedDistrict('');
                            setAvailableWards([]);
                          }}
                          className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                        >
                          Hủy
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-4 py-2 bg-[#ff784e] text-white rounded-md hover:bg-[#cc603e] disabled:opacity-50"
                        >
                          {loading ? 'Đang lưu...' : editingAddress ? 'Cập nhật' : 'Thêm địa chỉ'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((address) => (
                    <div
                      key={address._id}
                      className="border rounded-lg p-4 relative hover:shadow-md transition-shadow"
                    >
                      {address.isDefault && (
                        <span className="absolute top-2 right-2 text-[#ff784e]">
                          <FaStar />
                        </span>
                      )}
                      <div className="space-y-2">
                        <p className="font-medium">{address.fullName}</p>
                        <p className="text-gray-600">{address.phone}</p>
                        <p>{address.specificAddress}</p>
                        <p>
                          {address.ward}, {address.district}, TP.HCM
                        </p>
                        <div className="flex items-center space-x-4 mt-4">
                          <button
                            onClick={() => handleEditAddress(address)}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address._id)}
                            className="text-sm text-red-600 hover:text-red-800"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <FaClipboardList className="text-[#ff784e]" />
                  <span className="font-medium">Đơn hàng của tôi</span>
                </div>
                {loading ? (
                  <div className="text-center py-4">Đang tải...</div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-4">Bạn chưa có đơn hàng nào</div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <p className="font-medium">Đơn hàng #{order._id}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm ${
                            order.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.orderStatus === 'processing' ? 'bg-gray-100 text-blue-800' :
                            order.orderStatus === 'shipping' ? 'bg-cyan-100 text-cyan-800' :
                            order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.orderStatus === 'pending' ? 'Chờ xử lý' :
                             order.orderStatus === 'processing' ? 'Đang xử lý' :
                             order.orderStatus === 'shipping' ? 'Đang giao hàng' :
                             order.orderStatus === 'delivered' ? 'Đã hoàn thành' :
                             order.orderStatus === 'cancelled' ? 'Đã hủy' :
                             order.orderStatus}
                          </div>
                        </div>

                        <div className="space-y-2">
                          {order.items?.map((item) => (
                            <div key={item._id} className="flex justify-between items-center py-2 border-b">
                              <div className="flex items-center space-x-2">
                                <img 
                                  src={item.snackId?.images?.[0]} 
                                  alt={item.snackId?.snackName}
                                  className="w-12 h-12 object-cover rounded"
                                />
                                <div>
                                  <p className="font-medium">{item.snackId?.snackName}</p>
                                  <p className="text-sm text-gray-600">
                                    {item.quantity} x {(item.price || 0).toLocaleString('vi-VN')}đ
                                  </p>
                                </div>
                              </div>
                              <p className="font-medium">
                                {((item.price || 0) * (item.quantity || 0)).toLocaleString('vi-VN')}đ
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 flex justify-between items-center">
                          <div className="text-lg font-semibold">
                            Tổng cộng: <span className="text-[#ff784e]">{(order.totalAmount || 0).toLocaleString('vi-VN')}đ</span>
                          </div>
                          <div className="flex space-x-2">
                            {order.orderStatus === 'pending' && (
                              <button
                                onClick={() => handleCancelOrder(order._id)}
                                className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                              >
                                Hủy đơn hàng
                              </button>
                            )}
                            <Link
                              to={`/orders/${order._id}`}
                              className="px-4 py-2 text-sm text-white bg-[#ff784e] hover:bg-[#cc603e] rounded-md transition-colors"
                            >
                              Xem chi tiết
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <FaComment className="text-[#ff784e]" />
                  <span className="font-medium">Đánh giá sản phẩm của tôi</span>
                </div>
                
                {loading ? (
                  <div className="text-center py-4">Đang tải...</div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-4 bg-gray-50 rounded-lg p-8">
                    <FaComment className="text-gray-300 text-5xl mx-auto mb-4" />
                    <p className="text-gray-500">Bạn chưa có đánh giá nào</p>
                    <Link to="/" className="mt-4 inline-block px-4 py-2 bg-[#ff784e] text-white rounded-lg hover:bg-[#cc603e]">
                      Khám phá sản phẩm
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review._id} className="border rounded-lg p-4 hover:shadow-md transition-all">
                        {editingReview && editingReview._id === review._id ? (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center mb-4">
                              <span className="mr-2">Đánh giá:</span>
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                    className="text-2xl"
                                  >
                                    <FaStar className={star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'} />
                                  </button>
                                ))}
                              </div>
                            </div>
                            
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Bình luận
                              </label>
                              <textarea
                                value={reviewForm.comment}
                                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                className="w-full p-2 border rounded-lg focus:ring-[#ff784e] focus:border-[#ff784e]"
                                rows="3"
                                required
                              />
                            </div>
                            
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={handleCancelEditReview}
                                className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-100"
                              >
                                Hủy
                              </button>
                              <button
                                onClick={handleUpdateReview}
                                disabled={loading}
                                className="px-3 py-1 bg-[#ff784e] text-white rounded hover:bg-[#cc603e] disabled:opacity-50"
                              >
                                {loading ? 'Đang cập nhật...' : 'Cập nhật'}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex justify-between">
                              <div>
                                <Link to={`/product/${review.snackId?._id}`} className="font-medium text-lg hover:text-[#ff784e]">
                                  {review.snackId?.snackName || 'Sản phẩm không tồn tại'}
                                </Link>
                                <div className="flex items-center mt-1">
                                  {[...Array(5)].map((_, index) => (
                                    <FaStar
                                      key={index}
                                      className={index < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                                    />
                                  ))}
                                  <span className="text-sm text-gray-500 ml-2">
                                    {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                  </span>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEditReview(review)}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  onClick={() => handleDeleteReview(review._id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </div>
                            
                            <div className="mt-3">
                              <p className="text-gray-700">{review.comment}</p>
                            </div>
                            
                            {review.snackId && (
                              <div className="mt-4 pt-3 border-t flex items-center">
                                <Link to={`/product/${review.snackId._id}`} className="flex items-center">
                                  <img
                                    src={Array.isArray(review.snackId.images) 
                                      ? review.snackId.images[0] 
                                      : review.snackId.images || 'https://via.placeholder.com/150?text=Không+có+ảnh'
                                    }
                                    alt={review.snackId.snackName}
                                    className="w-16 h-16 object-cover rounded"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = 'https://via.placeholder.com/150?text=Không+có+ảnh';
                                    }}
                                  />
                                  <div className="ml-3">
                                    <p className="font-medium">{review.snackId.snackName}</p>
                                    <p className="text-sm text-gray-500">Xem sản phẩm</p>
                                  </div>
                                </Link>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FaHeart className="text-[#ff784e]" />
                    <span className="font-medium">Sản phẩm yêu thích</span>
                  </div>
                </div>
                
                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#ff784e] border-t-transparent"></div>
                    <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
                  </div>
                ) : favorites.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg p-8">
                    <FaHeart className="text-gray-300 text-5xl mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">Chưa có sản phẩm yêu thích nào</p>
                    <Link to="/" className="mt-4 inline-block px-4 py-2 bg-[#ff784e] text-white rounded-lg hover:bg-[#cc603e]">
                      Khám phá sản phẩm
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((snack) => (
                      <div key={snack._id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        <Link to={`/product/${snack._id}`}>
                          <img 
                            src={Array.isArray(snack.images) ? snack.images[0] : snack.images} 
                            alt={snack.snackName}
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/300x200?text=Không+có+ảnh';
                            }}
                          />
                        </Link>
                        
                        <div className="p-4">
                          <Link to={`/product/${snack._id}`} className="block mb-2">
                            <h3 className="font-semibold text-lg hover:text-[#ff784e] truncate">{snack.snackName}</h3>
                          </Link>
                          
                          <div className="flex items-baseline mb-2">
                            {snack.discount > 0 ? (
                              <>
                                <span className="text-gray-400 line-through text-sm mr-2">
                                  {snack.price.toLocaleString('vi-VN')}đ
                                </span>
                                <span className="text-[#ff784e] font-semibold">
                                  {(snack.price * (1 - snack.discount / 100)).toLocaleString('vi-VN')}đ
                                </span>
                                <span className="ml-2 bg-red-100 text-red-600 text-xs px-1.5 py-0.5 rounded">
                                  -{snack.discount}%
                                </span>
                              </>
                            ) : (
                              <span className="text-[#ff784e] font-semibold">
                                {snack.price.toLocaleString('vi-VN')}đ
                              </span>
                            )}
                          </div>
                          
                          <div className="flex justify-between items-center mt-3">
                            <Link 
                              to={`/product/${snack._id}`}
                              className="text-sm text-[#ff784e] hover:underline"
                            >
                              Xem chi tiết
                            </Link>
                            
                            <button
                              onClick={() => handleRemoveFromFavorites(snack._id)}
                              className="text-gray-400 hover:text-red-500 p-1.5"
                            >
                              <FaTrash size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'snackpoints' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">SnackPoints</h2>
                
                <div className="flex items-center mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <BiCoin className="text-4xl text-yellow-500 mr-4" />
                  <div>
                    <p className="text-gray-600">Số SnackPoints hiện có:</p>
                    <p className="text-2xl font-bold text-yellow-600">{user?.snackPoints?.toLocaleString('vi-VN') || 0}</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Nạp SnackPoints</h3>
                  
                  {/* Chọn số tiền */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chọn số SnackPoints cần nạp
                    </label>
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      {[50000, 100000, 200000, 500000, 1000000, 2000000].map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => setSnackPointsAmount(amount.toString())}
                          className={`py-2 px-4 rounded-md border ${
                            snackPointsAmount === amount.toString()
                              ? 'bg-[#ff784e] text-white border-[#ff784e]'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {amount.toLocaleString('vi-VN')}đ
                        </button>
                      ))}
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        value={snackPointsAmount}
                        onChange={(e) => setSnackPointsAmount(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#ff784e] focus:border-[#ff784e]"
                        placeholder="Hoặc nhập số điểm khác"
                        min="10000"
                        step="10000"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-gray-500">VNĐ</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Phương thức thanh toán */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chọn phương thức thanh toán
                    </label>
                    
                    <div className="space-y-3">
                      {/* MoMo */}
                      <div className="border rounded-lg p-3 hover:shadow-md cursor-pointer bg-white transition-all">
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="momo" 
                            name="payment" 
                            className="h-4 w-4 text-[#ff784e] focus:ring-[#ff784e]"
                            defaultChecked
                          />
                          <label htmlFor="momo" className="ml-3 flex items-center cursor-pointer">
                            <div className="w-10 h-10 bg-[#ae2070] rounded-md flex items-center justify-center mr-3">
                              <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="MoMo" className="w-8 h-8 object-contain" />
                            </div>
                            <div>
                              <p className="font-medium">Ví MoMo</p>
                              <p className="text-xs text-gray-500">Thanh toán qua ví điện tử MoMo</p>
                            </div>
                          </label>
                        </div>
                        
                        <div className="ml-7 mt-3">
                          {snackPointsAmount && Number(snackPointsAmount) > 0 && (
                            <div className="flex bg-gray-50 p-3 rounded-md">
                              <div className="mr-4 bg-white p-2 rounded-md">
                                <div className="w-32 h-32 border border-gray-200 rounded-md overflow-hidden">
                                  <img
                                    src="/assets/momo-qr.jpg"
                                    alt="MoMo QR"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <p className="text-xs text-center mt-2 text-gray-500">Quét mã QR để thanh toán</p>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium mb-2">Hướng dẫn thanh toán</h4>
                                <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                                  <li>Mở ứng dụng MoMo trên điện thoại</li>
                                  <li>Chọn "Quét mã QR"</li>
                                  <li>Quét mã QR bên trái</li>
                                  <li>Xác nhận thanh toán {Number(snackPointsAmount).toLocaleString('vi-VN')}đ</li>
                                  <li>Nhấn "Xác nhận nạp SnackPoints" bên dưới</li>
                                </ol>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* VNPay */}
                      <div className="border rounded-lg p-3 hover:shadow-md cursor-pointer bg-white transition-all">
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="vnpay" 
                            name="payment" 
                            className="h-4 w-4 text-[#ff784e] focus:ring-[#ff784e]"
                          />
                          <label htmlFor="vnpay" className="ml-3 flex items-center cursor-pointer">
                            <div className="w-10 h-10 bg-[#0056b3] rounded-md flex items-center justify-center mr-3">
                              <img src="/assets/vnpay.png" alt="VNPay" className="w-8 h-8 object-contain" />
                            </div>
                            <div>
                              <p className="font-medium">VNPay</p>
                              <p className="text-xs text-gray-500">Thanh toán qua QR VNPay</p>
                            </div>
                          </label>
                        </div>
                      </div>
                      
                      {/* Ngân hàng */}
                      <div className="border rounded-lg p-3 hover:shadow-md cursor-pointer bg-white transition-all">
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="bank" 
                            name="payment" 
                            className="h-4 w-4 text-[#ff784e] focus:ring-[#ff784e]"
                          />
                          <label htmlFor="bank" className="ml-3 flex items-center cursor-pointer">
                            <div className="w-10 h-10 bg-[#2e7d32] rounded-md flex items-center justify-center mr-3">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l9-4 9 4v2H3V6z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18v8H3v-8z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12v8M12 12v8M17 12v8" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium">Thẻ ngân hàng</p>
                              <p className="text-xs text-gray-500">Thanh toán bằng thẻ ATM, Visa, Mastercard</p>
                            </div>
                          </label>
                        </div>
                        
                        <div className="ml-7 mt-3">
                          <div className="p-3 bg-gray-50 rounded-md">
                            <div className="mb-3">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Số thẻ</label>
                              <input 
                                type="text" 
                                placeholder="1234 5678 9012 3456" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#ff784e] focus:border-[#ff784e]"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3 mb-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Hết hạn</label>
                                <input 
                                  type="text" 
                                  placeholder="MM/YY" 
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#ff784e] focus:border-[#ff784e]"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                                <input 
                                  type="text" 
                                  placeholder="123" 
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#ff784e] focus:border-[#ff784e]"
                                />
                              </div>
                            </div>
                            <div className="mb-1">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Tên chủ thẻ</label>
                              <input 
                                type="text" 
                                placeholder="NGUYEN VAN A" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#ff784e] focus:border-[#ff784e]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Nút nạp */}
                  <button
                    onClick={handleLoadSnackPoints}
                    disabled={!snackPointsAmount || loadingPoints}
                    className="w-full bg-[#ff784e] text-white py-3 px-4 rounded-md hover:bg-[#cc603e] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed mt-4"
                  >
                    {loadingPoints ? 'Đang xử lý...' : `Nạp ${Number(snackPointsAmount || 0).toLocaleString('vi-VN')} SnackPoints`}
                  </button>
                </div>
                
                {/* Lịch sử giao dịch */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Lịch sử giao dịch</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số SnackPoints</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">24/07/2023</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Nạp SnackPoints qua MoMo</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">+100,000</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">18/07/2023</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Thanh toán đơn hàng #82741</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">-75,000</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">10/07/2023</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Hoàn tiền từ đơn hàng #82654</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">+50,000</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Thông tin về SnackPoints */}
                <div className="bg-gray-50 p-4 rounded-lg mt-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Thông tin về SnackPoints</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>SnackPoints là điểm thưởng dùng để mua sản phẩm trên SnackHub</li>
                    <li>1 SnackPoint = 1 VND khi thanh toán</li>
                    <li>SnackPoints không có thời hạn sử dụng</li>
                    <li>Bạn có thể dùng SnackPoints để thanh toán khi đặt hàng</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Address Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Xác nhận xóa địa chỉ</h3>
            <p className="text-gray-600 mb-6">Bạn có chắc chắn muốn xóa địa chỉ này? Hành động này không thể hoàn tác.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setAddressToDelete(null);
                }}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                disabled={loading}
              >
                Hủy
              </button>
              <button
                onClick={confirmDeleteAddress}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Confirmation Modal */}
      {showCancelOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Xác nhận hủy đơn hàng</h3>
            <p className="text-gray-600 mb-6">Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này không thể hoàn tác.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCancelOrderModal(false);
                  setOrderToCancel(null);
                }}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                disabled={loading}
              >
                Hủy
              </button>
              <button
                onClick={confirmCancelOrder}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Đang hủy...' : 'Hủy đơn hàng'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Review Confirmation Modal */}
      {showDeleteReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Xác nhận xóa đánh giá</h3>
            <p className="text-gray-600 mb-6">Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteReviewModal(false);
                  setReviewToDelete(null);
                }}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                disabled={loading}
              >
                Hủy
              </button>
              <button
                onClick={confirmDeleteReview}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Error Modal */}
      {showPasswordErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl transform transition-all animate-fade-in-down">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-red-600">
                <FaExclamationTriangle className="text-2xl mr-2" />
                <h3 className="text-lg font-bold">Lỗi đổi mật khẩu</h3>
              </div>
              <button 
                onClick={() => setShowPasswordErrorModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="p-4 bg-red-50 rounded-md border border-red-200 mb-4">
                <p className="text-red-800">{passwordErrorMessage}</p>
              </div>
              
              <div className="text-gray-600">
                <p className="text-sm mb-2">Vui lòng kiểm tra lại:</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Mật khẩu hiện tại phải chính xác</li>
                  <li>Mật khẩu mới phải có ít nhất 6 ký tự</li>
                  <li>Mật khẩu mới và xác nhận mật khẩu phải trùng khớp</li>
                </ul>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => setShowPasswordErrorModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors font-medium"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Favorite Confirmation Modal */}
      {showRemoveFavoriteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Xóa khỏi danh sách yêu thích</h3>
            <p className="text-gray-600 mb-6">Bạn có chắc chắn muốn xóa sản phẩm này khỏi danh sách yêu thích không?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRemoveFavoriteModal(false);
                  setRemovingFavorite(null);
                }}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                disabled={loading}
              >
                Hủy
              </button>
              <button
                onClick={confirmRemoveFromFavorites}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
