import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaCoins, FaHome } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { getCurrentUser } from '../store/reducers/authReducer';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  // Lấy số tiền từ query parameter
  const searchParams = new URLSearchParams(location.search);
  const amount = searchParams.get('amount') || 0;
  
  // Cập nhật thông tin user khi load trang
  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <FaCheckCircle className="text-green-500 text-6xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Thanh toán thành công!</h1>
          <p className="text-gray-600 mb-6">
            Bạn đã nạp thành công <span className="font-bold">{Number(amount).toLocaleString('vi-VN')}</span> SnackPoints vào tài khoản.
          </p>
          
          <div className="p-4 bg-yellow-50 rounded-lg mb-6 flex items-center justify-center">
            <FaCoins className="text-yellow-500 mr-2" />
            <span className="text-yellow-700">
              Số SnackPoints sẽ được cập nhật trong tài khoản của bạn.
            </span>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => navigate('/profile?tab=snackpoints')}
              className="w-full bg-[#ff784e] text-white py-3 rounded-md flex items-center justify-center hover:bg-[#e66b44] transition-all"
            >
              <FaCoins className="mr-2" />
              Xem SnackPoints
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

export default PaymentSuccess; 