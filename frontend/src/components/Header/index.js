import React from "react";
import { FaBus } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom"; // Assuming you're using React Router

const Header = ({ showOptimalRouteButton }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleNetworkAnalysisClick = async () => {
    try {
      // Fetch data from the API
      const response = await fetch(
        "http://localhost:8000/get/routesOfAllZones"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      // Assuming the response is JSON data
      const data = await response.json();
      navigate(`/network-analysis`, {
        state: { routesData: data },
      });
      // Navigate to "/network-analysis-page" with the fetched data
      console.log("Data Fetched", data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleBackToHomeClick = () => {
    navigate("/");
  };

  return (
    <header className="bg-gradient-to-r from-blue-500 to-purple-600 py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaBus className="text-white text-3xl mr-2" />
            <h1 className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
              Bus Network Visual Analytics System
            </h1>
          </div>
          <nav className="flex">
            {location.pathname === "/network-analysis" ? (
              <button
                className="text-white ml-4 hover:text-gray-300"
                onClick={handleBackToHomeClick}
              >
                Back to Home
              </button>
            ) : (
              <button
                className="text-white ml-4 hover:text-gray-300"
                onClick={handleNetworkAnalysisClick}
              >
                Network Level Analysis
              </button>
            )}
            {/* {showOptimalRouteButton && (
              <button
                className="text-white ml-4 hover:text-gray-300"
                onClick={() => {
                  handleGetOptimalRoute();
                }}
              >
                Optimal Route
              </button>
            )} */}
            {(location.pathname.includes("/routes") ||
              location.pathname.includes("/heat") ||
              location.pathname.includes("/route-level-analysis")) && (
              <button
                className="text-white ml-4 hover:text-gray-300"
                onClick={handleBackToHomeClick}
              >
                Back to Home
              </button>
            )}
            {/* Add more navigation links here if needed */}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
