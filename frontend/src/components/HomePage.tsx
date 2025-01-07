import React, { useState } from "react";
import axios from "axios"; // Import Axios for API requests
import logo from "../assets/logo.png"; // Import the logo

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>(""); // State for search input
  const [topN, setTopN] = useState<number>(5); // Number of recommendations
  const [results, setResults] = useState<any[]>([]); // State for API results
  const [error, setError] = useState<string>(""); // State for error messages

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResults([]);

    try {
      // Send POST request to the backend `/recommend` endpoint
      const response = await axios.post("http://127.0.0.1:8000/recommend", {
        drug_name: searchTerm,
        top_n: topN,
      });

      // Parse the response to extract names and compositions
      const { name, combined_composition } = response.data.data;

      // Transform the data into a list of objects for easy rendering
      const transformedResults = Object.keys(name).map((key) => ({
        id: key,
        medicine: name[key],
        composition: combined_composition[key],
      }));

      setResults(transformedResults); // Update results with transformed data
    } catch (err: any) {
      if (err.response && err.response.data) {
        setError(err.response.data.detail || "Something went wrong");
      } else {
        setError("Failed to fetch recommendations. Please try again.");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left-Side Navigation Bar with Vertical Line */}
      <div className="w-1/6 bg-gray-100 p-6 flex flex-col border-r border-gray-300">
        {/* Logo Section with Grey Line */}
        <div className="flex items-center mb-10 pb-4 border-b border-gray-300">
          <img src={logo} alt="Logo" className="h-10 mr-2" />
        </div>

        {/* Navigation Sections */}
        <div className="mb-8">
          <h2 className="text-gray-500 text-sm uppercase mb-4">Drugs Recommendation</h2>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-gray-800 hover:text-primary flex items-center">
                <span className="material-icons-outlined mr-2">Drugs Feature</span>
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-800 hover:text-primary flex items-center">
                <span className="material-icons-outlined mr-2">Find Place</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
          Welcome to MediMatch
        </h1>
        <p className="text-lg text-grayText mb-8 text-center">
          Find the best drugs and medications tailored for your needs.
        </p>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="w-full max-w-lg space-y-4">
          <div>
            <label htmlFor="searchTerm" className="block text-gray-700 mb-2">
              Medicine Name:
            </label>
            <input
              type="text"
              id="searchTerm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter medicine name"
              required
            />
          </div>
          <div>
            <label htmlFor="topN" className="block text-gray-700 mb-2">
              Number of Alternatives:
            </label>
            <input
              type="number"
              id="topN"
              value={topN}
              onChange={(e) => setTopN(Number(e.target.value))}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter number of alternatives"
              min={1}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-red-600 transition duration-300"
          >
            Search
          </button>
        </form>

        {/* Search Results */}
        <div className="mt-6 w-full max-w-lg">
          {error && <p className="text-red-500 text-center">{error}</p>}
          {results.length > 0 ? (
            <ul className="bg-white shadow-lg rounded-lg p-4">
              {results.map((result) => (
                <li key={result.id} className="text-gray-900 py-4 border-b last:border-b-0">
                  <p className="font-bold">{result.medicine}</p>
                  <p>{result.composition}</p>
                </li>
              ))}
            </ul>
          ) : (
            searchTerm &&
            !error && (
              <p className="text-grayText text-center mt-4">
                No drugs found matching "{searchTerm}".
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
