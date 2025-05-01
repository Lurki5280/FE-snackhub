import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { axiosInstance } from '../config/axiosConfig';
import { toast } from 'react-toastify';

const CartPage = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);

  const fetchCart = async () => {
    try {
      const response = await axiosInstance.get('/api/carts');
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Không thể tải giỏ hàng');
    }
  };

  const updateQuantity = async (snackId, quantity) => {
    try {
      setLoading(true);
      await axiosInstance.put(`/api/carts/${snackId}`, { quantity });
      await fetchCart();
      toast.success('Cập nhật số lượng thành công');
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Không thể cập nhật số lượng');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (snackId) => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/api/carts/${snackId}`);
      await fetchCart();
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Không thể xóa sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await axiosInstance.delete('/api/carts');
      await fetchCart();
      toast.success('Đã xóa toàn bộ giỏ hàng');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Không thể xóa giỏ hàng');
    } finally {
      setLoading(false);
    }
  };

  const applyCoupon = async (couponCode) => {
    try {
      setLoading(true);
      await axiosInstance.post('/api/carts/apply-coupon', { couponCode });
      await fetchCart();
      toast.success('Áp dụng mã giảm giá thành công');
    } catch (error) {
      console.error('Error applying coupon:', error);
      toast.error(error.response?.data?.message || 'Không thể áp dụng mã giảm giá');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async () => {
    try {
      setOrderLoading(true);
      const response = await axiosInstance.post('/api/orders', {
        paymentMethod: 'COD'  // Default to COD
      });
      toast.success('Đặt hàng thành công!');
      navigate('/profile'); // Redirect to profile page where orders can be viewed
    } catch (error) {
      console.error('Error creating order:', error);
      if (error.response?.status === 400 && error.response?.data?.message === 'No shipping address found. Please add an address first.') {
        toast.error('Vui lòng thêm địa chỉ giao hàng trước khi đặt hàng');
        navigate('/profile'); // Navigate to profile to add address
      } else if (error.response?.data?.invalidItems) {
        // Handle invalid items in cart
        const invalidItemsMessage = error.response.data.invalidItems
          .map(item => `${item.snackName}: ${item.reason}`)
          .join('\n');
        toast.error(`Một số sản phẩm trong giỏ hàng cần được cập nhật:\n${invalidItemsMessage}`);
      } else {
        toast.error(error.response?.data?.message || 'Không thể đặt hàng. Vui lòng thử lại sau.');
      }
    } finally {
      setOrderLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchCart();
  }, [token, navigate]);

  if (!cart) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            Đang tải giỏ hàng...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Giỏ hàng của bạn</h2>
          
          {cart.items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Giỏ hàng trống</p>
              <button
                onClick={() => navigate('/popular')}
                className="mt-4 bg-[#ff784e] text-white px-6 py-2 rounded-md hover:bg-[#cc603e]"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item.snackId._id}
                    className="flex items-center justify-between border-b pb-4"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.snackId.images}
                        alt={item.snackId.snackName}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-medium">{item.snackId.snackName}</h3>
                        <p className="text-sm text-gray-500">
                          {item.price.toLocaleString('vi-VN')}đ
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center border rounded">
                        <button
                          onClick={() => updateQuantity(item.snackId._id, item.quantity - 1)}
                          disabled={loading || item.quantity <= 1}
                          className="p-2 hover:bg-gray-100 disabled:opacity-50"
                        >
                          <FaMinus size={12} />
                        </button>
                        <span className="px-4 py-2">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.snackId._id, item.quantity + 1)}
                          disabled={loading || item.quantity >= item.snackId.stock}
                          className="p-2 hover:bg-gray-100 disabled:opacity-50"
                        >
                          <FaPlus size={12} />
                        </button>
                      </div>
                      
                      <p className="font-medium w-24 text-right">
                        {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                      </p>
                      
                      <button
                        onClick={() => removeFromCart(item.snackId._id)}
                        disabled={loading}
                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-4">
                {/* Coupon section */}
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    placeholder="Nhập mã giảm giá"
                    className="border rounded px-4 py-2 flex-1"
                  />
                  <button
                    onClick={() => applyCoupon(document.querySelector('input').value)}
                    disabled={loading}
                    className="bg-[#ff784e] text-white px-6 py-2 rounded hover:bg-[#cc603e] disabled:opacity-50"
                  >
                    Áp dụng
                  </button>
                </div>

                {/* Summary section */}
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
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Tổng cộng:</span>
                    <span className="text-[#ff784e]">
                      {(cart.totalPriceAfterDiscount || cart.totalPrice).toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex justify-between items-center pt-4">
                  <button
                    onClick={clearCart}
                    disabled={loading}
                    className="text-red-500 hover:text-red-600"
                  >
                    Xóa giỏ hàng
                  </button>
                  <div className="space-x-4">
                    <button
                      onClick={() => navigate('/popular')}
                      className="px-6 py-2 border rounded hover:bg-gray-50"
                    >
                      Tiếp tục mua sắm
                    </button>
                    <button
                      onClick={() => navigate('/order')}
                      disabled={loading}
                      className="bg-[#ff784e] text-white px-8 py-3 rounded-lg hover:bg-[#cc603e] disabled:opacity-50 font-semibold"
                    >
                      Tiến hành đặt hàng
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage; 