import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaShoppingCart, FaHistory, FaHeart, FaMapMarkerAlt, FaPlus, FaEdit, FaTrash, FaStar } from 'react-icons/fa';
import { getCurrentUser } from '../store/reducers/authReducer';
import { axiosInstance } from '../config/axiosConfig';
import { toast } from 'react-toastify';
import { hcmcDistricts } from '../utils/hcmcData';

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('profile');
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    district: '',
    ward: '',
    specificAddress: '',
    isDefault: false
  });
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [availableWards, setAvailableWards] = useState([]);
  const [orders, setOrders] = useState([]);

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

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Bạn có chắc muốn xóa địa chỉ này?')) return;
    try {
      setLoading(true);
      await axiosInstance.delete(`/api/users/addresses/${addressId}`);
      toast.success('Xóa địa chỉ thành công');
      fetchAddresses();
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

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;
    try {
      setLoading(true);
      await axiosInstance.delete(`/api/orders/${orderId}`);
      toast.success('Hủy đơn hàng thành công');
      fetchOrders();
    } catch (error) {
      console.error('Error canceling order:', error);
      toast.error('Không thể hủy đơn hàng');
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
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
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
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'profile'
                    ? 'text-[#ff784e] border-b-2 border-[#ff784e]'
                    : 'text-gray-600 hover:text-[#ff784e]'
                }`}
              >
                Thông tin cá nhân
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'addresses'
                    ? 'text-[#ff784e] border-b-2 border-[#ff784e]'
                    : 'text-gray-600 hover:text-[#ff784e]'
                }`}
              >
                Địa chỉ
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'orders'
                    ? 'text-[#ff784e] border-b-2 border-[#ff784e]'
                    : 'text-gray-600 hover:text-[#ff784e]'
                }`}
              >
                Đơn hàng
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'favorites'
                    ? 'text-[#ff784e] border-b-2 border-[#ff784e]'
                    : 'text-gray-600 hover:text-[#ff784e]'
                }`}
              >
                Yêu thích
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
                  <FaHistory className="text-[#ff784e]" />
                  <span className="font-medium">Lịch sử đơn hàng</span>
                </div>
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-4">Đang tải...</div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {orders?.map((order) => (
                        <div key={order._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="font-medium">Mã đơn hàng: {order._id}</p>
                              <p className="text-sm text-gray-600">
                                Ngày đặt: {new Date(order.orderDate).toLocaleDateString('vi-VN', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-[#ff784e]">
                                {(order.totalAmount || 0).toLocaleString('vi-VN')}đ
                              </p>
                              <p className={`text-sm ${
                                order.orderStatus === 'pending' ? 'text-yellow-600' :
                                order.orderStatus === 'completed' ? 'text-green-600' :
                                order.orderStatus === 'cancelled' ? 'text-red-600' :
                                'text-gray-600'
                              }`}>
                                {order.orderStatus === 'pending' ? 'Đang xử lý' :
                                 order.orderStatus === 'completed' ? 'Đã hoàn thành' :
                                 order.orderStatus === 'cancelled' ? 'Đã hủy' :
                                 order.orderStatus}
                              </p>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            {order.items?.map((item) => (
                              <div key={item._id} className="flex justify-between items-center py-2 border-b">
                                <div className="flex items-center space-x-2">
                                  <img 
                                    src={item.snackId?.images} 
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
                          
                          <div className="mt-4 pt-4 border-t">
                            <div className="flex justify-between text-sm">
                              <span>Phí vận chuyển:</span>
                              <span>{(order.shippingFee || 0).toLocaleString('vi-VN')}đ</span>
                            </div>
                            {order.couponApplied && (
                              <div className="flex justify-between text-sm text-green-600">
                                <span>Giảm giá:</span>
                                <span>-{(order.couponApplied.discount || 0).toLocaleString('vi-VN')}đ</span>
                              </div>
                            )}
                            <div className="flex justify-between font-medium mt-2">
                              <span>Tổng cộng:</span>
                              <span className="text-[#ff784e]">
                                {(order.totalAmount || 0).toLocaleString('vi-VN')}đ
                              </span>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex justify-end">
                            {order.orderStatus === 'pending' && (
                              <button
                                onClick={() => handleCancelOrder(order._id)}
                                className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                              >
                                Hủy đơn hàng
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
    </div>
  );
};

export default Profile;
