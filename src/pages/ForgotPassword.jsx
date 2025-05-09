import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { forgotPassword, verifyOTP, resetPassword } from '../api/auth';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Vui lòng nhập email');
      return;
    }
    
    setLoading(true);
    try {
      await forgotPassword(email);
      toast.success('Mã xác nhận đã được gửi đến email của bạn');
      setStep(2);
    } catch (error) {
      console.error('Error:', error);
      if (error.response?.status === 404) {
        toast.error('Email không tồn tại trong hệ thống');
      } else {
        toast.error(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!verificationCode) {
      toast.error('Vui lòng nhập mã xác nhận');
      return;
    }

    setLoading(true);
    try {
      await verifyOTP(email, verificationCode);
      toast.success('Mã xác nhận hợp lệ');
      setStep(3);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Mã xác nhận không đúng hoặc đã hết hạn');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);
    try {
      const response = await resetPassword(email, newPassword);
      if (response.success) {
        toast.success('Đặt lại mật khẩu thành công');
        navigate('/login');
      } else {
        toast.error(response.message || 'Có lỗi xảy ra, vui lòng thử lại sau');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleSendCode} className="mt-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                required
              />
            </div>
            <button
              type="submit"
              className={`mt-6 bg-[#ff784e] text-white text-sm font-bold py-2 px-4 w-full rounded hover:bg-[#ff6b3d] focus:outline-none focus:shadow-outline ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? 'Đang gửi...' : 'Gửi mã xác nhận'}
            </button>
          </form>
        );

      case 2:
        return (
          <form onSubmit={handleVerifyOTP} className="mt-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Mã xác nhận
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                required
              />
            </div>
            <button
              type="submit"
              className={`mt-6 bg-[#ff784e] text-white text-sm font-bold py-2 px-4 w-full rounded hover:bg-[#ff6b3d] focus:outline-none focus:shadow-outline ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? 'Đang xác thực...' : 'Xác nhận'}
            </button>
          </form>
        );

      case 3:
        return (
          <form onSubmit={handleResetPassword} className="mt-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Mật khẩu mới
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                required
              />
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Xác nhận mật khẩu mới
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                required
              />
            </div>
            <button
              type="submit"
              className={`mt-6 bg-[#ff784e] text-white text-sm font-bold py-2 px-4 w-full rounded hover:bg-[#ff6b3d] focus:outline-none focus:shadow-outline ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
            </button>
          </form>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return 'Đặt lại mật khẩu';
      case 2:
        return 'Nhập mã xác nhận';
      case 3:
        return 'Tạo mật khẩu mới';
      default:
        return '';
    }
  };

  return (
    <div className="py-16 bg-[#FDEDEC] min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
        <div className="w-full p-8">
          <h2 className="text-2xl font-semibold text-gray-700 text-center">
            {getStepTitle()}
          </h2>

          {renderStepContent()}

          <div className="mt-4 text-center">
            <div className="flex justify-center items-center gap-4">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="text-sm text-[#ff784e] hover:text-[#ff6b3d]"
                >
                  Quay lại
                </button>
              )}
              <Link
                to="/login"
                className="text-sm text-[#ff784e] hover:text-[#ff6b3d]"
              >
                Quay lại đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 