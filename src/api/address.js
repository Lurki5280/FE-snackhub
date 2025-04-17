import { axiosInstance } from "../config/axiosConfig";
export const getAddresses = async (token) =>{
    const res = await axiosInstance.get(`/api/users/addresses`,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
}
export const createAddress = async (address,token) =>{
    const res = await axiosInstance.post(`/api/users/addresses`, address, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
}
export const updateAddress = async (id,address,token) =>{
    const res = await axiosInstance.put(`/api/users/addresses/${id}`, address, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
}
export const deleteAddress = async (id,token) =>{
    const res = await axiosInstance.delete(`/api/users/addresses/${id}`,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
}