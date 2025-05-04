import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { BiCoin } from 'react-icons/bi';
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
    <div className="min-h-screen bg-gray-100 pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          {/* Order Success Header */}
          <div className="bg-green-500 text-white text-center py-8">
            <FaCheckCircle className="mx-auto text-5xl mb-4" />
            <h1 className="text-3xl font-semibold">Đặt hàng thành công!</h1>
            <p className="text-lg mt-2">
              Cảm ơn bạn đã đặt hàng tại SnackHub!
            </p>
          </div>

          {/* Order Details */}
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                Thông tin đơn hàng
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Mã đơn hàng:</p>
                  <p className="font-medium">{orderDetails._id}</p>
                </div>
                <div>
                  <p className="text-gray-600">Phương thức thanh toán:</p>
                  <p className="font-medium flex items-center">
                    {orderDetails.paymentMethod === 'SnackPoints' ? (
                      <>
                        <BiCoin className="text-yellow-500 mr-1" />
                        <span>Thanh toán bằng SnackPoints</span>
                      </>
                    ) : (
                      'Thanh toán khi nhận hàng (COD)'
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                Địa chỉ giao hàng
              </h2>
              <p className="font-medium">{shippingAddress.fullName}</p>
              <p>{shippingAddress.phone}</p>
              <p>
                {shippingAddress.specificAddress}, {shippingAddress.ward},{' '}
                {shippingAddress.district}
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                Sản phẩm đã đặt
              </h2>
              <div className="space-y-4">
                {orderDetails.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <div className="flex items-center">
                      <div className="ml-3">
                        <p className="font-medium">{item.snackId?.snackName}</p>
                        <p className="text-sm text-gray-600">
                          {item.price?.toLocaleString('vi-VN')}đ x {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium">
                      {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                Tổng thanh toán
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span>{orderDetails.totalPrice?.toLocaleString('vi-VN')}đ</span>
                </div>
                
                {orderDetails.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá:</span>
                    <span>-{orderDetails.discount?.toLocaleString('vi-VN')}đ</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>Phí vận chuyển:</span>
                  <span>
                    {orderDetails.shippingFee === 0
                      ? 'Miễn phí'
                      : `${orderDetails.shippingFee?.toLocaleString('vi-VN')}đ`}
                  </span>
                </div>
                
                <div className="flex justify-between border-t pt-2 text-lg font-semibold">
                  <span>Tổng cộng:</span>
                  <span className="text-[#ff784e]">
                    {orderDetails.totalAmount?.toLocaleString('vi-VN')}đ
                  </span>
                </div>
                
                {orderDetails.paymentMethod === 'SnackPoints' && orderDetails.snackPointsUsed > 0 && (
                  <div className="flex justify-between text-green-600 mt-2">
                    <span>Thanh toán bằng:</span>
                    <span className="flex items-center">
                      <BiCoin className="text-yellow-500 mr-1" />
                      {orderDetails.snackPointsUsed?.toLocaleString('vi-VN')} SnackPoints
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center space-x-4 mt-6">
              <Link
                to="/"
                className="bg-[#ff784e] text-white px-6 py-2 rounded-md hover:bg-[#cc603e] flex items-center"
              >
                <FaHome className="mr-2" />
                Trang chủ
              </Link>
              <Link
                to="/profile?tab=orders"
                className="border border-[#ff784e] text-[#ff784e] px-6 py-2 rounded-md hover:bg-orange-50 flex items-center"
              >
                <FaListAlt className="mr-2" />
                Đơn hàng của tôi
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess; 