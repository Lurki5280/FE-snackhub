import { axiosInstance } from "../config/axiosConfig";

export const getUserFavorites = async () => {
  const response = await axiosInstance.get('/api/users/favorites');
  return response.data;
};

export const addToFavorites = async (snackId) => {
  const response = await axiosInstance.post(`/api/users/favorites/${snackId}`);
  return response.data;
};

export const removeFromFavorites = async (snackId) => {
  const response = await axiosInstance.delete(`/api/users/favorites/${snackId}`);
  return response.data;
};

export const checkIsFavorite = async (snackId) => {
  try {
    if (!snackId) {
      console.error("checkIsFavorite: Missing snackId parameter");
      return false;
    }
    
    const favorites = await getUserFavorites();
    
    // Kiểm tra null hoặc undefined
    if (!favorites) {
      console.error("Favorites is null or undefined");
      return false;
    }
    
    // Kiểm tra loại dữ liệu
    if (!Array.isArray(favorites)) {
      console.error("Favorites is not an array:", favorites);
      return false;
    }
    
    // Kiểm tra dữ liệu rỗng
    if (favorites.length === 0) {
      return false;
    }
    
    // Kiểm tra từng phần tử trước khi truy cập thuộc tính
    return favorites.some(favorite => 
      favorite && 
      typeof favorite === 'object' && 
      favorite._id === snackId
    );
  } catch (error) {
    console.error("Error checking if snack is in favorites:", error);
    return false;
  }
}; 