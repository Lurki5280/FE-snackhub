import { axiosInstance } from "../config/axiosConfig";
import { BASE_URL } from "../utils/appConstant";

axiosInstance.defaults.timeout = 10000;
export const authLogin = async (email, password) => {
  const response = await axiosInstance.post(`/api/auth/login`, {
    email,
    password,
  });
  return response.data;
};
export const authRegister = async ({ email, password, firstName, lastName, phone }) => {
  const response = await axiosInstance.post(`${BASE_URL}api/auth/register`, {
    email,
    password,
    firstName,
    lastName,
    phone
  });
  return response.data;
};

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await axiosInstance.put('/api/users/change-password', { 
      currentPassword, 
      newPassword 
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// API cho SnackPoints
export const getSnackPoints = async () => {
  try {
    const response = await axiosInstance.get('/api/users/snack-points');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const loadSnackPoints = async (amount) => {
  try {
    const response = await axiosInstance.post('/api/users/snack-points', { amount });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// API cho PayPal
export const createPayPalPayment = async (amount) => {
  try {
    const response = await axiosInstance.post('/api/payment/paypal/create', { amount });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Nạp SnackPoints qua MoMo hoặc VNPay
export const loadSnackPointsViaOther = async (amount, method) => {
  try {
    const response = await axiosInstance.post('/api/payment/other/process', {
      amount,
      method
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error loading SnackPoints via ${method}:`, error);
    throw new Error(error.response?.data?.message || `Không thể nạp SnackPoints qua ${method}`);
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await axiosInstance.post(`/api/auth/forgot-password`, { email });
    console.log('API Response:', response); // Debug
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response || error); // Debug
    throw error;
  }
};

export const verifyOTP = async (email, otp) => {
  try {
    const response = await axiosInstance.post(`/api/auth/verify-reset-code`, { 
      email,
      resetCode: otp 
    });
    console.log('Verify OTP Response:', response);
    return response.data;
  } catch (error) {
    console.error('Verify OTP Error:', error.response || error);
    throw error;
  }
};

export const resetPassword = async (email, newPassword) => {
  try {
    const response = await axiosInstance.post(`/api/auth/reset-password`, {
      email,
      newPassword
    });
    console.log('Reset Password Response:', response);
    return response.data;
  } catch (error) {
    console.error('Reset Password Error:', error.response || error);
    throw error;
  }
};