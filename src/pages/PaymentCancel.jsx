import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaExclamationCircle, FaArrowLeft, FaHome } from 'react-icons/fa';

const PaymentCancel = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <FaExclamationCircle className="text-yellow-500 text-6xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Thanh toán đã bị hủy</h1>
          <p className="text-gray-600 mb-6">
            Bạn đã hủy quá trình thanh toán. Không có SnackPoints nào được thêm vào tài khoản.
          </p>
          
          <div className="p-4 bg-gray-100 rounded-lg mb-6">
            <p className="text-gray-700 text-sm">
              Bạn có thể thử lại bất cứ lúc nào hoặc chọn phương thức thanh toán khác.
            </p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => navigate('/profile?tab=snackpoints')}
              className="w-full bg-[#ff784e] text-white py-3 rounded-md flex items-center justify-center hover:bg-[#e66b44] transition-all"
            >
              <FaArrowLeft className="mr-2" />
              Quay lại nạp SnackPoints
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="w-full border border-gray-300 bg-white text-gray-700 py-3 rounded-md flex items-center justify-center hover:bg-gray-50 transition-all"
            >
              <FaHome className="mr-2" />
              Trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel; 