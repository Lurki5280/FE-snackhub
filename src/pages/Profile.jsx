import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FaUser, FaShoppingCart, FaHistory, FaHeart, FaMapMarkerAlt, FaPlus, FaEdit, FaTrash, FaStar, FaClipboardList, FaComment } from 'react-icons/fa';
import { getCurrentUser } from '../store/reducers/authReducer';
import { axiosInstance } from '../config/axiosConfig';
import { toast } from 'react-toastify';
import { hcmcDistricts } from '../utils/hcmcData';
import { getUserReviews, updateReview, deleteReview } from '../api/reviews';

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
      await axiosInstance.delete(`/api/orders/${orderToCancel}`);
      toast.success('Hủy đơn hàng thành công');
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
    }
  }, [activeTab]);

  if (!user) {
    return null;
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
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'profile' && (
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
                          {!address.isDefault && (
                            <button
                              onClick={() => handleSetDefaultAddress(address._id)}
                              className="text-sm text-gray-600 hover:text-[#ff784e]"
                            >
                              Đặt làm mặc định
                            </button>
                          )}
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
                <div className="flex items-center space-x-2">
                  <FaHeart className="text-[#ff784e]" />
                  <span className="font-medium">Sản phẩm yêu thích</span>
                </div>
                {/* Favorite products will be added here */}
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
    </div>
  );
};

export default Profile;
