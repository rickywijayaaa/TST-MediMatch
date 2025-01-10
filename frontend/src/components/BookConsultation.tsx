import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BookConsultation: React.FC = () => {
  const [seatNumber, setSeatNumber] = useState<string>("");
  const [reservationDate, setReservationDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const navigate = useNavigate(); // Initialize navigate

  const handleBookConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://backend.medimatch.web.id/reservation",
        {
          seat_number: seatNumber,
          reservation_date: reservationDate,
        },
        {
          headers: {
            "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmaXJzYSIsImV4cCI6MTc2ODA0NDgwMH0.saIjnJQPtNxGopy-cLuTKfotHLnDd8J33DEDiOyc2r0`, // Replace with a valid token
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage("Reservation created successfully!");
        setTimeout(() => {
          navigate("/home"); // Redirect to homepage after 2 seconds
        }, 2000); // Adjust delay as needed
      }
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || "Failed to create reservation.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Book Consultation
        </h1>
        <form onSubmit={handleBookConsultation} className="space-y-4">
          <div>
            <label htmlFor="seatNumber" className="block text-gray-700 mb-2">
              Seat Number:
            </label>
            <input
              type="text"
              id="seatNumber"
              value={seatNumber}
              onChange={(e) => setSeatNumber(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter seat number (e.g., A12)"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="reservationDate" className="block text-gray-700 mb-2">
              Reservation Date:
            </label>
            <input
              type="date"
              id="reservationDate"
              value={reservationDate}
              onChange={(e) => setReservationDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-red-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Booking..." : "Book Now"}
          </button>
        </form>
        {successMessage && (
          <p className="mt-4 text-green-600 text-center">{successMessage}</p>
        )}
        {error && (
          <p className="mt-4 text-red-600 text-center">{error}</p>
        )}
      </div>
    </div>
  );
};

export default BookConsultation;
