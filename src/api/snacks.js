import { axiosInstance } from "../config/axiosConfig";

export const getAllSnacks = async () => {
    const res = await axiosInstance.get(`/api/snacks`);
    return res.data;
};

export const getSnackById = async (SnackId) => {
    const res = await axiosInstance.get(`api/snacks/${SnackId}`);
    return res.data;
};
export const getSnacksByCategoryId = async (categoryId) => {
    const res = await axiosInstance.get(`api/snacks/category/${categoryId}`);
    return res.data;
};