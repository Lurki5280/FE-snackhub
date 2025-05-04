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