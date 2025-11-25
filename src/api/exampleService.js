import axios from 'axios';

/**
 * Example API service
 * This file demonstrates how to structure API calls.
 */

// Example base URL (replace with actual backend URL)
const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

/**
 * Fetches data from an endpoint.
 * @returns {Promise<Object>} The response data.
 */
export const fetchExampleData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/todos/1`);
    return response.data;
  } catch (error) {
    console.error('Error fetching example data:', error);
    throw error;
  }
};
