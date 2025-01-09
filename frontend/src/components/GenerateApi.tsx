import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const GenerateApi: React.FC = () => {
  const [email, setEmail] = useState<string>(""); // Email input state
  const [phone, setPhone] = useState<string>(""); // Phone input state
  const [error, setError] = useState<string>(""); // Error message state
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state

  const navigate = useNavigate(); // React Router navigation

  const handleGenerateApiKey = async () => {
    setError("");

    if (!email || !phone) {
      setError("Both email and phone number are required!");
      return;
    }

    setIsLoading(true);

    try {
      // API call to generate API key
      const response = await fetch("https://backend.medimatch.web.id/generate-api-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          phone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to generate API key. Please try again.");
      }

      // Redirect to homepage upon successful API key generation
      navigate("/home");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Generate API Key
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Enter your email and phone number to generate an API key.
        </p>

        {error && (
          <div className="text-red-500 text-center mb-4">{error}</div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleGenerateApiKey();
          }}
        >
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="phone" className="block text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your phone number"
              required
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-red-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Generate API Key"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GenerateApi;
