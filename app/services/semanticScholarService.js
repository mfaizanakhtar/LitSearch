// apiService.js

import axios from 'axios';

const API_BASE_URL = 'https://api.semanticscholar.org/graph/v1/paper/search'; // Replace with the actual base URL of the API

// Function to make a GET request
const getRelevanceSearch = async (searchParams) => {
  try {
    // Prepare query parameters
    const queryParams = new URLSearchParams(searchParams);

    // Make the GET request using Axios
    const response = await axios.get(`${API_BASE_URL}?${queryParams}`);
    
    // Handle the response as needed
    return response.data;
  } catch (error) {
    // Handle errors
    console.error('There was an error fetching the documents:', error);
    throw error; // Re-throw the error if you want to handle it in the component
  }
};

export { getRelevanceSearch };
