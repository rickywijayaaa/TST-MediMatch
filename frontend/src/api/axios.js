import axios from "axios";

// Create an Axios instance with a base URL
const axiosInstance = axios.create({
    baseURL: "https://backend.medimatch.web.id", // Base URL for your backend
    headers: {
        "Content-Type": "application/json", // Default headers for JSON requests
    },
});

// Function to fetch recommendations
export const fetchRecommendations = async (drugName, topN) => {
    try {
        const response = await axiosInstance.post("/recommend", {
            drug_name: drugName,
            top_n: topN,
        });
        console.log("Recommendations:", response.data);
        return response.data; // Return data for further use
    } catch (error) {
        console.error("Error fetching recommendations:", error.response?.data || error.message);
        throw error; // Rethrow error for the calling function to handle
    }
};

export default axiosInstance;