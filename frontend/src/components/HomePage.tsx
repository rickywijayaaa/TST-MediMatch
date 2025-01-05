import React, { useState } from "react";
import logo from "../assets/logo.png"; // Import the logo

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>(""); // State for search input
  const [results, setResults] = useState<string[]>([]); // State for search results

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Mock data for drug search
    const drugs = [
      "Paracetamol",
      "Ibuprofen",
      "Amoxicillin",
      "Cetirizine",
      "Azithromycin",
      "Metformin",
      "Losartan",
      "Omeprazole",
    ];

    // Filter drugs that match the search term
    const filteredDrugs = drugs.filter((drug) =>
      drug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setResults(filteredDrugs); // Update results state
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left-Side Navigation Bar with Vertical Line */}
      <div className="w-1/6 bg-gray-100 p-6 flex flex-col border-r border-gray-300"> {/* Added border-r */}
        {/* Logo Section with Grey Line */}
        <div className="flex items-center mb-10 pb-4 border-b border-gray-300">
          <img src={logo} alt="Logo" className="h-10 mr-2" />
        </div>

        {/* Navigation Sections */}
        <div className="mb-8">
          <h2 className="text-gray-500 text-sm uppercase mb-4">Drugs Recommendation</h2>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="text-gray-800 hover:text-primary flex items-center"
              >
                <span className="material-icons-outlined mr-2">Drugs Feature</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-800 hover:text-primary flex items-center"
              >
                <span className="material-icons-outlined mr-2">Find Place</span>
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-gray-500 text-sm uppercase mb-4">Developer Mode</h2>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="text-gray-800 hover:text-primary flex items-center"
              >
                <span className="material-icons-outlined mr-2"></span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-800 hover:text-primary flex items-center"
              >
                <span className="material-icons-outlined mr-2"></span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-800 hover:text-primary flex items-center"
              >
                <span className="material-icons-outlined mr-2"></span>
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
        <form onSubmit={handleSearch} className="w-full max-w-lg">
          <div className="flex items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Search for drugs..."
              required
            />
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded-r-lg hover:bg-red-600 transition duration-300"
            >
              Search
            </button>
          </div>
        </form>

        {/* Search Results */}
        <div className="mt-6 w-full max-w-lg">
          {results.length > 0 ? (
            <ul className="bg-white shadow-lg rounded-lg p-4">
              {results.map((drug, index) => (
                <li
                  key={index}
                  className="text-gray-900 py-2 border-b last:border-b-0"
                >
                  {drug}
                </li>
              ))}
            </ul>
          ) : (
            searchTerm && (
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
