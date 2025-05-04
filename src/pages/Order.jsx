import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { axiosInstance } from '../config/axiosConfig';
import { toast } from 'react-toastify';
import { FaMapMarkerAlt, FaCreditCard, FaMoneyBill, FaTruck, FaTimes, FaCheck } from 'react-icons/fa';
import { BiCoin } from 'react-icons/bi';
import { hcmcDistricts } from '../utils/hcmcData';
import { fetchCart as fetchCartAction } from '../store/reducers/cartReducer';


const Order = () => {
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [note, setNote] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [shippingFee, setShippingFee] = useState(0);
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
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [useSnackPoints, setUseSnackPoints] = useState(false);
  const [canUseSnackPoints, setCanUseSnackPoints] = useState(false);

  const fetchCart = async () => {
    try {
      const response = await axiosInstance.get('/api/carts');
      setCart(response.data);
      setCartItems(response.data.items);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Không thể tải thông tin giỏ hàng');
      navigate('/cart');
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await axiosInstance.get('/api/users/addresses');
      setAddresses(response.data);
      const defaultAddress = response.data.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
        if (cart && cart.totalPrice > 0) {
          fetchShippingFeeForAddress(defaultAddress);
        }
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast.error('Không thể tải danh sách địa chỉ');
    }
  };

  const handleDistrictChange = (districtId) => {
    setSelectedDistrict(districtId);
    const district = hcmcDistricts.find(d => d.id === districtId);
    setAvailableWards(district ? district.wards : []);
    setAddressForm({
      ...addressForm,
      district: district ? district.name : '',
      ward: ''
    });
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axiosInstance.post('/api/users/addresses', {
        fullName: addressForm.fullName,
        phone: addressForm.phone,
        district: addressForm.district,
        ward: addressForm.ward,
        specificAddress: addressForm.specificAddress,
        isDefault: addressForm.isDefault
      });

      if (response.data) {
        toast.success('Thêm địa chỉ thành công');
        setShowAddressForm(false);
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
        selectAddress(response.data);
      }
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error(error.response?.data?.message || 'Không thể lưu địa chỉ');
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      setLoading(true);
      const response = await axiosInstance.put(`/api/users/addresses/${addressId}/default`);
      if (response.data) {
        await fetchAddresses();
        toast.success('Đã cập nhật địa chỉ mặc định');
      }
    } catch (error) {
      console.error('Error setting default address:', error);
      toast.error('Không thể cập nhật địa chỉ mặc định');
    } finally {
      setLoading(false);
    }
  };

  // Chọn địa chỉ và tính phí ship ngay lập tức
  const selectAddress = (address) => {
    setSelectedAddress(address);
    // Gọi fetchShippingFee ngay lập tức thay vì chỉ dựa vào useEffect
    fetchShippingFeeForAddress(address);
  };

  const fetchShippingFeeForAddress = async (address) => {
    if (!address) return;
    try {
      setLoading(true); // Thêm loading state để người dùng biết đang tính toán
      console.log(`Calculating shipping fee for ward: ${address.ward}`);  // Debug log
      
      // Tính tổng giá trị đơn hàng
      const subtotal = cart.totalPriceAfterDiscount || cart.totalPrice;
      
      // Gửi cả thông tin phường và tổng giá trị đơn hàng
      const response = await axiosInstance.get(`/api/shipping/fee?ward=${address.ward}&totalAmount=${subtotal}`);
      
      if (response.data.success) {
        console.log(`Shipping fee result: ${response.data.fee}`);  // Debug log
        setShippingFee(response.data.fee);
        
        // Hiển thị thông báo miễn phí ship nếu đơn hàng trên 200k
        if (subtotal >= 200000 && response.data.fee === 0) {
          toast.info("Đơn hàng trên 200.000đ được miễn phí vận chuyển!");
        }
      } else {
        console.error('Error fetching shipping fee:', response.data.message);
        setShippingFee(30000); // Default fee if error
      }
    } catch (error) {
      console.error('Error fetching shipping fee:', error);
      setShippingFee(30000); // Default fee if error
    } finally {
      setLoading(false);
    }
  };

  // Fetch shipping fee from backend
  const fetchShippingFee = async () => {
    if (!selectedAddress) return;
    try {
      // Tính tổng giá trị đơn hàng
      const subtotal = cart.totalPriceAfterDiscount || cart.totalPrice;
      
      const response = await axiosInstance.get(`/api/shipping/fee?ward=${selectedAddress.ward}&totalAmount=${subtotal}`);
      if (response.data.success) {
        setShippingFee(response.data.fee);
      } else {
        console.error('Error fetching shipping fee:', response.data.message);
        setShippingFee(30000); // Default fee if error
      }
    } catch (error) {
      console.error('Error fetching shipping fee:', error);
      setShippingFee(30000); // Default fee if error
    }
  };

  // Update shipping fee when selectedAddress changes
  useEffect(() => {
    if (selectedAddress && cart) {
      fetchShippingFee();
    }
  }, [selectedAddress, cart]);

  // Calculate total amount including shipping fee
  const calculateTotalAmount = () => {
    if (!cart) return 0;
    const subtotal = cart.totalPriceAfterDiscount || cart.totalPrice;
    return subtotal + shippingFee;
  };

  // Check if user has enough SnackPoints
  useEffect(() => {
    if (user && user.snackPoints && calculateTotalAmount() > 0) {
      setCanUseSnackPoints(user.snackPoints >= calculateTotalAmount());
    } else {
      setCanUseSnackPoints(false);
    }
  }, [user, calculateTotalAmount]);

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/api/orders", {
        addressId: selectedAddress._id,
        paymentMethod,
        note: note,
        sendEmail: true,
        useSnackPoints: useSnackPoints
      });

      // Clear cart after successful order
      await axiosInstance.delete("/api/carts");
      setCartItems([]);
      localStorage.removeItem("cartItems");

      toast.success("Đặt hàng thành công! Email xác nhận sẽ được gửi đến địa chỉ email của bạn.");
      
      // Redirect to success page with order details
      navigate("/order-success", { 
        state: { 
          order: {
            _id: response.data._id,
            items: cartItems,
            totalPrice: cart.totalPrice,
            shippingFee,
            discount: cart.discount || 0,
            totalAmount: calculateTotalAmount(),
            couponApplied: appliedCoupon ? {
              code: appliedCoupon.code,
              discount: cart.discount || 0
            } : null,
            paymentMethod: useSnackPoints ? 'SnackPoints' : paymentMethod,
            snackPointsUsed: useSnackPoints ? calculateTotalAmount() : 0
          },
          shippingAddress: selectedAddress
        } 
      });
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi đặt hàng"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCoupon = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post('/api/carts/apply-coupon', { couponCode });
      toast.success('Mã giảm giá đã được áp dụng');
      setCouponCode('');
      setAppliedCoupon(response.data);
      await fetchCart();
    } catch (error) {
      console.error('Error applying coupon:', error);
      toast.error(error.response?.data?.message || 'Không thể áp dụng mã giảm giá');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      setLoading(true);
      await axiosInstance.post('/api/carts/remove-coupon');
      toast.success('Mã giảm giá đã được xóa');
      setCouponCode('');
      setAppliedCoupon(null);
      await fetchCart();
    } catch (error) {
      console.error('Error removing coupon:', error);
      toast.error(error.response?.data?.message || 'Không thể xóa mã giảm giá');
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật phí ship khi giá trị đơn hàng thay đổi (VD: sau khi áp dụng mã giảm giá)
  useEffect(() => {
    if (cart && selectedAddress && (cart.totalPrice > 0)) {
      fetchShippingFee();
    }
  }, [cart?.totalPrice, cart?.totalPriceAfterDiscount]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchCart();
    fetchAddresses();
  }, [token, navigate]);

  if (!cart || loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            Đang tải thông tin...
          </div>
        </div>
      </div>
    );
  }

  if (!addresses || addresses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <FaMapMarkerAlt className="mx-auto text-4xl text-[#ff784e] mb-4" />
              <h2 className="text-xl font-semibold mb-2">Bạn chưa có địa chỉ giao hàng</h2>
              <p className="text-gray-600 mb-4">Vui lòng thêm địa chỉ giao hàng để tiếp tục đặt hàng</p>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => navigate('/profile?tab=addresses')}
                className="bg-[#ff784e] text-white px-6 py-3 rounded-lg hover:bg-[#cc603e] font-semibold flex items-center"
              >
                <FaMapMarkerAlt className="mr-2" />
                Thêm địa chỉ giao hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FaMapMarkerAlt className="text-[#ff784e]" />
                <h2 className="text-xl font-semibold">Địa chỉ giao hàng</h2>
              </div>
              {!showAddressForm && (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div
                      key={address._id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedAddress?._id === address._id
                          ? 'border-[#ff784e] bg-orange-50'
                          : 'hover:border-gray-400'
                      }`}
                      onClick={() => selectAddress(address)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start flex-1">
                          <input
                            type="radio"
                            checked={selectedAddress?._id === address._id}
                            onChange={() => selectAddress(address)}
                            className="mt-1 text-[#ff784e] focus:ring-[#ff784e]"
                          />
                          <div className="ml-3">
                            <p className="font-medium">{address.fullName}</p>
                            <p className="text-gray-600">{address.phone}</p>
                            <p>{address.specificAddress}</p>
                            <p>
                              {address.ward}, {address.district}, TP.HCM
                            </p>
                            {address.isDefault && (
                              <span className="inline-block mt-2 text-sm text-[#ff784e]">
                                Địa chỉ mặc định
                              </span>
                            )}
                          </div>
                        </div>
                        
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="flex items-center text-[#ff784e] hover:text-[#cc603e]"
                  >
                    <FaMapMarkerAlt className="mr-2" />
                    Thêm địa chỉ mới
                  </button>
                </div>
              )}

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
                        {loading ? 'Đang lưu...' : 'Thêm địa chỉ'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FaCreditCard className="text-[#ff784e]" />
                <h2 className="text-xl font-semibold">Phương thức thanh toán</h2>
              </div>
              <div className="space-y-4">
                <div
                  className={`border rounded-lg p-4 cursor-pointer ${
                    paymentMethod === 'COD' && !useSnackPoints
                      ? 'border-[#ff784e] bg-orange-50'
                      : 'hover:border-gray-400'
                  }`}
                  onClick={() => {
                    setPaymentMethod('COD');
                    setUseSnackPoints(false);
                  }}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      checked={paymentMethod === 'COD' && !useSnackPoints}
                      onChange={() => {
                        setPaymentMethod('COD');
                        setUseSnackPoints(false);
                      }}
                      className="text-[#ff784e] focus:ring-[#ff784e]"
                    />
                    <div className="ml-3 flex items-center">
                      <FaMoneyBill className="text-green-600 mr-2" />
                      <span>Thanh toán khi nhận hàng (COD)</span>
                    </div>
                  </div>
                </div>
                
                {user && user.snackPoints !== undefined && (
                  <div
                    className={`border rounded-lg p-4 cursor-pointer ${
                      useSnackPoints
                        ? 'border-[#ff784e] bg-orange-50'
                        : canUseSnackPoints 
                          ? 'hover:border-gray-400' 
                          : 'opacity-60 cursor-not-allowed'
                    }`}
                    onClick={() => {
                      if (canUseSnackPoints) {
                        setUseSnackPoints(true);
                        setPaymentMethod('SnackPoints');
                      } else if (user.snackPoints > 0) {
                        toast.error(`Không đủ SnackPoints! Bạn cần thêm ${calculateTotalAmount() - user.snackPoints} SnackPoints.`);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          checked={useSnackPoints}
                          onChange={() => {
                            if (canUseSnackPoints) {
                              setUseSnackPoints(true);
                              setPaymentMethod('SnackPoints');
                            }
                          }}
                          disabled={!canUseSnackPoints}
                          className="text-[#ff784e] focus:ring-[#ff784e]"
                        />
                        <div className="ml-3 flex items-center">
                          <BiCoin className="text-yellow-500 mr-2" size={20} />
                          <span>Thanh toán bằng SnackPoints</span>
                        </div>
                      </div>
                      <div className="text-sm">
                        <span className={canUseSnackPoints ? "text-green-600" : "text-red-600"}>
                          {user.snackPoints?.toLocaleString('vi-VN')} / {calculateTotalAmount().toLocaleString('vi-VN')}
                        </span>
                      </div>
                    </div>
                    
                    {!canUseSnackPoints && user.snackPoints > 0 && (
                      <div className="mt-2 text-sm text-red-600 pl-7">
                        Không đủ SnackPoints! Còn thiếu {(calculateTotalAmount() - user.snackPoints).toLocaleString('vi-VN')} SnackPoints.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Order Note */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FaTruck className="text-[#ff784e]" />
                <h2 className="text-xl font-semibold">Ghi chú giao hàng</h2>
              </div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ghi chú cho người giao hàng..."
                className="w-full p-2 border rounded-md focus:border-[#ff784e] focus:ring-[#ff784e]"
                rows="3"
              />
            </div>

            {/* Coupon Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Mã giảm giá</h2>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Nhập mã giảm giá"
                  className="flex-1 p-2 border rounded-md focus:border-[#ff784e] focus:ring-[#ff784e]"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={loading || !couponCode}
                  className="px-4 py-2 bg-[#ff784e] text-white rounded-md hover:bg-[#cc603e] disabled:opacity-50"
                >
                  {loading ? 'Đang áp dụng...' : 'Áp dụng'}
                </button>
              </div>
              {appliedCoupon && (
                <div className="mt-2 text-green-600 flex items-center justify-between">
                  <span>Mã giảm giá: {appliedCoupon.code}</span>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTimes />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-semibold mb-4">Tổng quan đơn hàng</h2>
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.snackId._id} className="flex justify-between">
                    <div>
                      <p className="font-medium">
                        {item.snackId.snackName} x {item.quantity}
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.price.toLocaleString('vi-VN')}đ/sp
                      </p>
                    </div>
                    <p className="font-medium">
                      {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span>Tạm tính:</span>
                    <span>{cart.totalPrice.toLocaleString('vi-VN')}đ</span>
                  </div>
                  {cart.discount > 0 && (
                    <div className="flex justify-between mb-2 text-green-600">
                      <span>Giảm giá:</span>
                      <span>-{cart.discount.toLocaleString('vi-VN')}đ</span>
                    </div>
                  )}
                  <div className="flex justify-between mb-2">
                    <span>Phí vận chuyển:</span>
                    {loading ? (
                      <span>Đang tính phí...</span>
                    ) : (
                      <span>
                        {shippingFee === 0 ? (
                          <span className="text-green-600 font-medium">Miễn phí</span>
                        ) : (
                          `${shippingFee.toLocaleString('vi-VN')}đ`
                        )}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Tổng cộng:</span>
                    <span className="text-[#ff784e]">
                      {calculateTotalAmount().toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>
                {useSnackPoints && (
                  <div className="flex justify-between mt-2 text-sm text-green-600">
                    <span>Thanh toán bằng:</span>
                    <span className="font-medium">
                      {calculateTotalAmount().toLocaleString('vi-VN')} SnackPoints
                    </span>
                  </div>
                )}
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading || !selectedAddress}
                  className="w-full bg-[#ff784e] text-white py-3 rounded-lg font-semibold hover:bg-[#cc603e] disabled:opacity-50"
                >
                  {loading ? 'Đang xử lý...' : 'Đặt hàng'}
                </button>
                <button
                  onClick={() => navigate('/cart')}
                  className="w-full text-gray-600 hover:text-gray-800"
                >
                  Quay lại giỏ hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order; 