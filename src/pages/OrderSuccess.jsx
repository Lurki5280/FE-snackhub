import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaCheckCircle, FaHome, FaListAlt } from 'react-icons/fa';

function OrderSuccess() {
  const location = useLocation();
  const orderDetails = location.state?.order;
  const shippingAddress = location.state?.shippingAddress;

  if (!orderDetails || !shippingAddress) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <FaCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy thông tin đơn hàng</h2>
          <p className="text-gray-600 mb-6">Vui lòng kiểm tra lại hoặc tiếp tục mua sắm</p>
          <div className="flex flex-col space-y-3">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 bg-[#ff784e] text-white px-6 py-2 rounded-lg hover:bg-[#ff6b3d]"
            >
              <FaHome />
              <span>Trang chủ</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <div className="text-center mb-8">
          <FaCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Đặt hàng thành công!</h2>
          <p className="text-gray-600">Cảm ơn bạn đã mua hàng tại SnackHub</p>
        </div>

        <div className="border-t border-b border-gray-200 py-4 mb-6">
          <h3 className="font-semibold text-lg mb-3">Chi tiết đơn hàng #{orderDetails._id}</h3>
          <div className="space-y-4">
            {orderDetails.items?.map((item) => (
              <div key={item._id} className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <img
                    src={item.snackId?.images?.[0]}
                    alt={item.snackId?.snackName}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{item.snackId?.snackName}</p>
                    <p className="text-gray-500">Số lượng: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-semibold">{((item.price || 0) * (item.quantity || 0)).toLocaleString()}đ</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">Tạm tính:</span>
            <span>{orderDetails.items?.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 0)), 0).toLocaleString()}đ</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Phí vận chuyển:</span>
            <span>{(orderDetails.shippingFee || 0).toLocaleString()}đ</span>
          </div>
          {(orderDetails.couponApplied?.discount || 0) > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Giảm giá:</span>
              <span>-{(orderDetails.couponApplied?.discount || 0).toLocaleString()}đ</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg pt-2 border-t">
            <span>Tổng cộng:</span>
            <span className="text-red-600">
              {(orderDetails.totalAmount || 0).toLocaleString()}đ
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Thông tin giao hàng</h4>
            <p className="text-gray-600">{shippingAddress.fullName}</p>
            <p className="text-gray-600">{shippingAddress.phone}</p>
            <p className="text-gray-600">
              {shippingAddress.specificAddress}, {shippingAddress.ward}, {shippingAddress.district}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/"
              className="flex-1 flex items-center justify-center gap-2 bg-[#ff784e] text-white px-6 py-2 rounded-lg hover:bg-[#ff6b3d]"
            >
              <FaHome />
              <span>Trang chủ</span>
            </Link>
            {orderDetails._id ? (
              <Link
                to={`/orders/${orderDetails._id}`}
                className="flex-1 flex items-center justify-center gap-2 border border-[#ff784e] text-[#ff784e] px-6 py-2 rounded-lg hover:bg-gray-50"
              >
                <FaListAlt />
                <span>Xem chi tiết đơn hàng</span>
              </Link>
            ) : (
              <Link
                to="/profile?tab=orders"
                className="flex-1 flex items-center justify-center gap-2 border border-[#ff784e] text-[#ff784e] px-6 py-2 rounded-lg hover:bg-gray-50"
              >
                <FaListAlt />
                <span>Xem đơn hàng của tôi</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess; 