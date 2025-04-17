import { axiosInstance } from "../config/axiosConfig";

export const getProfile = async (token) =>{
    const res = await axiosInstance.get(`/api/users/profile`,{ 
        headers: {
        Authorization: `Bearer ${token}`,
    },
});
    return res.data;
}
export const updateProfile = async (formData,token) =>{
    const res = await axiosInstance.put(`api/users/profile`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
        }
    });
}
export const updatePassword = async () =>{
    const res = await axiosInstance.put(`/api/users/change-password`,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
}
export const getFavorites = async (token) =>{
    const res = await axiosInstance.get(`/api/users/favorites`,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
}
export const addFavorite = async (token) =>{
    const res = await axiosInstance.post(`/api/users/favorites`,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
}
export const deleteFavorite = async (token) =>{
    const res = await axiosInstance.delete(`/api/users/favorites`,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
}
