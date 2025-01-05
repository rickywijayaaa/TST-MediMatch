import React from "react";
import doctorImage from "../assets/doctor.png"; // Replace with your image path

const HeroSection: React.FC = () => {
  return (
    <section className="flex flex-col-reverse md:flex-row items-center bg-white py-12 px-6">
      {/* Left Text Section */}
      <div className="flex-1 text-center md:text-left space-y-6 md:pl-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Your <span className="text-primary">trusted partner</span> in digital healthcare.
        </h1>
        <p className="text-lg text-grayText">
          Empowering Your Health at Every Step. Experience personalized medical care from the comfort of your home.
          Connect with certified doctors, manage prescriptions, and schedule appointments with ease.
        </p>
        <div className="flex justify-center md:justify-start">
          <button className="bg-primary text-white w-64 py-4 text-xl font-bold rounded-md hover:bg-red-600 transition duration-300">
            Started Free
          </button>
        </div>
      </div>

      {/* Right Image Section */}
      <div className="flex-1 flex justify-center">
        <div className="relative bg-[#FF3E4D] rounded-full p-6">
          <img
            src={doctorImage}
            alt="Doctor"
            className="w-80 rounded-full shadow-lg"
            style={{ background: "transparent" }}
          />
          <div className="absolute -bottom-6 right-6 bg-white p-4 rounded-lg shadow-md">
            <p className="text-gray-900 font-bold">2400+ Happy Customers</p>
            <p className="text-grayText text-sm">(4.7 Stars)</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
