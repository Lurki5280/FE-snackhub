import { axiosInstance } from '../config/axiosConfig';

/**
 * Get all reviews for a specific snack
 * @param {string} snackId - ID of the snack
 * @returns {Promise<Array>} - Array of review objects
 */
export const getSnackReviews = async (snackId) => {
  try {
    const response = await axiosInstance.get(`/api/reviews/snacks/${snackId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching snack reviews:', error);
    throw error;
  }
};

/**
 * Create a new review for a snack
 * @param {string} snackId - ID of the snack
 * @param {Object} reviewData - Review data containing rating and comment
 * @returns {Promise<Object>} - Newly created review object
 */
export const createReview = async (snackId, reviewData) => {
  try {
    const response = await axiosInstance.post(`/api/reviews/snacks/${snackId}`, reviewData);
    return response.data;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

/**
 * Update an existing review
 * @param {string} reviewId - ID of the review to update
 * @param {Object} reviewData - Updated review data
 * @returns {Promise<Object>} - Updated review object
 */
export const updateReview = async (reviewId, reviewData) => {
  try {
    const response = await axiosInstance.put(`/api/reviews/${reviewId}`, reviewData);
    return response.data;
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
};

/**
 * Delete a review
 * @param {string} reviewId - ID of the review to delete
 * @returns {Promise<Object>} - Deletion result
 */
export const deleteReview = async (reviewId) => {
  try {
    const response = await axiosInstance.delete(`/api/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};

/**
 * Get all reviews by the current user
 * @returns {Promise<Array>} - Array of review objects
 */
export const getUserReviews = async () => {
  try {
    const response = await axiosInstance.get('/api/reviews/users/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    throw error;
  }
}; 