import axios from "axios";

export const useApi = () => {
  const baseURL = process.env.NEXT_PUBLIC_API_URL;

  const api = axios.create({
    baseURL,
    withCredentials: true,
  });

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
