import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

export default api;

export const useApi = () => {
  const handleRequest = async (request) => {
    try {
      const response = await request();
      return {
        data: response.data,
        error: null,
        success: true,
      };
    } catch (error) {
      console.error("API Error:", error);
      return {
        data: null,
        error: error.response?.data?.message || "Something went wrong",
        success: false,
      };
    }
  };

  return {
    get: (url) => handleRequest(() => api.get(url)),
    post: (url, data) => handleRequest(() => api.post(url, data)),
    put: (url, data) => handleRequest(() => api.put(url, data)),
    delete: (url) => handleRequest(() => api.delete(url)),
  };
};
