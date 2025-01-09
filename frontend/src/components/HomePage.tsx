import React, { useState } from "react";
import axios from "axios";
import logo from "../assets/logo.png";

// Define type for API response
interface DrugResult {
  id: string;
  medicine: string;
  composition: string;
}

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [topN, setTopN] = useState<number>(5);
  const [results, setResults] = useState<DrugResult[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResults([]);
    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://backend.medimatch.web.id/recommend",
        {
          drug_name: searchTerm,
          top_n: topN,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          // withCredentials: true,
          // Adding a timeout of 15 seconds
          timeout: 15000,
        }
      );

      const { name, combined_composition } = response.data.data;

      const transformedResults = Object.keys(name).map((key) => ({
        id: key,
        medicine: name[key],
        composition: combined_composition[key],
      }));

      setResults(transformedResults);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        if (err.code === 'ECONNABORTED') {
          setError('Request timed out. Please try again.');
        } else if (err.response) {
          // Server responded with error
          setError(err.response.data?.detail || 'Server error occurred.');
        } else if (err.request) {
          // Request made but no response
          setError('No response from server. Please check your connection.');
        } else {
          setError('Failed to make request. Please try again.');
        }
      } else {
        setError('An unexpected error occurred.');
      }
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left-Side Navigation Bar with Vertical Line */}
      <div className="w-1/6 bg-gray-100 p-6 flex flex-col border-r border-gray-300">
        <div className="flex items-center mb-10 pb-4 border-b border-gray-300">
          <img src={logo} alt="Logo" className="h-10 mr-2" />
        </div>

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
          Welcome to Medimatch
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
              placeholder="Enter medicine name (Aspirin, Paracetamol, Rhinos)"
              required
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-red-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {/* Search Results */}
        <div className="mt-6 w-full max-w-lg">
          {error && (
            <p className="text-red-500 text-center p-4 bg-red-50 rounded-lg">
              {error}
            </p>
          )}
          {results.length > 0 ? (
            <ul className="bg-white shadow-lg rounded-lg p-4">
              {results.map((result) => (
                <li key={result.id} className="text-gray-900 py-4 border-b last:border-b-0">
                  <p className="font-bold">{result.medicine}</p>
                  <p className="text-gray-600">{result.composition}</p>
                </li>
              ))}
            </ul>
          ) : (
            searchTerm &&
            !error &&
            !isLoading && (
              <p className="text-gray-500 text-center mt-4 p-4 bg-gray-50 rounded-lg">
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