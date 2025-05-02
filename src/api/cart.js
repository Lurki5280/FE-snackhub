import { axiosInstance } from "../config/axiosConfig";


export const getCart = async (token) => {

    if (!token) {
        throw new Error("User not authenticated");
    }
    const res = await axiosInstance.get('/api/carts', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res;
};

export const addToCart = async (SnackId, quantity,token) => {
    if (!token) {
        throw new Error("User not authenticated");
    }
    const res = await axiosInstance.post('/api/carts', {
        SnackId,
        quantity
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
};

export const updateCartItem = async (snackId, quantity,token) => {
    if (!token) {
        throw new Error("User not authenticated");
    }
    const res = await axiosInstance.put(`/api/carts/${snackId}`, {
        quantity
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
};

export const removeFromCart = async (snackId,token) => {
    if (!token) {
        throw new Error("User not authenticated");
    }
    const res = await axiosInstance.delete(`/api/carts/${snackId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
};
export const removeCart = async (token) => {
    if (!token) {
        throw new Error("User not authenticated");
    }
    const res = await axiosInstance.delete(`/api/carts/`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
};