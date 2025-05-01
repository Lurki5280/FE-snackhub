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