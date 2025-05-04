import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { axiosInstance } from "../config/axiosConfig";
import Spinner from "../components/Spinner";
import { FaArrowLeft } from "react-icons/fa";

function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if token exists
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Vui lòng đăng nhập để xem chi tiết đơn hàng');
          return;
        }

        console.log('Fetching order details for ID:', id);
        const response = await axiosInstance.get(`/api/orders/${id}`);
        console.log('Order details response:', response.data);
        setOrder(response.data);
      } catch (error) {
        console.error('Error details:', error.response || error);
        setError(
          error.response?.data?.message || 
          'Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id]);

  if (loading) return <Spinner />;
  if (error) return (
    <div className="p-6 text-center">
      <p className="text-red-600 mb-4">{error}</p>
      <Link to="/profile" className="text-[#ff784e] hover:text-[#cc603e] inline-flex items-center">
        <FaArrowLeft className="mr-2" /> Quay lại
      </Link>
    </div>
  );
  if (!order) return (
    <div className="p-6 text-center">
      <p className="mb-4">Không tìm thấy đơn hàng</p>
      <Link to="/profile" className="text-[#ff784e] hover:text-[#cc603e] inline-flex items-center">
        <FaArrowLeft className="mr-2" /> Quay lại
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link to="/profile" className="inline-flex items-center text-[#ff784e] hover:text-[#cc603e] mb-6">
          <FaArrowLeft className="mr-2" /> Quay lại
        </Link>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6">Chi tiết đơn hàng #{order._id}</h2>
          
          {/* Thông tin đơn hàng */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-medium mb-3">Thông tin đặt hàng</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Ngày đặt:</span> {new Date(order.orderDate).toLocaleDateString('vi-VN')}</p>
                <p><span className="font-medium">Trạng thái:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-sm ${
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
                  </span>
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Thông tin giao hàng</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Người nhận:</span> {order.addressId?.fullName}</p>
                <p><span className="font-medium">Số điện thoại:</span> {order.addressId?.phone}</p>
                <p><span className="font-medium">Địa chỉ:</span> {order.addressId?.specificAddress}, {order.addressId?.ward}, {order.addressId?.district}</p>
              </div>
            </div>
          </div>

          {/* Chi tiết sản phẩm */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Sản phẩm đã đặt</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sản phẩm</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Đơn giá</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Số lượng</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.items?.map((item) => (
                    <tr key={item._id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img 
                            src={item.snackId?.images} 
                            alt={item.snackId?.snackName}
                            className="w-12 h-12 object-cover rounded-md mr-4"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{item.snackId?.snackName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-gray-500">
                        {(item.price || 0).toLocaleString('vi-VN')}đ
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-gray-900 font-medium">
                        {((item.price || 0) * (item.quantity || 0)).toLocaleString('vi-VN')}đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tổng cộng */}
          <div className="border-t pt-6">
            <div className="flex justify-end">
              <div className="w-full max-w-sm space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span>
                    {order.items
                      .reduce((total, item) => total + (item.price * item.quantity), 0)
                      .toLocaleString('vi-VN')}đ
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span>
                    {(order.shippingFee === 0) ? (
                      <span className="text-green-600">Miễn phí</span>
                    ) : (
                      `${(order.shippingFee || 0).toLocaleString('vi-VN')}đ`
                    )}
                  </span>
                </div>
                {(order.couponApplied?.discount || order.discount || 0) > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Giảm giá{order.couponApplied?.code ? ` (${order.couponApplied.code})` : ''}:</span>
                    <span>-{(order.couponApplied?.discount || order.discount || 0).toLocaleString('vi-VN')}đ</span>
                  </div>
                )}
                <div className="flex justify-between font-medium text-base">
                  <span>Tổng cộng:</span>
                  <span className="text-[#ff784e]">{(order.totalAmount || 0).toLocaleString('vi-VN')}đ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;