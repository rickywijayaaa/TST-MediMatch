import React, { useState } from "react";

const GenerateApi: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [appName, setAppName] = useState<string>("");
  const [organization, setOrganization] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGenerateApiKey = async () => {
    setError("");
    setApiKey(null);

    if (!email || !appName || !organization || !phone) {
      setError("All fields are required!");
      return;
    }

    setIsLoading(true);

    try {
      // Example API call to generate API key
      const response = await fetch("https://backend.medimatch.web.id/generate-api-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          application_name: appName, // Use correct key matching backend
          organization,
          phone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to generate API key. Please try again.");
      }

      const data = await response.json();
      setApiKey(data.api_key); // Replace 'api_key' with the actual response field
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          API Keys
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Manage your API keys for developer access.
        </p>

        {error && (
          <div className="text-red-500 text-center mb-4">{error}</div>
        )}

        {apiKey ? (
          <div className="bg-green-50 border border-green-400 text-green-700 p-4 rounded-lg text-center">
            <h2 className="text-lg font-bold">Your API Key</h2>
            <p className="text-sm mt-2 break-all">
              {apiKey}
            </p>
            <p className="text-xs text-gray-600 mt-4">
              Keep your API key secure. Do not share it publicly.
            </p>
          </div>
        ) : (
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
            <div className="mb-4">
              <label htmlFor="appName" className="block text-gray-700 mb-2">
                Application Name
              </label>
              <input
                type="text"
                id="appName"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter application name"
                required
                disabled={isLoading}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="organization" className="block text-gray-700 mb-2">
                Organization
              </label>
              <input
                type="text"
                id="organization"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter organization name"
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
                placeholder="Enter phone number"
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
