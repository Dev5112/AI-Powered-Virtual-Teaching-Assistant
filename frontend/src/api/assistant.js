import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const sendQuery = async (question, imageBase64) => {
  try {
    // The backend expects pure base64. Strip the data URL prefix if it exists.
    let base64Data = null;
    if (imageBase64) {
      const match = imageBase64.match(/^data:image\/[a-zA-Z]*;base64,(.*)$/);
      base64Data = match ? match[1] : imageBase64;
    }
    
    const response = await axios.post(`${API_BASE_URL}/api/`, {
      question: question,
      image: base64Data
    });
    
    return response.data;
  } catch (error) {
    console.error("Error communicating with Virtual TA API:", error);
    throw error;
  }
};
