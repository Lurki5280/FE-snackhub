import { axiosInstance } from "../config/axiosConfig";

export const getAllCategories = async () => {
    const res = await axiosInstance.get(`/api/categories`);
    return res.data;
};

export const getSnackByCategoryId = async (CategoryId) => {
    const res = await axiosInstance.get(`api/categories/${CategoryId}/snacks`);
    return res.data;
};