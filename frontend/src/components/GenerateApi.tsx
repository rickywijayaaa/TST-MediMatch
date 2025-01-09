import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase"; // Firebase auth import
import { onAuthStateChanged } from "firebase/auth";

const GenerateApi: React.FC = () => {
  const [email, setEmail] = useState<string>(""); // Email input state
  const [phone, setPhone] = useState<string>(""); // Phone input state
  const [apiKey, setApiKey] = useState<string | null>(null); // API Key state
  const [error, setError] = useState<string>(""); // Error message state
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state

  const navigate = useNavigate(); // React Router navigation

  useEffect(() => {
    // Check if the user is logged in and set the email
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        setEmail(user.email); // Auto-fill the email field
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const handleGenerateApiKey = async () => {
    setError("");
    setApiKey(null);

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

      const data = await response.json();
      setApiKey(data.api_key); // Set the generated API key
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    navigate("/home"); // Redirect to homepage
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

        {apiKey ? (
          // Popup-like display for the API key
          <div className="text-center">
            <div className="bg-green-50 border border-green-400 text-green-700 p-4 rounded-lg mb-4">
              <h2 className="text-lg font-bold">Your API Key</h2>
              <p className="text-sm mt-2 break-all">{apiKey}</p>
              <p className="text-xs text-gray-600 mt-4">
                Keep your API key secure. Do not share it publicly.
              </p>
            </div>
            <button
              onClick={handleContinue}
              className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
            >
              Continue
            </button>
          </div>
        ) : (
          // Form for generating API key
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
                disabled={true} // Disable email input since it's auto-filled
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
        )}
      </div>
    </div>
  );
};

export default GenerateApi;
