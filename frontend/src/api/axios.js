import axios from "axios";

const fetchRecommendations = async (drugName, topN) => {
    try {
        const response = await axios.post("https://backend.medimatch.web.id/recommend", {
            drug_name: drugName,
            top_n: topN,
        });
        console.log(response.data);
    } catch (error) {
        console.error("Error fetching recommendations:", error.response?.data || error.message);
    }
};

fetchRecommendations("Augmentin", 5);
